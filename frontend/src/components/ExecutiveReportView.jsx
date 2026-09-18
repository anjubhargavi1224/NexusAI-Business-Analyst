import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { api } from '../api';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Award,
  Layers,
  Cpu
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export const ExecutiveReportView = () => {
  const { hasDataset, isAnalyzed, isDemo } = useAnalytics();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasDataset && isAnalyzed) {
      setLoading(true);
      api.getExecutiveReport()
        .then(data => {
          setReportData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load report', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [hasDataset, isAnalyzed]);

  const handlePrint = () => {
    window.print();
  };

  if (!hasDataset || !isAnalyzed) {
    return (
      <EmptyState 
        title="Executive Report Awaiting Business Data"
        description="Upload your business data to compile a formal C-Suite executive briefing memo and model governance disclosure."
        badge="Executive Briefing & Governance"
      />
    );
  }

  if (loading || !reportData) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(92, 46, 126, 0.2)', borderTopColor: '#7E3EAC', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Compiling C-Suite Executive Briefing...</p>
      </div>
    );
  }

  const meta = reportData.meta || {};
  const scorecard = reportData.kpi_scorecard || [];
  const customerInsights = reportData.customer_intelligence_insights || [];
  const predictive = reportData.predictive_modeling_findings || {};
  const risks = reportData.anomaly_and_risk_matrix || [];
  const roadmap = reportData.ninety_day_action_roadmap || [];
  const governance = reportData.model_governance_and_limitations || {};

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1000px' }}>
      {/* Top Action Bar (hidden during print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-cyan">C-Suite Confidential Briefing</span>
          <h1 style={{ fontSize: '1.875rem', marginTop: '0.25rem' }}>Executive Intelligence Report</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn-primary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Document Container */}
      <div className="glass-card" style={{ padding: '3.5rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--border-highlight)' }}>
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid var(--border-highlight)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                NEXUS AI DECISION INTELLIGENCE
              </div>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{meta.document_title}</h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Target: {meta.classification}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <div><strong>Date:</strong> {meta.prepared_date}</div>
              <div><strong>Audited Telemetry:</strong> {meta.total_records} Enterprise Accounts</div>
              <div><strong>Data Health:</strong> {meta.data_quality_score}</div>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            1. Executive Synthesis & Strategic Outlook
          </h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {reportData.executive_summary}
          </p>
        </div>

        {/* Section 2: Financial & Commercial Scorecard */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            2. Audited Commercial KPI Scorecard
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {scorecard.map((kpi, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{kpi.kpi}</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0' }}>{kpi.value}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{kpi.benchmark}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Customer Intelligence Insights */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            3. Customer Segment Performance & Retention Posture
          </h3>
          <table className="nexus-table">
            <thead>
              <tr>
                <th>Discovered Persona</th>
                <th>Volume</th>
                <th>Revenue Share</th>
                <th>Avg Spend</th>
                <th>Churn Risk</th>
                <th>Strategic Directive</th>
              </tr>
            </thead>
            <tbody>
              {customerInsights.map((c, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.persona}</td>
                  <td>{c.accounts}</td>
                  <td>{c.revenue_contribution}</td>
                  <td>{c.avg_spend}</td>
                  <td style={{ color: Number(c.churn_risk) > 20 ? '#FB7185' : '#34D399', fontWeight: 600 }}>{c.churn_risk}%</td>
                  <td style={{ fontSize: '0.8125rem' }}>{c.strategic_directive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Predictive Machine Learning Discoveries */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            4. Predictive Modeling & Early Warning Telemetry
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Validated Model</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{predictive.algorithm}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Discriminatory AUC</span>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{(predictive.validation_auc * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Holdout Accuracy</span>
                <div style={{ fontWeight: 600, color: '#34D399' }}>{(predictive.accuracy * 100).toFixed(1)}%</div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
              {predictive.business_takeaway}
            </p>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <strong>Primary Risk Drivers: </strong> {predictive.primary_churn_drivers?.join('; ')}
            </div>
          </div>
        </div>

        {/* Section 5: Prioritized 90-Day Roadmap */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            5. Prioritized 90-Day Executive Action Roadmap
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {roadmap.map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'block' }}>{item.phase}</span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.action}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-indigo">{item.owner}</span>
                  <span style={{ display: 'block', fontSize: '0.6875rem', color: '#FB7185', marginTop: '0.2rem', fontWeight: 600 }}>Priority: {item.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Model Governance & Limitations Disclosure */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: 1.6
        }}>
          <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            6. Algorithmic Governance & Academic Disclosures
          </h4>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
            {governance.methodology_disclosures?.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
            {governance.known_limitations?.map((l, i) => (
              <li key={i}><strong>Limitation:</strong> {l}</li>
            ))}
          </ul>
          <div style={{ fontStyle: 'italic', color: 'var(--text-dim)' }}>
            {governance.academic_citation}
          </div>
        </div>
      </div>
    </div>
  );
};
