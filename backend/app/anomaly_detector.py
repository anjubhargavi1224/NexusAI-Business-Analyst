from typing import Dict, Any, List
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

class AnomalyDetector:
    """
    Detects multivariate operational and financial anomalies using
    Isolation Forest and statistical Z-score/IQR deviations.
    Translates statistical anomalies into actionable managerial alerts.
    """

    def __init__(self, df: pd.DataFrame, schema: Dict[str, Any]):
        self.df = df
        self.schema = schema

    def detect_business_anomalies(self) -> List[Dict[str, Any]]:
        df = self.df.copy()
        alerts = []

        rev_col = "total_revenue" if "total_revenue" in df.columns else (self.schema.get("numeric_columns") or [None])[0]
        date_cols = self.schema.get("date_columns", [])
        target_col = self.schema.get("target_column")

        # 1. Time-Series Revenue Drop Anomaly (Z-Score on monthly trends)
        if date_cols and rev_col:
            dt_col = date_cols[0]
            try:
                temp_df = df.copy()
                temp_df["__dt"] = pd.to_datetime(temp_df[dt_col], errors="coerce")
                temp_df = temp_df.dropna(subset=["__dt"])
                monthly = temp_df.groupby(temp_df["__dt"].dt.to_period("M"))[rev_col].sum()

                if len(monthly) >= 4:
                    mean_rev = monthly.mean()
                    std_rev = monthly.std()
                    if std_rev > 0:
                        z_scores = (monthly - mean_rev) / std_rev
                        min_month = z_scores.idxmin()
                        min_z = z_scores.min()

                        if min_z < -1.4:
                            pct_drop = round(abs((monthly[min_month] - mean_rev) / mean_rev) * 100, 1)
                            alerts.append({
                                "id": "ANOM-REV-01",
                                "severity": "critical" if min_z < -2.0 else "warning",
                                "title": f"Period Revenue Contraction Anomaly ({min_month})",
                                "metric_name": "Monthly Gross Inflow",
                                "statistical_deviation": f"{min_z:.1f}σ below historical mean (-{pct_drop}%)",
                                "evidence": f"Revenue in {min_month} was ${monthly[min_month]:,.2f}, compared with the trailing baseline of ${mean_rev:,.2f}.",
                                "business_implication": (
                                    "Suggests sudden procurement freezes, seasonal billing cyclicality, or contract renewal slippage. "
                                    "Note: Correlation with quarter-end dates does not prove direct churn causation without cohort inspection."
                                ),
                                "recommended_action": (
                                    "Audit deferred pipeline invoices and conduct renewal health checks for all accounts exceeding $50k ARR."
                                )
                            })
            except Exception:
                pass

        # 2. Multivariate Account Behavior Outliers using Isolation Forest
        candidates = ["order_count", "total_revenue", "support_tickets", "avg_resolution_hrs", "discount_pct"]
        feature_cols = [c for c in candidates if c in df.columns]

        if len(feature_cols) >= 2 and len(df) >= 10:
            X = df[feature_cols].copy()
            for c in feature_cols:
                X[c] = pd.to_numeric(X[c], errors="coerce").fillna(0.0)
            X_clean = np.nan_to_num(X.values, nan=0.0, posinf=0.0, neginf=0.0)
            contamination = min(0.05, max(0.01, 2.0 / len(df)))
            iso = IsolationForest(contamination=contamination, random_state=42)
            outliers = iso.fit_predict(X_clean)
            outlier_count = int((outliers == -1).sum())

            if outlier_count > 0:
                outlier_df = df[outliers == -1]
                avg_tickets = outlier_df["support_tickets"].mean() if "support_tickets" in outlier_df.columns else 0
                avg_rev = outlier_df["total_revenue"].mean() if "total_revenue" in outlier_df.columns else 0

                alerts.append({
                    "id": "ANOM-ISO-02",
                    "severity": "warning",
                    "title": "Multivariate Support-to-Spend Disparity Outliers",
                    "metric_name": f"Multivariate Feature Vector ({', '.join(feature_cols[:3])})",
                    "statistical_deviation": f"{outlier_count} accounts ({round((outlier_count/len(df))*100, 1)}% of base) flagged as multidimensional anomalies",
                    "evidence": (
                        f"Flagged cohort averages {avg_tickets:.1f} support tickets (vs {df['support_tickets'].mean():.1f} baseline) "
                        f"with an average revenue exposure of ${avg_rev:,.2f}."
                    ) if "support_tickets" in df.columns else f"{outlier_count} accounts exhibit abnormal multi-attribute variance.",
                    "business_implication": (
                        "High support friction combined with disproportionate revenue risk indicates product-market mismatch "
                        "or technical integration roadblocks for large enterprise contracts."
                    ),
                    "recommended_action": (
                        "Assign senior technical solutions engineers to unblock top 10 outlier accounts before contract renewal cycles."
                    )
                })

        # 3. Contract-Level Churn Concentration Risk
        if "contract_type" in df.columns and target_col and target_col in df.columns:
            temp_df = df.copy()
            if not pd.api.types.is_numeric_dtype(temp_df[target_col]):
                temp_df["__churn"] = temp_df[target_col].astype(str).str.lower().isin(["1", "true", "yes", "churned"]).astype(int)
            else:
                temp_df["__churn"] = temp_df[target_col].astype(int)

            churn_by_contract = temp_df.groupby("contract_type")["__churn"].agg(["mean", "count"])
            overall_churn = float(temp_df["__churn"].mean())

            if overall_churn > 0:
                for contract, row in churn_by_contract.iterrows():
                    if row["count"] >= 10 and row["mean"] > overall_churn * 1.5:
                        multiplier = row['mean'] / overall_churn if overall_churn > 0 else 1.0
                        alerts.append({
                            "id": f"ANOM-CTR-{abs(hash(str(contract))) % 1000}",
                            "severity": "critical",
                            "title": f"Disproportionate Churn Velocity in '{contract}' Accounts",
                            "metric_name": "Contract Cohort Attrition",
                            "statistical_deviation": f"{row['mean']*100:.1f}% cohort churn (vs {overall_churn*100:.1f}% baseline average)",
                            "evidence": f"Customers on {contract} contracts exhibit {multiplier:.1f}x higher attrition probability across {int(row['count'])} active accounts.",
                            "business_implication": (
                                "Low commitment friction allows dissatisfied users to exit rapidly without penalty. "
                                "Customer acquisition costs (CAC) cannot be amortized profitably over such short lifespans."
                            ),
                            "recommended_action": (
                                "Introduce annual commitment incentives with onboarding support credits to shift month-to-month users into 12-month agreements."
                            )
                        })
                        break

        # 4. Heavy Discount Erosion Anomaly
        if "discount_pct" in df.columns and "total_revenue" in df.columns:
            high_discount_mask = df["discount_pct"] > 30.0
            if high_discount_mask.sum() >= 5:
                high_disc_df = df[high_discount_mask]
                aov_disc = high_disc_df["avg_order_value"].mean() if "avg_order_value" in high_disc_df.columns else 0
                aov_normal = df[~high_discount_mask]["avg_order_value"].mean() if "avg_order_value" in df.columns else 0

                alerts.append({
                    "id": "ANOM-DISC-04",
                    "severity": "info",
                    "title": "Margin Compression in Promo-Dependent Cohorts",
                    "metric_name": "Discount Usage Frequency",
                    "statistical_deviation": f"{high_discount_mask.sum()} accounts with >30% discount utilization",
                    "evidence": f"Accounts with heavy discount utilization generate ${aov_disc:,.2f} AOV compared to ${aov_normal:,.2f} for standard pricing.",
                    "business_implication": (
                        "Discounting drives initial customer acquisition but degrades gross margins and conditions buyers to wait for promotional windows."
                    ),
                    "recommended_action": (
                        "Implement minimum order value (MOV) thresholds before promo code unlocks and restrict discretionary sales discounting."
                    )
                })

        return alerts
