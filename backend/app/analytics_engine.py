from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

class AnalyticsEngine:
    """
    Computes deterministic business KPIs, period-over-period growth rates,
    cohort breakdowns, and customer segmentation metrics without hallucination or mock synthesis.
    Adheres strictly to dataset mathematical ground truth.
    """

    def __init__(self, df: pd.DataFrame, schema: Dict[str, Any]):
        self.df = df
        self.schema = schema

    def compute_executive_kpis(self) -> Dict[str, Any]:
        df = self.df
        numeric_cols = self.schema.get("numeric_columns", [])
        categorical_cols = self.schema.get("categorical_columns", [])
        date_cols = self.schema.get("date_columns", [])
        target_col = self.schema.get("target_column")
        id_cols = self.schema.get("id_columns", [])

        total_customers = len(df)

        # ----------------------------------------------------
        # 1. Total Gross Revenue
        # ----------------------------------------------------
        rev_col = None
        for candidate in ["total_revenue", "revenue", "sales", "total_sales", "amount", "spend", "monetary"]:
            if candidate in df.columns:
                rev_col = candidate
                break
        if not rev_col and numeric_cols:
            # Check if first numeric looks like revenue
            for c in numeric_cols:
                c_low = c.lower()
                if not any(k in c_low for k in ["id", "count", "days", "nps", "ticket", "hrs", "pct", "rate", "churn"]):
                    rev_col = c
                    break

        total_revenue = float(round(df[rev_col].sum(), 2)) if rev_col else 0.0

        # ----------------------------------------------------
        # 2. Active, Churned, and Total Customers
        # ----------------------------------------------------
        churned_customers = 0
        churn_rate = 0.0
        churn_identified = False

        if target_col and target_col in df.columns:
            target_series = df[target_col]
            churn_identified = True
            if pd.api.types.is_numeric_dtype(target_series):
                churned_customers = int((target_series.fillna(0) > 0).sum())
            else:
                val_lower = target_series.astype(str).str.strip().str.lower()
                churned_customers = int(val_lower.isin(["1", "1.0", "true", "yes", "churned", "churn", "y", "t"]).sum())
            
            if total_customers > 0:
                churn_rate = float(round((churned_customers / total_customers) * 100, 2))

        active_customers = max(0, total_customers - churned_customers) if churn_identified else total_customers
        retention_rate = float(round((active_customers / total_customers) * 100, 2)) if total_customers > 0 else 100.0

        # ----------------------------------------------------
        # 3. Average Order Value (AOV)
        # Formula: Total Revenue / Total Orders (or order-level mean)
        # Never default to mean(total_revenue) without order volume basis.
        # ----------------------------------------------------
        aov_available = False
        aov_value = None
        aov_formatted = "AOV unavailable — insufficient order-level information."
        aov_formula = "Unavailable"

        # Check for order count column
        order_col = None
        for c in ["order_count", "orders", "num_orders", "total_orders", "transactions", "frequency"]:
            if c in df.columns and pd.api.types.is_numeric_dtype(df[c]):
                order_col = c
                break

        total_orders = int(df[order_col].sum()) if order_col else 0

        if rev_col and order_col and total_orders > 0:
            aov_value = float(round(total_revenue / total_orders, 2))
            aov_available = True
            aov_formatted = f"${aov_value:,.2f}"
            aov_formula = "Total Revenue / Total Orders across accounts"
        elif "avg_order_value" in df.columns and pd.api.types.is_numeric_dtype(df["avg_order_value"]):
            aov_value = float(round(df["avg_order_value"].mean(), 2))
            aov_available = True
            aov_formatted = f"${aov_value:,.2f}"
            aov_formula = "Arithmetic mean of pre-computed order values"
        elif any("order_id" in str(c).lower() for c in id_cols) and rev_col and total_customers > 0:
            # Each row is an order
            aov_value = float(round(total_revenue / total_customers, 2))
            aov_available = True
            aov_formatted = f"${aov_value:,.2f}"
            aov_formula = "Total Revenue / Total Order Transactions (Row-level)"

        # ----------------------------------------------------
        # 4. Period-over-Period (PoP) Revenue Growth
        # Only compute if true temporal periods exist in dataset.
        # ----------------------------------------------------
        growth_available = False
        growth_rate = None
        growth_direction = "neutral"
        growth_reason = "Insufficient historical period data in the uploaded dataset."
        growth_formatted = "Growth: Not available"

        if date_cols and rev_col:
            dt_col = date_cols[0]
            try:
                temp_df = df.copy()
                temp_df["__dt"] = pd.to_datetime(temp_df[dt_col], errors="coerce")
                temp_df = temp_df.dropna(subset=["__dt"]).sort_values("__dt")
                
                # Check if we have at least 2 distinct monthly or quarterly periods
                temp_df["__period"] = temp_df["__dt"].dt.to_period("M").astype(str)
                distinct_periods = temp_df["__period"].unique()

                if len(distinct_periods) >= 2:
                    period_revs = temp_df.groupby("__period")[rev_col].sum()
                    prior_rev = float(period_revs.iloc[-2])
                    latest_rev = float(period_revs.iloc[-1])

                    if prior_rev > 0:
                        growth_rate = float(round(((latest_rev - prior_rev) / prior_rev) * 100, 2))
                        growth_direction = "positive" if growth_rate >= 0 else "negative"
                        growth_available = True
                        growth_formatted = f"{growth_rate:+.1f}% PoP Growth ({distinct_periods[-1]} vs {distinct_periods[-2]})"
                        growth_reason = f"Calculated from latest two complete chronological periods ({distinct_periods[-2]} to {distinct_periods[-1]})."
            except Exception:
                pass

        # ----------------------------------------------------
        # 5. Monthly Recurring Revenue (MRR)
        # Never label MRR as annualized or divide total revenue by 12 unless subscription data exists.
        # ----------------------------------------------------
        mrr_available = False
        mrr_total = None
        mrr_formatted = "MRR unavailable"
        mrr_reason = "The dataset does not contain sufficient subscription billing information to calculate true monthly recurring revenue."

        mrr_col = None
        for c in ["mrr", "monthly_recurring_revenue", "monthly_revenue", "recurring_revenue"]:
            if c in df.columns and pd.api.types.is_numeric_dtype(df[c]):
                mrr_col = c
                break

        if mrr_col:
            mrr_total = float(round(df[mrr_col].sum(), 2))
            mrr_available = True
            mrr_formatted = f"${mrr_total:,.2f}"
            mrr_reason = f"Computed deterministically from column '{mrr_col}'."

        # ----------------------------------------------------
        # 6. Product / Category Analytics (Semantic Integrity)
        # NEVER infer products from customer names.
        # ----------------------------------------------------
        prod_candidates = ["product_category", "product_line", "primary_product", "category", "product", "item_category"]
        disallowed_names = ["customer_name", "company_name", "client_name", "name", "customer_id", "id", "client_id", "account_name"]

        prod_col = None
        for cand in prod_candidates:
            if cand in df.columns and cand.lower() not in disallowed_names:
                # Ensure column doesn't have near-unique string cardinality (which indicates customer names/IDs)
                if df[cand].nunique() <= max(20, int(len(df) * 0.30)):
                    prod_col = cand
                    break

        product_analytics_available = False
        top_product_info = None

        if prod_col and rev_col:
            cat_rev = df.groupby(prod_col)[rev_col].sum().sort_values(ascending=False)
            if not cat_rev.empty:
                top_name = str(cat_rev.index[0])
                top_rev = float(round(cat_rev.iloc[0], 2))
                top_share = round((top_rev / total_revenue) * 100, 1) if total_revenue > 0 else 0.0
                product_analytics_available = True
                top_product_info = {
                    "available": True,
                    "column_used": prod_col,
                    "name": top_name,
                    "revenue": top_rev,
                    "revenue_formatted": f"${top_rev:,.2f}",
                    "share_pct": top_share
                }

        # Alternative supported metric: Highest Revenue Customer or Top Segment
        top_segment_info = None
        segment_candidates = ["tier", "industry", "contract_type", "region", "segment"]
        for seg in segment_candidates:
            if seg in df.columns and rev_col:
                s_rev = df.groupby(seg)[rev_col].sum().sort_values(ascending=False)
                if not s_rev.empty:
                    top_segment_info = {
                        "dimension": seg.replace("_", " ").title(),
                        "name": str(s_rev.index[0]),
                        "revenue": float(round(s_rev.iloc[0], 2)),
                        "share_pct": round((s_rev.iloc[0] / total_revenue) * 100, 1) if total_revenue > 0 else 0.0
                    }
                    break

        # Highest Revenue Customer
        name_col = None
        for c in ["company_name", "customer_name", "client_name", "name", "customer_id"]:
            if c in df.columns:
                name_col = c
                break
        
        top_customer_info = None
        if name_col and rev_col:
            c_sorted = df.sort_values(by=rev_col, ascending=False)
            if not c_sorted.empty:
                top_customer_info = {
                    "name": str(c_sorted.iloc[0][name_col]),
                    "revenue": float(round(c_sorted.iloc[0][rev_col], 2)),
                    "revenue_formatted": f"${float(c_sorted.iloc[0][rev_col]):,.2f}"
                }

        # ----------------------------------------------------
        # 7. Highest-Risk Customer Segment
        # ----------------------------------------------------
        highest_risk_segment = None
        for seg_cand in ["contract_type", "tier", "industry", "region"]:
            if seg_cand in df.columns and target_col:
                temp_df = df.copy()
                if not pd.api.types.is_numeric_dtype(temp_df[target_col]):
                    temp_df["__bin_target"] = temp_df[target_col].astype(str).str.lower().isin(["1", "true", "yes", "churned"]).astype(int)
                else:
                    temp_df["__bin_target"] = temp_df[target_col].astype(int)
                
                seg_churn = temp_df.groupby(seg_cand)["__bin_target"].agg(["count", "mean"])
                # Filter to segments with at least 2 records
                valid_segs = seg_churn[seg_churn["count"] >= 2]
                if not valid_segs.empty:
                    max_seg = valid_segs.sort_values(by="mean", ascending=False).iloc[0]
                    highest_risk_segment = {
                        "segment_type": seg_cand.replace("_", " ").title(),
                        "name": str(max_seg.name),
                        "customer_count": int(max_seg["count"]),
                        "churn_rate_pct": float(round(max_seg["mean"] * 100, 1))
                    }
                    break

        return {
            "total_customers": total_customers,
            "active_customers": active_customers,
            "churned_customers": churned_customers,
            "churn_identified": churn_identified,
            "churn_rate": churn_rate,
            "retention_rate": retention_rate,
            "total_revenue": total_revenue,
            "revenue_formatted": f"${total_revenue:,.2f}",
            "total_orders": total_orders,
            
            # AOV
            "aov_available": aov_available,
            "avg_order_value": aov_value,
            "aov_formatted": aov_formatted,
            "aov_formula": aov_formula,

            # Growth
            "growth_available": growth_available,
            "revenue_growth_pct": growth_rate,
            "growth_direction": growth_direction,
            "growth_formatted": growth_formatted,
            "growth_reason": growth_reason,

            # MRR
            "mrr_available": mrr_available,
            "mrr_total": mrr_total,
            "mrr_formatted": mrr_formatted,
            "mrr_reason": mrr_reason,

            # Product Line Analytics
            "product_analytics_available": product_analytics_available,
            "top_category": top_product_info,
            "top_segment": top_segment_info,
            "top_customer": top_customer_info,

            # Risk
            "highest_risk_segment": highest_risk_segment
        }

    def compute_trends_and_breakdowns(self) -> Dict[str, Any]:
        df = self.df
        rev_col = "total_revenue" if "total_revenue" in df.columns else (self.schema.get("numeric_columns") or [None])[0]
        date_cols = self.schema.get("date_columns", [])

        # 1. Period Trend Series
        trend_series = []
        trend_available = False
        trend_reason = "No valid timestamp or date column found in dataset."

        if date_cols and rev_col:
            dt_col = date_cols[0]
            try:
                temp_df = df.copy()
                temp_df["__dt"] = pd.to_datetime(temp_df[dt_col], errors="coerce")
                temp_df = temp_df.dropna(subset=["__dt"])
                if len(temp_df) >= 2:
                    temp_df["period"] = temp_df["__dt"].dt.to_period("M").astype(str)
                    grouped = temp_df.groupby("period").agg(
                        revenue=(rev_col, "sum"),
                        customers=("period", "count")
                    ).reset_index().sort_values("period")

                    if len(grouped) >= 2:
                        trend_available = True
                        trend_reason = f"Aggregated across {len(grouped)} monthly periods from '{dt_col}'."
                        for _, row in grouped.tail(14).iterrows():
                            trend_series.append({
                                "period": str(row["period"]),
                                "revenue": float(round(row["revenue"], 2)),
                                "customers": int(row["customers"])
                            })
            except Exception:
                pass

        # 2. Category / Dimension Breakdown
        prod_candidates = ["product_category", "product_line", "primary_product", "category", "product", "industry"]
        cat_col = None
        for cand in prod_candidates:
            if cand in df.columns and df[cand].nunique() <= 15:
                cat_col = cand
                break

        category_breakdown = []
        if cat_col and rev_col:
            cat_grouped = df.groupby(cat_col).agg(
                revenue=(rev_col, "sum"),
                customers=(cat_col, "count")
            ).reset_index().sort_values("revenue", ascending=False)
            total_rev = cat_grouped["revenue"].sum()
            for _, row in cat_grouped.iterrows():
                category_breakdown.append({
                    "category": str(row[cat_col]),
                    "revenue": float(round(row["revenue"], 2)),
                    "customers": int(row["customers"]),
                    "share_pct": round((row["revenue"] / total_rev) * 100, 1) if total_rev > 0 else 0.0
                })

        # 3. Region Breakdown
        region_col = "region" if "region" in df.columns else None
        region_breakdown = []
        if region_col and rev_col:
            reg_grouped = df.groupby(region_col).agg(
                revenue=(rev_col, "sum"),
                customers=(region_col, "count")
            ).reset_index().sort_values("revenue", ascending=False)
            for _, row in reg_grouped.iterrows():
                region_breakdown.append({
                    "region": str(row[region_col]),
                    "revenue": float(round(row["revenue"], 2)),
                    "customers": int(row["customers"])
                })

        # 4. Risk Breakdown
        tier_col = "tier" if "tier" in df.columns else ("contract_type" if "contract_type" in df.columns else None)
        target_col = self.schema.get("target_column")
        risk_distribution = []
        if tier_col and target_col:
            temp_df = df.copy()
            if not pd.api.types.is_numeric_dtype(temp_df[target_col]):
                temp_df["__target"] = temp_df[target_col].astype(str).str.lower().isin(["1", "true", "yes", "churned"]).astype(int)
            else:
                temp_df["__target"] = temp_df[target_col].astype(int)
            
            t_grp = temp_df.groupby(tier_col).agg(
                total_customers=(tier_col, "count"),
                churned_customers=("__target", "sum"),
                churn_rate=("__target", "mean")
            ).reset_index()

            for _, row in t_grp.iterrows():
                risk_distribution.append({
                    "segment": str(row[tier_col]),
                    "total": int(row["total_customers"]),
                    "churned": int(row["churned_customers"]),
                    "active": int(row["total_customers"] - row["churned_customers"]),
                    "churn_rate_pct": round(float(row["churn_rate"]) * 100, 1)
                })

        return {
            "trend_available": trend_available,
            "trend_reason": trend_reason,
            "trend_series": trend_series,
            "category_breakdown": category_breakdown,
            "region_breakdown": region_breakdown,
            "risk_distribution": risk_distribution
        }
