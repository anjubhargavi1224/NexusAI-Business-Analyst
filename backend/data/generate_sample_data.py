"""
Data generator for NEXUS AI sample enterprise dataset.
Generates 2,000 realistic B2B/B2C SaaS & commerce customer records with
statistically coherent multi-factor relationships, non-deterministic churn drivers,
and realistic behavioral overlap.
"""
import os
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

def generate_enterprise_data(num_records: int = 2000, output_path: str = "nexus_ai_sample_business_data.csv") -> pd.DataFrame:
    np.random.seed(42)

    company_prefixes = [
        "Apex", "Vanguard", "Beacon", "Nexus", "Synergy", "Quantum", "Vertex", "Acro",
        "Horizon", "Pinnacle", "Stratum", "Crestview", "Aegis", "Pulse", "Omni", "Prism",
        "Kinetic", "Elevate", "Novus", "Terra", "Starlight", "CoreLogic", "Solstice", "Zenith"
    ]
    company_suffixes = [
        "Technologies", "Solutions", "Cloud", "Logistics", "Ventures", "Systems", "Health",
        "Global", "Labs", "Financial", "Retail Group", "Networks", "Media", "Capital", "Dynamics"
    ]

    industries = [
        "SaaS & Cloud Software",
        "FinTech & Payments",
        "Healthcare IT",
        "E-Commerce & Retail",
        "Manufacturing & Logistics",
        "Professional & Legal Services"
    ]
    industry_weights = [0.28, 0.22, 0.18, 0.14, 0.10, 0.08]

    regions = ["North America", "Europe (EMEA)", "Asia-Pacific", "Latin America"]
    region_weights = [0.46, 0.32, 0.16, 0.06]

    tiers = ["Enterprise", "Mid-Market", "Growth", "Starter"]
    tier_weights = [0.20, 0.35, 0.30, 0.15]

    contract_types = ["Annual Prepaid", "Multi-Year", "Quarterly", "Month-to-Month"]
    contract_weights = [0.40, 0.20, 0.18, 0.22]

    categories = [
        "Enterprise Analytics Suite",
        "Cloud Infrastructure Pro",
        "AI Decision Platform",
        "API Data Hub",
        "Security & Compliance Shield"
    ]
    category_weights = [0.32, 0.24, 0.22, 0.14, 0.08]

    records = []
    base_date = datetime(2026, 8, 31)

    for i in range(1, num_records + 1):
        cid = f"CUST-{1000 + i}"
        p = np.random.choice(company_prefixes)
        s = np.random.choice(company_suffixes)
        name = f"{p} {s} #{i%97 + 1}"
        
        industry = np.random.choice(industries, p=industry_weights)
        region = np.random.choice(regions, p=region_weights)
        tier = np.random.choice(tiers, p=tier_weights)
        contract = np.random.choice(contract_types, p=contract_weights)
        product_cat = np.random.choice(categories, p=category_weights)

        # Customer tenure (between 30 and 1100 days)
        tenure_days = int(np.random.gamma(shape=3.5, scale=80)) + 30
        tenure_days = min(tenure_days, 1100)
        signup_dt = base_date - timedelta(days=tenure_days)

        # Baseline recency (days since last active) - smooth distribution
        if contract == "Month-to-Month":
            recency = int(np.random.exponential(scale=35)) + 1
        else:
            recency = int(np.random.exponential(scale=20)) + 1
        recency = min(recency, 180)
        last_active_dt = base_date - timedelta(days=recency)

        # Volume and spend
        if tier == "Enterprise":
            orders = int(np.random.poisson(lam=28)) + 5
            aov = round(float(np.random.normal(loc=5400, scale=1100)), 2)
            aov = max(aov, 1600.0)
            mrr = round(aov * (orders / 12) * np.random.uniform(0.85, 1.15), 2)
            tickets = int(np.random.poisson(lam=4.2))
        elif tier == "Mid-Market":
            orders = int(np.random.poisson(lam=16)) + 3
            aov = round(float(np.random.normal(loc=2600, scale=600)), 2)
            aov = max(aov, 800.0)
            mrr = round(aov * (orders / 12) * np.random.uniform(0.85, 1.1), 2)
            tickets = int(np.random.poisson(lam=3.0))
        elif tier == "Growth":
            orders = int(np.random.poisson(lam=9)) + 2
            aov = round(float(np.random.normal(loc=1300, scale=320)), 2)
            aov = max(aov, 400.0)
            mrr = round(aov * (orders / 12) * np.random.uniform(0.8, 1.05), 2)
            tickets = int(np.random.poisson(lam=2.2))
        else: # Starter
            orders = int(np.random.poisson(lam=4)) + 1
            aov = round(float(np.random.normal(loc=550, scale=140)), 2)
            aov = max(aov, 180.0)
            mrr = round(aov * (orders / 12) * np.random.uniform(0.75, 1.0), 2)
            tickets = int(np.random.poisson(lam=1.5))

        total_rev = round(orders * aov, 2)
        resolution_hrs = round(float(np.random.gamma(shape=2.2, scale=4.5)) + (tickets * 0.7), 1)

        # Discount usage & NPS
        discount_pct = round(float(np.clip(np.random.beta(a=1.5, b=4.5) * 60, 0, 50)), 1)
        
        # NPS score (1 to 10)
        nps_base = 8.0 - (tickets * 0.35) - (recency / 40.0) - (resolution_hrs / 25.0)
        nps = int(np.clip(np.round(np.random.normal(loc=nps_base, scale=1.4)), 1, 10))

        # Realistic Probabilistic Churn Scoring (no deterministic cutoffs)
        churn_logit = -2.2
        churn_logit += (recency - 35) * 0.035
        churn_logit += (tickets - 2.5) * 0.22
        churn_logit += (resolution_hrs - 12) * 0.04
        churn_logit += (6.5 - nps) * 0.20
        churn_logit += (discount_pct - 15) * 0.02

        if contract == "Month-to-Month":
            churn_logit += 0.85
        elif contract == "Quarterly":
            churn_logit += 0.30
        elif contract == "Multi-Year":
            churn_logit -= 1.10
        else: # Annual Prepaid
            churn_logit -= 0.65

        if tier == "Starter":
            churn_logit += 0.35
        elif tier == "Enterprise":
            churn_logit -= 0.40

        # Add realistic unobserved variance / noise so no model achieves trivial 100%
        churn_logit += float(np.random.normal(loc=0.0, scale=0.6))

        # Convert logit to probability and sample binary churn
        churn_prob = 1.0 / (1.0 + np.exp(-churn_logit))
        churned = 1 if np.random.rand() < churn_prob else 0

        records.append({
            "customer_id": cid,
            "company_name": name,
            "industry": industry,
            "region": region,
            "tier": tier,
            "contract_type": contract,
            "product_category": product_cat,
            "signup_date": signup_dt.strftime("%Y-%m-%d"),
            "last_active_date": last_active_dt.strftime("%Y-%m-%d"),
            "days_since_last_active": recency,
            "order_count": orders,
            "avg_order_value": aov,
            "total_revenue": total_rev,
            "mrr": mrr,
            "support_tickets": tickets,
            "avg_resolution_hrs": resolution_hrs,
            "nps_score": nps,
            "discount_pct": discount_pct,
            "churned": churned
        })

    df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} records at {output_path}")
    print(f"Overall Churn Rate: {df['churned'].mean():.2%}")
    print(f"Total Revenue: ${df['total_revenue'].sum():,.2f}")
    return df

if __name__ == "__main__":
    dir_path = os.path.dirname(__file__)
    out1 = os.path.join(dir_path, "nexus_ai_sample_business_data.csv")
    out2 = os.path.join(dir_path, "nexus_enterprise_sample.csv")
    generate_enterprise_data(2000, out1)
    generate_enterprise_data(2000, out2)
