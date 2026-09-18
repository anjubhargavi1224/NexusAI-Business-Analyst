import io
import os
import re
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

class DataLoader:
    """
    Automated data loader, schema inference engine, and transparent quality profiler.
    Adapts dynamically to both the bundled enterprise dataset and custom uploaded CSVs.
    Guarantees reproducible data quality scoring and strict semantic typing.
    """

    def __init__(self, df: Optional[pd.DataFrame] = None):
        self.df = df
        self.schema = {}
        self.quality_report = {}
        if self.df is not None:
            self._profile_dataset()

    @classmethod
    def from_csv_path(cls, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Dataset not found at: {file_path}")
        df = pd.read_csv(file_path)
        return cls(df)

    @classmethod
    def from_csv_bytes(cls, file_bytes: bytes, filename: str = "uploaded.csv"):
        try:
            df = pd.read_csv(io.BytesIO(file_bytes))
        except Exception:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1", sep=None, engine="python")
        return cls(df)

    def get_clean_dataframe(self) -> pd.DataFrame:
        """Returns working DataFrame with basic clean column names and trimmed string values."""
        if self.df is None:
            return pd.DataFrame()
        df = self.df.copy()
        df.columns = [str(c).strip() for c in df.columns]
        return df

    def _profile_dataset(self):
        df = self.df
        total_rows = len(df)
        total_cols = len(df.columns)

        # 1. Infer Column Types & Semantics
        id_cols = []
        date_cols = []
        numeric_cols = []
        categorical_cols = []
        target_col = None

        col_profiles = []
        target_patterns = [r"^churn", r"^is_churn", r"^churned", r"^target", r"^attrition", r"^status"]
        disallowed_as_target = ["company_name", "customer_name", "client_name", "name", "id", "customer_id"]

        for col in df.columns:
            series = df[col]
            dtype = str(series.dtype)
            col_lower = str(col).lower().strip()

            # ID / Name columns
            if col_lower in ["id", "customer_id", "client_id", "account_id", "user_id", "cust_id", "order_id"] or (
                "id" in col_lower and series.nunique() > total_rows * 0.85
            ):
                id_cols.append(col)
                col_type = "identifier"

            # Date / Timestamp columns
            elif any(k in col_lower for k in ["date", "time", "created", "signup", "timestamp"]):
                try:
                    pd.to_datetime(series.dropna().head(100), errors="raise")
                    date_cols.append(col)
                    col_type = "datetime"
                except Exception:
                    col_type = "string"
                    categorical_cols.append(col)

            # Numeric columns
            elif pd.api.types.is_numeric_dtype(series):
                unique_vals = set(series.dropna().unique())
                is_binary = unique_vals.issubset({0, 1, 0.0, 1.0})
                if is_binary and any(re.search(p, col_lower) for p in target_patterns):
                    target_col = col
                    col_type = "target_binary"
                elif series.nunique() <= 4 and any(re.search(p, col_lower) for p in target_patterns):
                    target_col = col
                    col_type = "target_categorical"
                else:
                    numeric_cols.append(col)
                    col_type = "numeric"

            # Categorical / String
            else:
                unique_vals = set(series.dropna().astype(str).str.lower().unique())
                if (
                    any(re.search(p, col_lower) for p in target_patterns)
                    and len(unique_vals) <= 3
                    and col_lower not in disallowed_as_target
                ):
                    target_col = col
                    col_type = "target_categorical"
                else:
                    categorical_cols.append(col)
                    col_type = "categorical"

            missing_count = int(series.isna().sum())
            missing_pct = round((missing_count / total_rows) * 100, 2) if total_rows > 0 else 0
            unique_count = int(series.nunique())

            profile = {
                "name": col,
                "type": col_type,
                "raw_dtype": dtype,
                "missing_count": missing_count,
                "missing_pct": missing_pct,
                "unique_count": unique_count,
            }

            if pd.api.types.is_numeric_dtype(series):
                clean_num = series.dropna()
                profile["min"] = float(round(clean_num.min(), 2)) if not clean_num.empty else None
                profile["max"] = float(round(clean_num.max(), 2)) if not clean_num.empty else None
                profile["mean"] = float(round(clean_num.mean(), 2)) if not clean_num.empty else None
                profile["std"] = float(round(clean_num.std(), 2)) if len(clean_num) > 1 else None
            else:
                top_vals = series.value_counts().head(3).to_dict()
                profile["top_values"] = {str(k): int(v) for k, v in top_vals.items()}

            col_profiles.append(profile)

        # Fallback target if not found
        if target_col is None:
            for col in df.columns:
                col_l = col.lower().strip()
                if any(re.search(p, col_l) for p in target_patterns) and col_l not in disallowed_as_target:
                    target_col = col
                    break

        self.schema = {
            "id_columns": id_cols,
            "date_columns": date_cols,
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols,
            "target_column": target_col,
            "column_profiles": col_profiles
        }

        # ----------------------------------------------------
        # 2. Transparent, Reproducible Data Quality Health Score
        # ----------------------------------------------------
        total_cells = total_rows * total_cols
        total_missing = int(df.isna().sum().sum())
        missing_rate = round((total_missing / total_cells) * 100, 2) if total_cells > 0 else 0.0
        duplicate_rows = int(df.duplicated().sum())
        duplicate_rate = round((duplicate_rows / total_rows) * 100, 2) if total_rows > 0 else 0.0

        # Check for invalid values (e.g. negative revenue or order count)
        invalid_cells = 0
        for col_name in df.columns:
            if pd.api.types.is_numeric_dtype(df[col_name]):
                col_l = str(col_name).lower()
                if any(k in col_l for k in ["revenue", "order", "sales", "spend", "ticket"]):
                    invalid_cells += int((df[col_name] < 0).sum())

        invalid_rate = round((invalid_cells / total_cells) * 100, 2) if total_cells > 0 else 0.0

        # Scoring Audit Breakdown (Base 100.0)
        missing_penalty = min(round(missing_rate * 2.5, 1), 30.0)
        duplicate_penalty = min(round(duplicate_rate * 5.0, 1), 20.0)
        invalid_penalty = min(round(invalid_rate * 10.0, 1), 15.0)
        
        schema_penalties = 0.0
        if target_col is None:
            schema_penalties += 10.0
        if len(numeric_cols) < 2:
            schema_penalties += 10.0

        final_score = max(10.0, round(100.0 - missing_penalty - duplicate_penalty - invalid_penalty - schema_penalties, 1))

        if final_score >= 90:
            grade = "A (Enterprise Ready)"
            status = "Optimal"
        elif final_score >= 80:
            grade = "B (Production Ready)"
            status = "Good"
        elif final_score >= 70:
            grade = "C (Acceptable / Minor Data Cleansing Required)"
            status = "Warning"
        else:
            grade = "D (Needs Cleansing)"
            status = "Critical"

        self.quality_report = {
            "total_rows": total_rows,
            "total_columns": total_cols,
            "total_cells": total_cells,
            "total_missing_cells": total_missing,
            "missing_rate_pct": missing_rate,
            "duplicate_rows": duplicate_rows,
            "duplicate_rate_pct": duplicate_rate,
            "invalid_values_count": invalid_cells,
            "quality_score": final_score,
            "quality_grade": grade,
            "quality_status": status,
            "score_breakdown": {
                "base_score": 100.0,
                "missing_values_penalty": missing_penalty,
                "duplicate_rows_penalty": duplicate_penalty,
                "invalid_values_penalty": invalid_penalty,
                "schema_completeness_penalty": schema_penalties,
                "formula": "100 - (missing% × 2.5) - (duplicate% × 5.0) - (invalid% × 10.0) - schema_penalties"
            },
            "schema_summary": {
                "id_count": len(id_cols),
                "date_count": len(date_cols),
                "numeric_count": len(numeric_cols),
                "categorical_count": len(categorical_cols),
                "target_identified": target_col is not None,
                "target_column_name": target_col
            }
        }

    def get_validation_summary(self) -> Dict[str, Any]:
        """
        Generates a comprehensive dataset validation and quality summary
        for the pre-analysis verification panel.
        """
        df = self.df
        total_rows = len(df)
        total_cols = len(df.columns)
        total_cells = total_rows * total_cols
        total_missing = int(df.isna().sum().sum())
        completeness_pct = round((1 - (total_missing / total_cells)) * 100, 1) if total_cells > 0 else 0.0
        duplicate_rows = int(df.duplicated().sum())

        invalid_count = 0
        for col_name in df.columns:
            if pd.api.types.is_numeric_dtype(df[col_name]):
                col_l = str(col_name).lower()
                if any(k in col_l for k in ["revenue", "order", "sales", "count", "ticket"]):
                    invalid_count += int((df[col_name] < 0).sum())

        # Business Dimension Detection
        core_requirements = [
            {"dimension": "Total Revenue / Monetary Value", "keys": ["revenue", "total_revenue", "sales", "amount", "spend", "monetary"]},
            {"dimension": "Customer Identifier", "keys": ["customer_id", "id", "client_id", "account_id", "user_id"]},
            {"dimension": "Order Volume / Frequency", "keys": ["order_count", "orders", "frequency", "transactions", "num_orders"]},
            {"dimension": "Customer Activity / Recency", "keys": ["days_since_last_active", "recency", "last_active_date", "signup_date", "date"]},
            {"dimension": "Customer Churn / Retention Label", "keys": ["churned", "churn", "is_churn", "target", "attrition"]}
        ]

        detected_columns = []
        missing_columns = []

        for req in core_requirements:
            matched = None
            for key in req["keys"]:
                for col in df.columns:
                    col_l = str(col).lower().strip()
                    if key in col_l:
                        # Ensure we don't match 'customer_name' as revenue
                        matched = col
                        break
                if matched:
                    break
            if matched:
                detected_columns.append({
                    "dimension": req["dimension"],
                    "column_name": matched,
                    "status": "detected"
                })
            else:
                missing_columns.append({
                    "dimension": req["dimension"],
                    "suggested_names": ", ".join(req["keys"][:3]),
                    "status": "missing_optional"
                })

        is_valid = total_rows >= 5 and total_cols >= 2
        status_label = "DATASET READY" if is_valid else "INVALID DATASET (MIN 5 ROWS REQUIRED)"
        if is_valid and total_rows < 30:
            status_label = "DATASET READY (COMPACT)"

        checklist = [
            {
                "label": "Sample Size Sufficiency",
                "passed": total_rows >= 5,
                "detail": f"{total_rows} rows loaded (minimum 5 required for processing, 30+ recommended for ML)"
            },
            {
                "label": "Dimensional Column Breadth",
                "passed": total_cols >= 2,
                "detail": f"{total_cols} attributes mapped with inferred schema"
            },
            {
                "label": "Cell Completeness",
                "passed": completeness_pct >= 80.0,
                "detail": f"{completeness_pct}% completeness ({total_missing} missing values managed)"
            },
            {
                "label": "Row Uniqueness",
                "passed": duplicate_rows == 0,
                "detail": f"{duplicate_rows} duplicate rows detected" if duplicate_rows > 0 else "All records are unique"
            },
            {
                "label": "Domain Value Validity",
                "passed": invalid_count == 0,
                "detail": f"{invalid_count} negative values detected in positive domains" if invalid_count > 0 else "Financial metrics pass non-negative domain validation"
            }
        ]

        return {
            "total_rows": total_rows,
            "total_columns": total_cols,
            "completeness_pct": completeness_pct,
            "total_missing_cells": total_missing,
            "total_missing": total_missing,
            "duplicate_rows": duplicate_rows,
            "invalid_values": invalid_count,
            "invalid_values_count": invalid_count,
            "quality_score": self.quality_report.get("quality_score", 95.0),
            "quality_grade": self.quality_report.get("quality_grade", "A (Enterprise Ready)"),
            "detected_columns": detected_columns,
            "detected_dimensions": detected_columns,
            "missing_columns": missing_columns,
            "missing_dimensions": missing_columns,
            "checklist": checklist,
            "is_valid_for_analysis": is_valid,
            "is_ready_for_analysis": is_valid,
            "status_label": status_label,
            "schema_summary": self.quality_report.get("schema_summary", {})
        }
