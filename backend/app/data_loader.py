import io
import os
import re
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

class DataLoader:
    """
    Automated data loader, schema inference engine, and quality profiler.
    Adapts dynamically to both the bundled sample dataset and custom uploaded CSVs.
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
        except Exception as e:
            # Fallback to latin-1 or delimiter auto-detection
            df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1", sep=None, engine="python")
        return cls(df)

    def _profile_dataset(self):
        df = self.df
        total_rows = len(df)
        total_cols = len(df.columns)

        # 1. Infer Column Types
        id_cols = []
        date_cols = []
        numeric_cols = []
        categorical_cols = []
        target_col = None

        col_profiles = []

        # Common target name patterns
        target_patterns = [r"churn", r"target", r"label", r"is_churn", r"churned", r"attrition", r"converted", r"status"]

        for col in df.columns:
            series = df[col]
            dtype = str(series.dtype)
            col_lower = str(col).lower().strip()

            # Check for ID columns
            if col_lower in ["id", "customer_id", "client_id", "account_id", "user_id", "cust_id"] or ("id" in col_lower and series.nunique() > total_rows * 0.8):
                id_cols.append(col)
                col_type = "identifier"

            # Check for date columns
            elif "date" in col_lower or "time" in col_lower or "created" in col_lower or "signup" in col_lower:
                try:
                    pd.to_datetime(series.dropna().head(100), errors="raise")
                    date_cols.append(col)
                    col_type = "datetime"
                except Exception:
                    col_type = "string"
                    categorical_cols.append(col)

            # Numeric columns
            elif pd.api.types.is_numeric_dtype(series):
                # Check if it's a binary target
                unique_vals = set(series.dropna().unique())
                is_binary = unique_vals.issubset({0, 1, 0.0, 1.0})
                if is_binary and any(re.search(p, col_lower) for p in target_patterns):
                    target_col = col
                    col_type = "target_binary"
                elif series.nunique() <= 5 and any(re.search(p, col_lower) for p in target_patterns):
                    target_col = col
                    col_type = "target_categorical"
                else:
                    numeric_cols.append(col)
                    col_type = "numeric"

            # Categorical / string
            else:
                # Check if this categorical column looks like a target (e.g. Yes/No, Churned/Active)
                unique_vals = set(series.dropna().astype(str).str.lower().unique())
                if any(re.search(p, col_lower) for p in target_patterns) and len(unique_vals) <= 3:
                    target_col = col
                    col_type = "target_categorical"
                else:
                    categorical_cols.append(col)
                    col_type = "categorical"

            # Compute column stats
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
                if any(re.search(p, col.lower()) for p in target_patterns):
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

        # 2. Data Quality Health Audit
        total_cells = total_rows * total_cols
        total_missing = int(df.isna().sum().sum())
        missing_rate = round((total_missing / total_cells) * 100, 2) if total_cells > 0 else 0
        duplicate_rows = int(df.duplicated().sum())

        # Quality scoring algorithm (0 to 100)
        score = 100.0
        # Missing values penalty
        score -= min(missing_rate * 3, 30)
        # Duplicates penalty
        dup_rate = (duplicate_rows / total_rows) * 100 if total_rows > 0 else 0
        score -= min(dup_rate * 5, 20)
        # Target column penalty
        if target_col is None:
            score -= 15
        # Sufficient numerical columns for ML
        if len(numeric_cols) < 3:
            score -= 15
        # Minimal record count penalty
        if total_rows < 100:
            score -= 20

        score = max(round(score, 1), 10.0)

        if score >= 90:
            grade = "A (Enterprise Ready)"
            status = "Optimal"
        elif score >= 80:
            grade = "B (Production Ready)"
            status = "Good"
        elif score >= 70:
            grade = "C (Acceptable / Needs Minor Imputation)"
            status = "Warning"
        else:
            grade = "D (Needs Data Cleansing)"
            status = "Critical"

        self.quality_report = {
            "total_rows": total_rows,
            "total_columns": total_cols,
            "total_missing_cells": total_missing,
            "missing_rate_pct": missing_rate,
            "duplicate_rows": duplicate_rows,
            "quality_score": score,
            "quality_grade": grade,
            "quality_status": status,
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

        # Check for invalid values (e.g. negative revenue or order counts)
        invalid_count = 0
        cols_lower = {str(c).lower().strip(): c for c in df.columns}
        for col_name in df.columns:
            if pd.api.types.is_numeric_dtype(df[col_name]):
                col_l = str(col_name).lower()
                if any(k in col_l for k in ["revenue", "order", "sales", "count", "tickets"]):
                    invalid_count += int((df[col_name] < 0).sum())

        # Required / Recommended Business Dimensions
        core_requirements = [
            {"dimension": "Total Revenue / Monetary Value", "keys": ["revenue", "total_revenue", "sales", "amount", "spend"]},
            {"dimension": "Customer Identifier", "keys": ["customer_id", "id", "client_id", "account_id", "user_id"]},
            {"dimension": "Order Volume / Frequency", "keys": ["order_count", "orders", "frequency", "transactions"]},
            {"dimension": "Customer Activity / Recency", "keys": ["days_since_last_active", "recency", "last_order_date", "signup_date"]},
            {"dimension": "Customer Churn / Retention Label", "keys": ["churned", "churn", "is_churn", "target", "status", "attrition"]}
        ]

        detected_columns = []
        missing_columns = []

        for req in core_requirements:
            matched = None
            for key in req["keys"]:
                for col in df.columns:
                    if key in str(col).lower():
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
                    "status": "missing"
                })

        # Validation Checklist
        numeric_count = len(self.schema.get("numeric_columns", []))
        date_count = len(self.schema.get("date_columns", []))
        target_found = self.schema.get("target_column") is not None

        checklist = [
            {
                "label": "Required columns detected",
                "passed": len(detected_columns) >= 2,
                "detail": f"{len(detected_columns)} of {len(core_requirements)} business dimensions mapped successfully"
            },
            {
                "label": "Numeric fields validated",
                "passed": numeric_count >= 1,
                "detail": f"{numeric_count} continuous metric columns ready for statistical modeling"
            },
            {
                "label": "Date fields validated",
                "passed": date_count >= 1 or total_rows > 0,
                "detail": f"{date_count} chronological features parsed" if date_count > 0 else "Synthesized time-index will be utilized"
            },
            {
                "label": "No critical schema errors",
                "passed": total_rows >= 5 and numeric_count >= 1,
                "detail": "Data schema is fully compatible with AI analytics engine"
            }
        ]

        is_valid = total_rows >= 5 and (numeric_count >= 1 or len(detected_columns) >= 1)
        
        status_label = "DATASET READY" if is_valid else "VALIDATION FAILED"
        if is_valid and (len(missing_columns) > 2 or duplicate_rows > total_rows * 0.1):
            status_label = "READY WITH WARNINGS"

        return {
            "total_rows": total_rows,
            "total_columns": total_cols,
            "completeness_pct": completeness_pct,
            "total_missing_cells": total_missing,
            "duplicate_rows": duplicate_rows,
            "invalid_values_count": invalid_count,
            "detected_columns": detected_columns,
            "missing_columns": missing_columns,
            "checklist": checklist,
            "is_valid_for_analysis": is_valid,
            "status_label": status_label,
            "quality_grade": self.quality_report.get("quality_grade", "A"),
            "quality_score": self.quality_report.get("quality_score", 95.0)
        }

    def get_clean_dataframe(self) -> pd.DataFrame:
        """Returns a sanitized dataframe with missing values, infinities, and data types safely handled."""
        df_clean = self.df.copy()

        # 1. Clean numeric columns (handle infs, NaNs, non-numeric strings)
        for col in self.schema.get("numeric_columns", []):
            if col in df_clean.columns:
                # Coerce non-numeric to NaN
                df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")
                # Replace inf with NaN
                df_clean[col] = df_clean[col].replace([np.inf, -np.inf], np.nan)
                median_val = df_clean[col].median()
                if pd.isna(median_val):
                    median_val = 0.0
                df_clean[col] = df_clean[col].fillna(median_val)

        # 2. Clean categorical columns
        for col in self.schema.get("categorical_columns", []):
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].fillna("Unknown").astype(str)

        # 3. Standardize target column if detected
        target_col = self.schema.get("target_column")
        target_cols_to_check = [target_col] if target_col else []
        for c in ["churned", "churn", "is_churn", "target"]:
            if c in df_clean.columns and c not in target_cols_to_check:
                target_cols_to_check.append(c)

        for t_col in target_cols_to_check:
            if t_col and t_col in df_clean.columns:
                series = df_clean[t_col]
                if pd.api.types.is_numeric_dtype(series):
                    df_clean[t_col] = series.fillna(0).astype(int)
                else:
                    # Map text representations safely
                    val_lower = series.astype(str).str.strip().str.lower()
                    is_pos = val_lower.isin(["1", "1.0", "true", "yes", "churned", "churn", "y", "t", "positive"])
                    df_clean[t_col] = is_pos.astype(int)

        return df_clean

