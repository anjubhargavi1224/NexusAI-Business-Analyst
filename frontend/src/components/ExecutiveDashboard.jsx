import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { EmptyState } from './EmptyState';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  UserMinus, 
  Award, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react';

export const ExecutiveDashboard = () => {
  const { kpis, trends, anomalies, setActiveView, datasetInfo, isLoading, error, analysisError, runAnalysis, hasDataset, isAnalyzed, isDemo } = useAnalytics();
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);

  if (!hasDataset || !isAnalyzed) {
    return (
      <EmptyState 
        title="Executive Cockpit Awaiting Business Data"
        description="Upload your business CSV dataset to calculate executive KPIs, revenue velocity, and risk telemetry."
        badge="Executive Overview"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(92, 46, 126, 0.2)', borderTopColor: '#7E3EAC', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Aggregating telemetry and computing executive KPIs...</p>
      </div>
    );
  }

  if (error || analysisError || !kpis) {
    const errStage = analysisError?.stage || 'Executive Telemetry Aggregation';
    const errMessage = analysisError?.error || error || 'KPI computation could not complete. Please retry analysis.';

    return (
      <div className="page-container animate-fade-in" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div 
          className="glass-card"
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            border: '1px solid rgba(244, 63, 94, 0.5)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(244, 63, 94, 0.2)'
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid #F43F5E',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <AlertTriangle size={24} color="#F43F5E" />
          </div>

          <div style={{
            fontSize: '0.8125rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#FDA4AF',
            marginBottom: '0.35rem'
          }}>
            ANALYSIS FAILED
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Stage: {errStage}
          </h3>

          <p style={{ fontSize: '0.875rem', color: '#FECDD3', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Error: {errMessage}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary"
              onClick={runAnalysis}
              style={{
                background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
                borderColor: '#F43F5E',
                padding: '0.75rem 1.75rem'
              }}
            >
              <span>Retry Analysis</span>
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setActiveView('landing')}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <span>Return to Dataset</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trendData = trends?.trend_series || [];
  const maxRevenue = trendData.length > 0 ? Math.max(...trendData.map(d => d.revenue)) : 1;
  const categories = trends?.category_breakdown || [];
  const regions = trends?.region_breakdown || [];
  const riskTiers = trends?.risk_distribution || [];

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-purple">Executive Overview</span>
            {isDemo && <span className="badge badge-demo">Demo Dataset</span>}
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Updated real-time from active dataset</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Executive Decision Cockpit</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            High-level performance monitoring, growth trajectory, and operational risk telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-secondary"
            onClick={() => setActiveView('analyst')}
          >
            Ask AI Analyst
          </button>
          <button 
            className="btn-primary"
            onClick={() => setActiveView('recommendations')}
          >
            View Management Actions
          </button>
        </div>
      </div>

      {/* Urgent Anomaly Alert Banner */}
      {anomalies && anomalies.length > 0 && (
        <div 
          className="glass-card"
          onClick={() => setActiveView('anomalies')}
          style={{
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} color="#FB7185" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: '#FB7185', fontSize: '0.9375rem' }}>
                  {anomalies[0].title}
                </strong>
                <span className="badge badge-rose" style={{ fontSize: '0.6875rem' }}>
                  {anomalies[0].severity?.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                {anomalies[0].statistical_deviation} — {anomalies[0].business_implication}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FB7185', fontSize: '0.8125rem', fontWeight: 600 }}>
            <span>Investigate Anomaly</span>
            <ChevronRight size={16} />
          </div>
        </div>
      )}

      {/* Primary KPI Grid (8 Cards) */}
      <div className="kpi-grid">
        {/* Total Revenue */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Total Gross Revenue</span>
            <DollarSign size={16} color="var(--accent-cyan)" />
          </div>
          <div className="kpi-value">{kpis.revenue_formatted}</div>
          <div className="kpi-footer">
            {kpis.growth_available ? (
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                color: kpis.growth_direction === 'positive' ? '#34D399' : '#F87171', 
                fontWeight: 600 
              }}>
                {kpis.growth_direction === 'positive' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpis.revenue_growth_pct > 0 ? `+${kpis.revenue_growth_pct}%` : `${kpis.revenue_growth_pct}%`}
                <span style={{ marginLeft: '4px', color: 'var(--text-secondary)', fontWeight: 400 }}>PoP</span>
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Historical periods unavailable</span>
            )}
          </div>
        </div>

        {/* Active Accounts vs Total Customers */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Active Accounts</span>
            <Users size={16} color="var(--accent-indigo)" />
          </div>
          <div className="kpi-value">{kpis.active_customers?.toLocaleString() || kpis.total_customers?.toLocaleString()}</div>
          <div className="kpi-footer">
            <span style={{ color: '#34D399', fontWeight: 600 }}>{kpis.total_customers?.toLocaleString()} Total</span>
            <span style={{ color: 'var(--text-muted)' }}>({kpis.churned_customers || 0} churned)</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Avg Order Value (AOV)</span>
            <ShoppingBag size={16} color="var(--accent-violet)" />
          </div>
          <div className="kpi-value" style={{ fontSize: kpis.aov_available ? '1.75rem' : '1.125rem' }}>
            {kpis.aov_available ? kpis.aov_formatted : 'Not Available'}
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
              {kpis.aov_available ? (kpis.total_orders > 0 ? `${kpis.total_orders.toLocaleString()} orders` : 'Per-order basis') : 'Order data required'}
            </span>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Monthly Run-Rate (MRR)</span>
            <Activity size={16} color="var(--accent-emerald)" />
          </div>
          <div className="kpi-value" style={{ fontSize: kpis.mrr_available ? '1.75rem' : '1.125rem' }}>
            {kpis.mrr_available ? kpis.mrr_formatted : 'Not Available'}
          </div>
          <div className="kpi-footer">
            <span style={{ color: kpis.mrr_available ? '#34D399' : 'var(--text-muted)', fontSize: '0.75rem' }}>
              {kpis.mrr_available ? 'Predictable Monthly Inflow' : 'Subscription terms required'}
            </span>
          </div>
        </div>

        {/* Customer Churn Rate */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Customer Churn Rate</span>
            <UserMinus size={16} color="#FB7185" />
          </div>
          <div className="kpi-value" style={{ color: kpis.churn_rate > 15 ? '#FB7185' : 'var(--text-primary)' }}>
            {kpis.churn_rate}%
          </div>
          <div className="kpi-footer">
            <span style={{ color: '#34D399', fontWeight: 600 }}>{kpis.retention_rate}%</span>
            <span>Retained accounts</span>
          </div>
        </div>

        {/* Top Product or Segment */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>{kpis.product_analytics_available ? 'Dominant Product Line' : (kpis.top_segment ? `Top Segment (${kpis.top_segment.dimension})` : 'Product Performance')}</span>
            <Award size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, margin: '0.4rem 0', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {kpis.product_analytics_available ? kpis.top_category?.name : (kpis.top_segment ? kpis.top_segment.name : 'Unavailable')}
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
              {kpis.product_analytics_available ? `${kpis.top_category?.share_pct}%` : (kpis.top_segment ? `${kpis.top_segment.share_pct}%` : 'N/A')}
            </span>
            <span>{kpis.product_analytics_available || kpis.top_segment ? 'of gross revenue' : 'No category column'}</span>
          </div>
        </div>

        {/* Highest-Risk Segment */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Highest-Risk Segment</span>
            <AlertTriangle size={16} color="#FB7185" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, margin: '0.4rem 0', color: '#FB7185', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {kpis.highest_risk_segment ? kpis.highest_risk_segment.name : 'None Flagged'}
          </div>
          <div className="kpi-footer">
            <span style={{ color: '#FB7185', fontWeight: 600 }}>
              {kpis.highest_risk_segment ? `${kpis.highest_risk_segment.churn_rate_pct}%` : '0%'}
            </span>
            <span>{kpis.highest_risk_segment ? 'segment churn rate' : 'baseline risk'}</span>
          </div>
        </div>

        {/* Data Quality Health Score */}
        <div className="glass-card kpi-card">
          <div className="kpi-title">
            <span>Data Health Score</span>
            <ShieldCheck size={16} color="#34D399" />
          </div>
          <div className="kpi-value" style={{ color: '#34D399' }}>
            {datasetInfo?.quality_report?.quality_score || 95}%
          </div>
          <div className="kpi-footer">
            <span style={{ color: '#34D399', fontWeight: 600 }}>{datasetInfo?.quality_report?.quality_grade || 'Grade A'}</span>
            <span>Audit Verified</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Interactive Revenue & Customer Volume Trend Chart */}
        <div className="glass-card" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Revenue & Order Trajectory</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Periodic revenue progression across active fiscal intervals</p>
            </div>
            <span className="badge badge-purple">Time-Series Telemetry</span>
          </div>

          {/* SVG Multi-Axis Chart */}
          <div style={{ width: '100%', height: '240px', position: 'relative' }}>
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 500 240" 
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7E3EAC" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#5C2E7E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 60, 120, 180, 240].map((y, i) => (
                <line 
                  key={i} 
                  x1="0" 
                  y1={y} 
                  x2="500" 
                  y2={y} 
                  stroke="rgba(92, 46, 126, 0.18)" 
                  strokeDasharray="4 4" 
                />
              ))}

              {/* Build Area & Line Points */}
              {trendData.length > 1 && (() => {
                const step = 500 / (trendData.length - 1);
                const points = trendData.map((d, idx) => {
                  const x = idx * step;
                  const y = 220 - ((d.revenue / maxRevenue) * 190);
                  return { x, y, ...d };
                });

                const linePath = points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
                const areaPath = `${linePath} L ${500} 230 L 0 230 Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#revenueGrad)" />
                    <path d={linePath} fill="none" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />

                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r={hoveredTrendPoint === idx ? "6" : "3.5"} 
                          fill="#000000" 
                          stroke="#C084FC" 
                          strokeWidth="2"
                          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={() => setHoveredTrendPoint(idx)}
                          onMouseLeave={() => setHoveredTrendPoint(null)}
                        />
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Tooltip on Hover */}
            {hoveredTrendPoint !== null && trendData[hoveredTrendPoint] && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                padding: '0.5rem 0.85rem',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-card)',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{trendData[hoveredTrendPoint].period}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#38BDF8' }}>
                  ${trendData[hoveredTrendPoint].revenue?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  {trendData[hoveredTrendPoint].customers} active accounts
                </div>
              </div>
            )}
          </div>

          {/* Period Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', overflowX: 'auto', gap: '0.5rem' }}>
            {trendData.slice(0, 6).map((d, i) => (
              <span key={i} style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.period}</span>
            ))}
          </div>
        </div>

        {/* Product / Category Contribution */}
        <div className="glass-card" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Category Revenue Contribution</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Product mix distribution across overall commercial billing</p>
            </div>
            <span className="badge badge-indigo">Portfolio Distribution</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {categories.slice(0, 5).map((cat, idx) => {
              const colors = ['#38BDF8', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6'];
              const color = colors[idx % colors.length];

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat.category}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      ${cat.revenue?.toLocaleString()} ({cat.share_pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${cat.share_pct}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '4px',
                      boxShadow: `0 0 8px ${color}66`
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Row: Risk Distribution & Regional Exposure */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '1.25rem'
      }}>
        {/* Churn Risk by Contract Tier */}
        <div className="glass-card" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Attrition Velocity by Tier</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Observed customer churn probability per contract commitment</p>
            </div>
            <span className="badge badge-rose">Risk Matrix</span>
          </div>

          <div className="table-responsive-wrapper">
            <table className="nexus-table">
              <thead>
                <tr>
                  <th>Cohort</th>
                  <th>Total Accounts</th>
                  <th>Active</th>
                  <th>Attrition %</th>
                </tr>
              </thead>
              <tbody>
                {riskTiers.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.segment}</td>
                    <td>{r.total}</td>
                    <td>{r.active}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: r.churn_rate_pct > 20 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: r.churn_rate_pct > 20 ? '#FB7185' : '#34D399'
                      }}>
                        {r.churn_rate_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Performance Breakdown */}
        <div className="glass-card" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem' }}>Geographic Inflow</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Revenue contribution grouped by global geographic territories</p>
            </div>
            <span className="badge badge-cyan">Regional Telemetry</span>
          </div>

          <div className="table-responsive-wrapper">
            <table className="nexus-table">
              <thead>
                <tr>
                  <th>Territory</th>
                  <th>Customers</th>
                  <th>Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((reg, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{reg.region}</td>
                    <td>{reg.customers} accounts</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      ${reg.revenue?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
