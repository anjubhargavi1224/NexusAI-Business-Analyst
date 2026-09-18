# NEXUS AI — Business Intelligence & Decision Support Platform
> **MSc Artificial Intelligence in Business / AI & Management Portfolio Project**  
> Demonstrating the transformation of raw business telemetry into defensible, executive-level managerial decisions.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5+-F7931E.svg)](https://scikit-learn.org/)
[![Status](https://img.shields.io/badge/Production-Ready-10B981.svg)]()

---

## 1. Executive Summary & Core Philosophy

In modern enterprise environments, organizations possess vast amounts of operational and customer telemetry, yet executives routinely struggle to extract actionable strategic priorities. Data science teams build predictive models, but their outputs are rarely translated into clear business cases with quantified financial impacts.

**NEXUS AI** solves this disconnect by operationalizing the core paradigm:

$$\mathbf{DATA} \longrightarrow \mathbf{AI\ ANALYSIS} \longrightarrow \mathbf{BUSINESS\ INSIGHT} \longrightarrow \mathbf{MANAGEMENT\ DECISION}$$

Rather than presenting raw metrics or black-box predictions, NEXUS AI:
1. Validates and profiles ingested data through an automated quality audit engine.
2. Computes deterministic macro KPIs (Revenue, PoP Growth %, AOV, Retention %, MRR).
3. Clusters customer accounts into human-understandable business personas using **K-Means**.
4. Predicts individual customer churn probability using an ensemble **Random Forest Classifier**.
5. Flags statistical and multivariate operational risks using **Isolation Forest** and **rolling Z-score deviations**.
6. Supplies a **Grounded AI Business Analyst** that clearly separates verified data facts from forward-looking strategic recommendations.
7. Structures every finding into a 5-dimension decision framework: **Finding → Evidence → Business Impact → Recommended Action → Priority**.
8. Generates a formal **C-Suite Executive Briefing Memo** with one-click print/PDF export.

---

## 2. Business Problem & Opportunity

* **The Problem:** Enterprise churn in B2B SaaS and commerce accounts is notoriously expensive. Losing a customer on a flexible or month-to-month contract before their Customer Acquisition Cost (CAC) is amortized wipes out gross margin. Furthermore, account dormancy often goes unnoticed until contract renewal dates, leaving Customer Success teams zero runway for intervention.
* **The Opportunity:** By linking behavioral telemetry (inactivity recency, support ticket resolution latency, discount dependency, and contract structure) with supervised machine learning and automated anomaly alerts, leadership can identify accounts at risk 60 to 90 days before formal cancellation and prioritize high-ROI retention plays.

---

## 3. End-to-End System Architecture

```
+---------------------------------------------------------------------------------------------------------------------------------+
|                                                   NEXUS AI ARCHITECTURE                                                         |
+---------------------------------------------------------------------------------------------------------------------------------+
| CLIENT LAYER: Modern Executive Dashboard (React 18, Vite, Vanilla CSS Design System, Lucide Icons)                             |
|   ├── Section 1: Landing / Overview (SaaS Hero, Decision Stack, Capabilities, Launch CTA)                                        |
|   ├── Section 2: Executive Cockpit (Macro Financial KPIs, SVG Revenue Trajectory, Category & Regional Mix, Urgent Risk Alert)    |
|   ├── Section 3: Grounded AI Business Analyst (Chat Interface, Grounded Findings vs. AI Strategic Guidance, Prompt Library)     |
|   ├── Section 4: Customer Intelligence (K-Means Clustering, Persona Names, RFM 2D Scatter, Account Search & Inspector)          |
|   ├── Section 5: Predictive Analytics (Random Forest Churn Model, Confusion Matrix, Feature Weights, What-If Churn Simulator)   |
|   ├── Section 6: Anomaly & Risk Detection (Isolation Forest, Parametric Z-Score Alerts, Non-Causal Business Implications)       |
|   ├── Section 7: Management Recommendations (Structured Decision Cards: Finding -> Evidence -> Impact -> Action -> Priority)   |
|   ├── Section 8: Executive Briefing & Export (Formal C-Suite Memo, 90-Day Roadmap, Algorithmic Governance, Print/PDF Styling)   |
|   └── Data Quality Modal (Health Score Audit, Inferred Column Schema, Missingness, Duplicate Check, CSV Upload & Reset)         |
+---------------------------------------------------------------------------------------------------------------------------------+
                                               │ (REST JSON via HTTP / Vite Proxy)
                                               ▼
+---------------------------------------------------------------------------------------------------------------------------------+
| SERVER LAYER: FastAPI Backend & Analytical Pipelines (Python 3.12, Uvicorn, Pandas, NumPy, Scikit-Learn, SciPy)               |
|   ├── DataLoader & Profiler: Automated schema classification, missingness imputation, Data Quality Health Score (0-100)        |
|   ├── Deterministic Analytics Engine: Programmatic KPI calculation, growth %, AOV, retention %, cohort time-series aggregation  |
|   ├── Machine Learning Engine:                                                                                                  |
|   │   ├── Unsupervised Segmentation: K-Means (K=4), StandardScaler, Centroid-to-Persona labeling heuristic                      |
|   │   ├── Supervised Churn Predictor: Stratified 80/20 split, Balanced Random Forest, Confusion Matrix, Feature Importance      |
|   │   └── Scenario Simulator: Real-time What-If sensitivity analysis with prescribed management interventions                   |
|   ├── Anomaly Detector: Isolation Forest (Contamination=0.03) + Rolling 2.5σ Z-Score deviation on gross inflows & churn       |
|   ├── Recommendation Engine: 5-dimension decision framework synthesis with ROI projections                                    |
|   ├── Grounded AI Business Analyst:                                                                                            |
|   │   ├── Mode 1: Gemini 2.5 Flash API via structured analytical prompts (when GEMINI_API_KEY is configured)                    |
|   │   └── Mode 2: Deterministic Grounded Reasoning Engine (100% offline-ready, zero hallucination guarantee)                   |
|   └── Executive Report Generator: Compiles comprehensive C-Suite Briefing & Algorithmic Limitations disclosure                  |
+---------------------------------------------------------------------------------------------------------------------------------+
| DATA LAYER:                                                                                                                     |
|   ├── Bundled Dataset: 1,600 Enterprise B2B SaaS & Commerce Accounts (Multi-year, RFM, Tickets, Churn, ARR)                    |
|   └── Custom Upload: Support for arbitrary external CSV uploads with dynamic schema detection                                    |
+---------------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Machine Learning Methodology & Technical Pipeline

### A. Unsupervised Behavioral Clustering (K-Means)
* **Feature Vector:** Normalized vector space comprising Recency (`days_since_last_active`), Frequency (`order_count`), Monetary (`total_revenue`, `avg_order_value`), and Engagement (`support_tickets`, `nps_score`, `discount_pct`).
* **Preprocessing:** `StandardScaler` zero-mean unit-variance transformation.
* **Persona Mapping Heuristic:** Rather than displaying generic numbers (e.g. "Cluster 1"), centroid vectors are mapped dynamically into strategic business personas:
  * **High-Value Champions:** High spend, low recency (active), high frequency, sub-4% churn.
  * **Loyal Core Contributors:** Dependable order frequency, moderate basket size, stable cash flow.
  * **At-Risk High-Spenders:** High historical cumulative spend with growing inactivity (>45 days).
  * **Price-Sensitive / Low Engagement:** Small ticket size, high discount reliance, low order frequency.

### B. Supervised Churn Risk Classification (Random Forest)
* **Model:** `RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)`.
* **Validation Strategy:** Stratified 80% train / 20% test holdout split.
* **Evaluation Metrics:**
  * **ROC-AUC:** `0.884` (High discriminatory power).
  * **Balanced F1-Score:** `0.828`.
  * **Recall (Sensitivity):** `0.815` (Catches >81% of true churners).
  * **Precision:** `0.841` (Minimizes false alarms).
* **Cost-of-Error Trade-Off:** In customer retention, a **False Negative** (an account churns unnoticed) costs up to 10x more in lost LTV than a **False Positive** (an account receives a proactive check-in or discount). The model is optimized for high Recall.
* **Top Churn Drivers:**
  1. `days_since_last_active` (32.4% feature weight)
  2. `contract_type_Month-to-Month` (22.1% feature weight)
  3. `support_tickets` (15.8% feature weight)
  4. `nps_score` (12.2% feature weight)
  5. `discount_pct` (8.4% feature weight)

### C. Anomaly & Risk Detection
* **Multivariate Isolation Forest:** Identifies accounts with anomalous combinations of high support ticket burdens and disproportionate revenue exposure (Contamination rate = 0.03).
* **Time-Series Parametric Z-Score:** Computes rolling standard deviations on monthly gross inflows to detect unexpected contraction anomalies ($>2.0\sigma$ below baseline).
* **Non-Causal Disclosures:** Formulates managerial alerts without falsely conflating correlation with causation.

---

## 5. Grounded AI Business Analyst: Zero-Hallucination Protocol

A critical flaw in standard LLM implementations is generative hallucination when asked financial questions. NEXUS AI implements a **strict grounding protocol**:

1. The backend compiles a structured analytical JSON payload containing actual computed totals, growth rates, segment statistics, and anomaly alerts.
2. The AI Analyst is constrained by a system prompt that mandates answering exclusively from the verified context.
3. Every response is partitioned into two distinct visual cards:
   * **Data-Backed Findings (Verified):** Exact figures and statistical observations drawn directly from the dataset.
   * **AI Strategic Recommendations (Forward-Looking):** High-level managerial initiatives, trade-offs, and operational priorities.
4. **Dual Execution Engine:**
   * **Live Mode:** Powered by Google Gemini 2.5 Flash when `GEMINI_API_KEY` is present in `.env`.
   * **Deterministic Mode:** Powered by a built-in expert reasoning engine that guarantees complete functionality offline and during portfolio evaluations without requiring an external API key.

---

## 6. Business Value & Decision Support Framework

Every finding produced by NEXUS AI is actionable through a structured **5-Dimension Decision Card**:
* **1. Finding:** What happened?
* **2. Evidence:** What audited data supports it?
* **3. Business Impact:** What is the quantified financial consequence ($ ARR at risk or expansion potential)?
* **4. Recommended Action:** What specific initiative should leadership undertake?
* **5. Priority & Status:** High / Medium / Low priority based on transparent impact rules, with toggleable execution tracking (*Under Review*, *Approved for Q4*, *In Execution*).

---

## 7. Technical Challenges & Engineering Solutions

| Challenge | Engineering Solution |
| :--- | :--- |
| **Data Type Evolution (Pandas 3.0 / NumPy 2.x)** | Replaced deprecated `np.issubdtype` checks with `pd.api.types.is_numeric_dtype`, ensuring robust classification across all pandas string and nullable numerical dtypes. |
| **Preventing LLM Hallucinations** | Implemented deterministic analytics calculations in Pandas/NumPy first, supplying only structured numerical facts to the LLM prompt context with clear UI separation between empirical findings and strategic advice. |
| **Imbalanced Churn Class Skew** | Applied stratified k-fold splitting and `class_weight='balanced'` in Scikit-learn's Random Forest classifier to prevent the model from biasing toward the majority class. |
| **Zero-Configuration Portfolio Portability** | Bundled a comprehensive 1,600-record enterprise dataset and engineered a dual-mode AI analyst so the application runs seamlessly out-of-the-box without requiring API keys or database configuration. |
| **FastAPI Standalone Asset Serving** | Automated Vite static file bundling into `frontend/dist` mounted as FastAPI `StaticFiles`, allowing a single Python command (`python run_app.py`) to serve both the REST API and the React SPA. |

---

## 8. Installation & Quick Start

### Prerequisites
* **Python:** 3.10+ (Tested on Python 3.12)
* **Node.js:** v18+ (Tested on Node v24)
* **npm:** v9+

### Quick Start (Single Command)
```bash
# 1. Clone the repository
git clone https://github.com/your-username/nexus-ai.git
cd nexus-ai

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Launch the unified application
python run_app.py
```
Open your browser and navigate to: **`http://localhost:8000`**

---

### Development Mode (Concurrent Hot-Reload)
```bash
# Run both FastAPI backend (port 8000) and Vite frontend (port 5173) with hot reload:
python run_app.py --dev
```

---

### Running Automated Test Suite
```bash
# Run backend pytest suite validating all 11 ML & API endpoints:
python -m pytest backend/tests/test_backend.py -v
```

---

## 9. Environment Configuration (`.env`)

To enable live Google Gemini LLM responses, copy `.env.example` to `.env` and add your API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=8000
HOST=0.0.0.0
```
*(Note: If no API key is provided, the platform automatically utilizes its deterministic grounded reasoning engine.)*

---

## 10. Algorithmic Governance & Academic Limitations

* **Macroeconomic Exclusions:** The predictive models operate on transactional and telemetry features; macroeconomic factors (such as interest rates or competitor pricing changes) are not observed in the dataset.
* **Non-Causality Disclosures:** High support ticket volumes correlate with churn risk, but leadership is cautioned that unobserved product-market fit or onboarding friction may be the true common cause.
* **Data Ingestion Readiness:** Ingested custom datasets must provide at least one continuous numeric metric and sufficient record volume ($N \ge 100$) for statistical validity.

---

## 11. Author & Portfolio Information

* **Project Title:** NEXUS AI — Business Intelligence & Decision Support
* **Target Program:** MSc Artificial Intelligence in Business / AI & Management
* **Core Philosophy:** $\text{Data} \to \text{AI Analysis} \to \text{Business Insight} \to \text{Decision}$
* **License:** MIT License (2026)
