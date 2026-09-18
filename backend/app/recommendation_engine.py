from typing import Dict, Any, List
import pandas as pd
import numpy as np

class RecommendationEngine:
    """
    Synthesizes analytical computations, ML clustering, and predictive risk models
    into structured managerial decision frameworks:
    Finding -> Evidence -> Business Impact -> Recommended Action -> Transparent Priority Score.

    Strictly grounded in verified dataset figures without invented intervention percentages.
    """

    def __init__(self, df: pd.DataFrame, kpis: Dict[str, Any], segmentation: Dict[str, Any], ml_metrics: Dict[str, Any]):
        self.df = df
        self.kpis = kpis or {}
        self.segmentation = segmentation or {}
        self.ml_metrics = ml_metrics or {}

    def _calc_churn_rate(self, sub_df: pd.DataFrame, default_val: float = 0.0) -> float:
        """Calculates exact churn percentage across numeric, boolean, or string target representations."""
        if sub_df is None or len(sub_df) == 0:
            return default_val
        for c in ["churned", "churn", "is_churn", "target"]:
            if c in sub_df.columns:
                s = sub_df[c]
                if pd.api.types.is_numeric_dtype(s):
                    return float(round(s.fillna(0).mean() * 100, 1))
                val_lower = s.astype(str).str.strip().str.lower()
                is_pos = val_lower.isin(["1", "1.0", "true", "yes", "churned", "churn", "y", "t"])
                return float(round(is_pos.mean() * 100, 1))
        return default_val

    def _score_priority(self, impact_score: int, urgency_score: int, evidence_score: int) -> Dict[str, Any]:
        """
        Transparent priority calculation:
        Priority Rank = Impact (1-3) × Urgency (1-3) × Evidence Strength (1-3)
        Range: 1 to 27
        """
        composite = impact_score * urgency_score * evidence_score
        if composite >= 18:
            tier = "High"
            badge = "Critical Executive Priority"
        elif composite >= 8:
            tier = "Medium"
            badge = "Operational Priority"
        else:
            tier = "Low"
            badge = "Monitoring Initiative"

        return {
            "level": tier,
            "composite_score": composite,
            "badge": badge,
            "scoring_breakdown": {
                "impact_factor": impact_score,
                "urgency_factor": urgency_score,
                "evidence_strength": evidence_score,
                "formula": "Impact (1-3) × Urgency (1-3) × Evidence (1-3)"
            }
        }

    def generate_recommendations(self) -> List[Dict[str, Any]]:
        df = self.df
        kpis = self.kpis
        segments = self.segmentation.get("segment_summaries", [])
        total_rev = kpis.get("total_revenue", 0.0)
        churn_rate = kpis.get("churn_rate", 0.0)
        total_cust = kpis.get("total_customers", len(df))

        recommendations = []

        # ----------------------------------------------------
        # 1. Contract Structure & Month-to-Month Churn Signal
        # ----------------------------------------------------
        if "contract_type" in df.columns:
            m2m = df[df["contract_type"] == "Month-to-Month"]
            m2m_count = len(m2m)
            if m2m_count > 0:
                m2m_rev = float(m2m["total_revenue"].sum()) if "total_revenue" in m2m.columns else 0.0
                m2m_churn = self._calc_churn_rate(m2m, churn_rate)
                rev_share = (m2m_rev / total_rev * 100) if total_rev > 0 else 0.0

                p_score = self._score_priority(impact_score=3, urgency_score=3, evidence_score=3)

                recommendations.append({
                    "id": "REC-01",
                    "category": "Contract & Retention Strategy",
                    "finding": "Month-to-Month contract terms correlate with elevated account attrition compared to baseline.",
                    "evidence": f"Accounts on flexible terms ({m2m_count} accounts) show an observed {m2m_churn:.1f}% churn rate (vs. portfolio baseline of {churn_rate:.1f}%), representing ${m2m_rev:,.2f} ({rev_share:.1f}% of gross revenue).",
                    "business_impact": f"Voluntary attrition in this cohort directly exposes up to ${m2m_rev:,.2f} in annualized contractual revenue to recurring churn risk.",
                    "recommended_action": "Evaluate proactive contract-conversion incentives (such as bundled features or annual agreement terms) for flexible-billing accounts.",
                    "priority": p_score["level"],
                    "priority_details": p_score,
                    "pillar": "Retention & Renewal"
                })

        # ----------------------------------------------------
        # 2. At-Risk / Inactive Accounts Intervention
        # ----------------------------------------------------
        at_risk_seg = None
        for s in segments:
            if "At-Risk" in s.get("persona_name", ""):
                at_risk_seg = s
                break
        
        if at_risk_seg:
            seg_rev = at_risk_seg.get("total_revenue", 0.0)
            seg_cust = at_risk_seg.get("customer_count", 0)
            avg_inactive = at_risk_seg.get("avg_days_inactive", 0)
            seg_churn = at_risk_seg.get("churn_rate_pct", 0)

            p_score = self._score_priority(impact_score=3, urgency_score=2, evidence_score=3)

            recommendations.append({
                "id": "REC-02",
                "category": "Account Engagement & Outreach",
                "finding": "Extended inactivity is an observed risk signal associated with customer attrition in this dataset.",
                "evidence": f"The '{at_risk_seg.get('persona_name')}' cohort comprises {seg_cust} accounts generating ${seg_rev:,.2f} ({at_risk_seg.get('revenue_share_pct')}% of revenue) with an average of {avg_inactive:.0f} days since last activity and {seg_churn:.1f}% churn.",
                "business_impact": f"Dormancy in these accounts represents an immediate retention vulnerability of ${seg_rev:,.2f}.",
                "recommended_action": "Initiate structured account-review check-ins and customer success outreach prior to renewal milestones.",
                "priority": p_score["level"],
                "priority_details": p_score,
                "pillar": "Customer Engagement"
            })

        # ----------------------------------------------------
        # 3. High-Value Loyal Expansion
        # ----------------------------------------------------
        champ_seg = None
        for s in segments:
            if "High-Value" in s.get("persona_name", "") or "Loyal" in s.get("persona_name", ""):
                champ_seg = s
                break
        if champ_seg:
            c_rev = champ_seg.get("total_revenue", 0.0)
            c_count = champ_seg.get("customer_count", 0)
            c_share = champ_seg.get("revenue_share_pct", 0)
            c_churn = champ_seg.get("churn_rate_pct", 0)

            p_score = self._score_priority(impact_score=2, urgency_score=2, evidence_score=3)

            recommendations.append({
                "id": "REC-03",
                "category": "Account Expansion & Upsell",
                "finding": "Top revenue-generating cohort demonstrates established retention stability.",
                "evidence": f"The '{champ_seg.get('persona_name')}' cohort encompasses {c_count} accounts contributing ${c_rev:,.2f} ({c_share}% of revenue) with low observed churn ({c_churn:.1f}%).",
                "business_impact": "This stable account base provides a defensible foundation for strategic expansion and feature adoption.",
                "recommended_action": "Identify expansion opportunities and solicit structured product feedback through executive stakeholder forums.",
                "priority": p_score["level"],
                "priority_details": p_score,
                "pillar": "Account Expansion"
            })

        # ----------------------------------------------------
        # 4. Support Ticket Resolution & Operational Friction
        # ----------------------------------------------------
        if "support_tickets" in df.columns and "avg_resolution_hrs" in df.columns:
            slow_support = df[df["avg_resolution_hrs"] > 20.0]
            slow_count = len(slow_support)
            if slow_count >= 5:
                slow_churn = self._calc_churn_rate(slow_support, churn_rate)
                p_score = self._score_priority(impact_score=2, urgency_score=2, evidence_score=2)

                recommendations.append({
                    "id": "REC-04",
                    "category": "Operational Support Quality",
                    "finding": "Elevated support ticket resolution times correlate with higher observed churn in this dataset.",
                    "evidence": f"Accounts with average resolution times exceeding 20 hours ({slow_count} accounts) show an observed churn rate of {slow_churn:.1f}% versus the baseline of {churn_rate:.1f}%.",
                    "business_impact": "Technical and operational friction during incident resolution is an identified predictive signal for customer attrition.",
                    "recommended_action": "Review tier-1 ticket resolution workflows and evaluate support capacity allocation for mission-critical accounts.",
                    "priority": p_score["level"],
                    "priority_details": p_score,
                    "pillar": "Operational Efficiency"
                })

        # ----------------------------------------------------
        # Fallback Baseline Decision Cards (Guaranteed Grounding)
        # ----------------------------------------------------
        if len(recommendations) < 2:
            rev_fmt = kpis.get("revenue_formatted", "$0.00")
            aov_fmt = kpis.get("aov_formatted", "N/A")
            p_score = self._score_priority(impact_score=2, urgency_score=2, evidence_score=2)

            recommendations.append({
                "id": "REC-GEN-01",
                "category": "Revenue Realization",
                "finding": "Account distribution indicates opportunities for structured tier management.",
                "evidence": f"Verified dataset spans {total_cust:,} accounts generating {rev_fmt} in total revenue.",
                "business_impact": "Consistent account review cadence protects baseline revenue realization.",
                "recommended_action": "Implement systematic quarterly account reviews focused on product adoption and utilization.",
                "priority": p_score["level"],
                "priority_details": p_score,
                "pillar": "Account Management"
            })

        return recommendations
