import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  Users, 
  Search, 
  Crown, 
  ShieldAlert, 
  Award, 
  TrendingUp, 
  UserCheck, 
  CheckCircle, 
  ChevronRight,
  Sliders,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';

import { EmptyState } from './EmptyState';

export const CustomerIntelligence = () => {
  const { segmentation, kpis, hasDataset, isAnalyzed, isDemo } = useAnalytics();
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  if (!hasDataset || !isAnalyzed) {
    return (
      <EmptyState 
        title="Customer Intelligence Awaiting Dataset"
        description="Upload your business data to run unsupervised K-Means clustering and discover behavioral customer personas."
        badge="Customer Intelligence"
      />
    );
  }

  const segments = segmentation?.segment_summaries || [];
  const scatterPoints = segmentation?.scatter_points || [];

  // Filtered scatter points
  const filteredPoints = scatterPoints.filter(p => {
    if (selectedCluster !== null && p.cluster_id !== selectedCluster) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.customer_id.toLowerCase().includes(q) || p.company_name.toLowerCase().includes(q);
    }
    return true;
  });

  const getClusterIcon = (name) => {
    if (name.includes('Champion')) return Crown;
    if (name.includes('At-Risk')) return ShieldAlert;
    if (name.includes('Loyal')) return UserCheck;
    return Users;
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-emerald">Unsupervised K-Means Clustering (K=4)</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Standardized RFM + Engagement Vectors</span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Customer Intelligence & Persona Discovery</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Behavioral account segmentation translating mathematical centroids into strategic business cohorts.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search account name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                width: '180px'
              }}
            />
          </div>

          {selectedCluster !== null && (
            <button 
              className="btn-outline"
              onClick={() => setSelectedCluster(null)}
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* 4 Persona Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {segments.map((seg) => {
          const Icon = getClusterIcon(seg.persona_name);
          const isSelected = selectedCluster === seg.cluster_id;

          return (
            <div
              key={seg.cluster_id}
              className={`glass-card-interactive ${isSelected ? 'selected-card' : ''}`}
              onClick={() => setSelectedCluster(isSelected ? null : seg.cluster_id)}
              style={{
                padding: '1.5rem',
                borderColor: isSelected ? seg.color : 'var(--border-subtle)',
                background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg-card)',
                boxShadow: isSelected ? `0 0 20px ${seg.color}33` : 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `${seg.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${seg.color}55`
                }}>
                  <Icon size={18} color={seg.color} />
                </div>
                <span className="badge" style={{ background: `${seg.color}22`, color: seg.color, border: `1px solid ${seg.color}44` }}>
                  {seg.pct_of_customers}% of base
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                {seg.persona_name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem', minHeight: '32px' }}>
                {seg.tagline}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Revenue Share:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{seg.revenue_formatted} ({seg.revenue_share_pct}%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Avg Order Value:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>${seg.avg_order_value?.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cohort Churn:</span>
                  <strong style={{ color: seg.churn_rate_pct > 20 ? '#FB7185' : '#34D399' }}>
                    {seg.churn_rate_pct}%
                  </strong>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                  Strategic Directive:
                </span>
                <span style={{ fontSize: '0.75rem', color: seg.color, fontWeight: 600 }}>
                  {seg.recommended_priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D Interactive Scatter Visualization */}
      <div className="glass-card" style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem' }}>Behavioral Cluster Scatter (RFM Mapping)</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Inactivity (Recency X-Axis) plotted against Lifetime Spend (Monetary Y-Axis). Click any node to drill into customer metrics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {segments.map((s) => (
              <div key={s.cluster_id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{s.persona_name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Scatter Plot */}
        <div style={{ width: '100%', height: '340px', position: 'relative', background: 'rgba(7, 11, 20, 0.6)', borderRadius: 'var(--radius-md)', padding: '1rem', overflow: 'hidden' }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 600 300"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            {[50, 100, 150, 200, 250].map((y, i) => (
              <line key={i} x1="40" y1={y} x2="580" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            ))}
            {[100, 200, 300, 400, 500].map((x, i) => (
              <line key={i} x1={x} y1="30" x2={x} y2="270" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            ))}

            {/* Scatter Points */}
            {filteredPoints.map((p, idx) => {
              // Normalized mapping
              const maxRecency = 180;
              const maxSpend = 280000;
              const cx = 50 + (p.x / maxRecency) * 510;
              const cy = 260 - (Math.min(p.y, maxSpend) / maxSpend) * 220;

              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill={p.color}
                  opacity="0.8"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1"
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => setSelectedCustomer(p)}
                >
                  <title>{`${p.company_name} (${p.customer_id})\nInactivity: ${p.x} days | Spend: $${p.y.toLocaleString()}\nPersona: ${p.persona_name}`}</title>
                </circle>
              );
            })}
          </svg>

          {/* Axis Labels */}
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Days Since Last Active (Dormancy →)
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total Revenue ($ Spend ↑)
          </div>
        </div>
      </div>

      {/* Segment Performance Table */}
      <div className="glass-card" style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.35rem' }}>Segment-Level Commercial Scorecard</h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Comparative operational performance, revenue concentration, and retention priorities across discovered clusters.
        </p>

        <div className="table-responsive-wrapper">
          <table className="nexus-table" style={{ minWidth: '650px' }}>
            <thead>
              <tr>
                <th>Discovered Persona</th>
                <th>Account Volume</th>
                <th>Revenue Contribution</th>
                <th>Avg Order Size</th>
                <th>Avg Inactivity</th>
                <th>Churn Risk</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((seg) => (
                <tr key={seg.cluster_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color }} />
                      <strong style={{ color: 'var(--text-primary)' }}>{seg.persona_name}</strong>
                    </div>
                  </td>
                  <td>{seg.customer_count} ({seg.pct_of_customers}%)</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {seg.revenue_formatted} ({seg.revenue_share_pct}%)
                  </td>
                  <td>${seg.avg_order_value?.toLocaleString()}</td>
                  <td>{seg.avg_days_inactive} days</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: seg.churn_rate_pct > 20 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: seg.churn_rate_pct > 20 ? '#FB7185' : '#34D399'
                    }}>
                      {seg.churn_rate_pct}%
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {seg.recommended_priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Customer Modal / Inspector */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 11, 20, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: 'clamp(0.75rem, 3vw, 1.5rem)'
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'clamp(1.25rem, 3vw, 2rem)', border: '1px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-cyan">{selectedCustomer.customer_id}</span>
                <h3 style={{ fontSize: '1.35rem', marginTop: '0.35rem' }}>{selectedCustomer.company_name}</h3>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assigned Persona:</span>
                <strong style={{ color: selectedCustomer.color }}>{selectedCustomer.persona_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Lifetime Revenue:</span>
                <strong style={{ color: 'var(--text-primary)' }}>${selectedCustomer.y?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Days Inactive:</span>
                <strong style={{ color: selectedCustomer.x > 60 ? '#FB7185' : 'var(--text-primary)' }}>{selectedCustomer.x} days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Churn Status:</span>
                <strong style={{ color: selectedCustomer.churned ? '#FB7185' : '#34D399' }}>
                  {selectedCustomer.churned ? 'Churned Account' : 'Active Account'}
                </strong>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => setSelectedCustomer(null)}
            >
              Done Reviewing Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

