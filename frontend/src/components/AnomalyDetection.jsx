import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ArrowUpRight, 
  Filter, 
  ShieldAlert,
  Activity,
  Layers
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export const AnomalyDetection = () => {
  const { anomalies, setActiveView, hasDataset, isAnalyzed, isDemo } = useAnalytics();
  const [severityFilter, setSeverityFilter] = useState('all');

  if (!hasDataset || !isAnalyzed) {
    return (
      <EmptyState 
        title="Anomaly Detection Awaiting Dataset"
        description="Upload your business data to run Isolation Forest algorithms and parametric Z-score outlier detection."
        badge="Risk & Anomaly Intelligence"
      />
    );
  }

  const filtered = anomalies.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <span className="badge badge-rose">CRITICAL ALERT</span>;
      case 'warning':
        return <span className="badge badge-amber">OPERATIONAL WARNING</span>;
      default:
        return <span className="badge badge-cyan">TELEMETRY NOTICE</span>;
    }
  };

  const getSeverityBorder = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'rgba(244, 63, 94, 0.35)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.35)';
      default:
        return 'rgba(56, 189, 248, 0.25)';
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-rose">
              <AlertOctagon size={13} /> Multi-Variate Anomaly Engine
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Isolation Forest + Statistical Z-Score Outlier Analysis
            </span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Anomaly & Business Risk Detection</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Automated detection of irregular financial contractions, customer churn velocity spikes, and margin erosion.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: severityFilter === sev ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: severityFilter === sev ? '1px solid var(--border-highlight)' : '1px solid transparent',
                color: severityFilter === sev ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Scorecard Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Flagged Anomalies</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
            {anomalies.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across operational vectors</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Critical Severity</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FB7185', margin: '0.25rem 0' }}>
            {anomalies.filter(a => a.severity === 'critical').length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#FB7185' }}>Immediate C-suite triage</span>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Algorithmic Baseline</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: '0.25rem 0' }}>
            2.5σ
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Standard deviation threshold</span>
        </div>
      </div>

      {/* Anomaly Alert Cards Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filtered.map((item, idx) => (
          <div
            key={item.id || idx}
            className="glass-card"
            style={{
              padding: 'clamp(1rem, 2.5vw, 1.75rem)',
              borderColor: getSeverityBorder(item.severity),
              position: 'relative'
            }}
          >
            {/* Alert Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  {getSeverityBadge(item.severity)}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.id}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{item.title}</h3>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8125rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Observed Deviation: </span>
                <strong style={{ color: item.severity === 'critical' ? '#FB7185' : 'var(--accent-cyan)' }}>
                  {item.statistical_deviation}
                </strong>
              </div>
            </div>

            {/* Structured Evidence & Implication Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              {/* Data Evidence */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Audited Data Evidence
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.evidence}
                </p>
              </div>

              {/* Business Implication */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Business Implication (Non-Causal)
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.business_implication}
                </p>
              </div>
            </div>

            {/* Recommended Action Box */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <CheckCircle2 size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', display: 'block' }}>
                    Recommended Management Response
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {item.recommended_action}
                  </span>
                </div>
              </div>

              <button
                className="btn-outline"
                onClick={() => setActiveView('recommendations')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                Review Strategy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
