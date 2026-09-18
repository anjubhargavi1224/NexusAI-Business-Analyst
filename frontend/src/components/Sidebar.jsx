import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  Home, 
  LayoutDashboard, 
  Bot, 
  Users, 
  TrendingUp, 
  AlertOctagon, 
  Compass, 
  FileText, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { activeView, setActiveView, anomalies, setIsQualityModalOpen, hasDataset, isAnalyzed } = useAnalytics();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Welcome & Upload', icon: Home },
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Intelligence', icon: Users },
    { id: 'predictive', label: 'Churn Prediction', icon: TrendingUp },
    { 
      id: 'anomalies', 
      label: 'Anomaly Detection', 
      icon: AlertOctagon, 
      badge: (hasDataset && isAnalyzed && anomalies.length > 0) ? anomalies.length : null,
      badgeColor: 'badge-rose'
    },
    { id: 'analyst', label: 'AI Business Analyst', icon: Bot, highlight: true },
    { id: 'recommendations', label: 'Recommendations', icon: Compass },
    { id: 'report', label: 'Executive Report', icon: FileText }
  ];

  return (
    <aside className="no-print" style={{
      width: collapsed ? '72px' : '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid rgba(92, 46, 126, 0.22)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 0.75rem',
      transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      zIndex: 30,
      position: 'relative'
    }}>
      {/* Navigation Links */}
      <div>
        <div style={{
          padding: '0 0.5rem 1rem 0.5rem',
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: '#A855F7',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: collapsed ? 'none' : 'block'
        }}>
          Decision Intelligence
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.68rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive 
                    ? 'linear-gradient(90deg, rgba(92, 46, 126, 0.32) 0%, rgba(126, 62, 172, 0.08) 100%)' 
                    : 'transparent',
                  border: isActive ? '1px solid rgba(126, 62, 172, 0.45)' : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(92, 46, 126, 0.12)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} color={isActive ? '#C084FC' : 'currentColor'} />
                
                {!collapsed && (
                  <span style={{ 
                    flex: 1, 
                    fontSize: '0.85rem', 
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span className={`badge ${item.badgeColor || 'badge-purple'}`} style={{ padding: '0.1rem 0.45rem', fontSize: '0.65rem' }}>
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: '#A855F7',
                    boxShadow: '0 0 10px #A855F7'
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Utilities & Collapse Button */}
      <div style={{ borderTop: '1px solid rgba(92, 46, 126, 0.2)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() => setIsQualityModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(92, 46, 126, 0.15)',
            border: '1px solid rgba(126, 62, 172, 0.3)',
            color: '#E9D5FF',
            cursor: 'pointer',
            width: '100%',
            fontSize: '0.8125rem',
            fontWeight: 500
          }}
          title="Audit Data Quality & Schema"
        >
          <ShieldCheck size={18} color="#C084FC" />
          {!collapsed && <span>Data Governance</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)'
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {!collapsed && <span style={{ fontSize: '0.75rem' }}>Collapse</span>}
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};
