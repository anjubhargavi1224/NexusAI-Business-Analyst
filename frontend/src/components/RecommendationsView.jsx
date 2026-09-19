import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export const RecommendationsView = () => {
  const { recommendations, setActiveView, hasDataset, isAnalyzed, isDemo } = useAnalytics();
  const [filterCategory, setFilterCategory] = useState('All');
  const [actionStatuses, setActionStatuses] = useState({});

  if (!hasDataset || !isAnalyzed) {
    return (
      <EmptyState 
        title="Managerial Recommendations Awaiting Data"
        description="Upload your business data to generate structured 5-dimension managerial decision cards across revenue, retention, and pricing."
        badge="Decision Support Framework"
      />
    );
  }

  const categories = ['All', 'High Priority', 'Customer Retention', 'Revenue Growth', 'Operational Efficiency', 'Pricing & Margins'];

  const filtered = recommendations.filter(r => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'High Priority') return r.priority === 'High';
    return r.category.toLowerCase().includes(filterCategory.toLowerCase()) || r.pillar?.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const handleToggleStatus = (id) => {
    setActionStatuses(prev => {
      const current = prev[id] || 'Under Review';
      if (current === 'Under Review') return { ...prev, [id]: 'Approved for Q4' };
      if (current === 'Approved for Q4') return { ...prev, [id]: 'In Execution' };
      return { ...prev, [id]: 'Under Review' };
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <span className="badge badge-rose">HIGH PRIORITY</span>;
      case 'medium':
        return <span className="badge badge-amber">MEDIUM PRIORITY</span>;
      default:
        return <span className="badge badge-cyan">OPTIMIZATION</span>;
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-cyan">
              <Compass size={13} /> Decision Support Engine
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Structured Management Case Framework
            </span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Management Decisions & Action Playbook</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Empirical findings paired with financial impact assessments, operational recommendations, and prioritization.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setActiveView('report')}
        >
          Export Executive Briefing
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: filterCategory === cat ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: filterCategory === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              color: filterCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Decision Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {filtered.map((rec) => {
          const currentStatus = actionStatuses[rec.id] || 'Under Review';

          return (
            <div key={rec.id} className="glass-card" style={{ padding: 'clamp(1rem, 2.5vw, 2rem)', position: 'relative' }}>
              {/* Top Meta Line */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {getPriorityBadge(rec.priority)}
                  <span className="badge badge-indigo">{rec.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{rec.id}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleToggleStatus(rec.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      color: currentStatus === 'In Execution' ? '#34D399' : (currentStatus === 'Approved for Q4' ? '#38BDF8' : 'var(--text-secondary)'),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Clock size={13} />
                    <span>Status: <strong>{currentStatus}</strong></span>
                  </button>
                </div>
              </div>

              {/* 5-Dimension Framework Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* 1. Finding */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                    1. Observed Business Finding
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{rec.finding}</h3>
                </div>

                {/* 2. Evidence & 3. Business Impact (2-Col) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1.25rem'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      2. Audited Data Evidence
                    </span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {rec.evidence}
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(245, 158, 11, 0.04)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      3. Quantified Business Impact
                    </span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {rec.business_impact}
                    </p>
                  </div>
                </div>

                {/* 4. Recommended Action & ROI */}
                <div style={{
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.05) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1, minWidth: 'min(100%, 280px)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                      4. Prescriptive Management Action
                    </span>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>
                      {rec.recommended_action}
                    </p>
                  </div>

                  {rec.estimated_roi && (
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      textAlign: 'right'
                    }}>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'block' }}>Expected Outcome</span>
                      <strong style={{ color: '#34D399', fontSize: '0.875rem' }}>{rec.estimated_roi}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
