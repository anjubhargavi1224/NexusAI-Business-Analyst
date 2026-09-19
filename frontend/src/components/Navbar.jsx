import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  Database, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Layers, 
  ShieldCheck,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { 
    hasDataset,
    isDemo,
    isAnalyzed,
    datasetName,
    datasetInfo, 
    activeView, 
    setActiveView, 
    setIsQualityModalOpen,
    openUploadDialog,
    loadDemo,
    resetWorkspace,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useAnalytics();

  const isLanding = activeView === 'landing';
  const qualityScore = datasetInfo?.quality_report?.quality_score || 96;

  return (
    <header className="no-print" style={{
      height: '64px',
      borderBottom: '1px solid rgba(92, 46, 126, 0.25)',
      background: 'rgba(5, 4, 8, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(0.75rem, 2.5vw, 2rem)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      gap: '0.75rem'
    }}>
      {/* Brand & Mobile Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Hamburger Menu Button (shown on < 1024px when not on landing) */}
        {!isLanding && (
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(92, 46, 126, 0.2)',
              border: '1px solid rgba(126, 62, 172, 0.35)',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            className="mobile-nav-toggle"
          >
            {isMobileNavOpen ? <X size={20} color="#C084FC" /> : <Menu size={20} color="#C084FC" />}
          </button>
        )}

        <div 
          onClick={() => setActiveView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
          title="Return to Landing Page"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #5C2E7E 0%, #7E3EAC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(126, 62, 172, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            flexShrink: 0
          }}>
            <Layers size={17} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
              NEXUS<span style={{ color: '#C084FC' }}>AI</span>
            </span>
            <span className="navbar-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid rgba(92, 46, 126, 0.4)', paddingLeft: '0.5rem' }}>
              Business Intelligence & Decision Support
            </span>
          </div>
        </div>
      </div>

      {/* Center: Dataset Status Indicator Tag */}
      <div className="navbar-dataset-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {hasDataset && isAnalyzed ? (
          <>
            {isDemo ? (
              <span 
                className="badge badge-demo" 
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                title="Synthetic enterprise demo dataset active"
              >
                <Sparkles size={12} color="#F3E8FF" />
                <span>Demo</span>
              </span>
            ) : (
              <span 
                className="badge badge-purple" 
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', maxWidth: '160px' }}
              >
                <Database size={12} color="#E9D5FF" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {datasetName || 'User CSV'}
                </span>
              </span>
            )}

            {/* Quality Health Score Pill */}
            <button
              onClick={() => setIsQualityModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(92, 46, 126, 0.3)',
                borderRadius: '9999px',
                padding: '0.28rem 0.65rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              title="Click to view full dataset audit"
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981'
              }} />
              <span>{qualityScore}%</span>
            </button>
          </>
        ) : null}
      </div>

      {/* Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <button 
          className="btn-outline"
          onClick={openUploadDialog}
          style={{ padding: '0.38rem 0.75rem', fontSize: '0.78rem' }}
          title="Upload a business CSV from your computer"
        >
          <UploadCloud size={14} />
          <span className="btn-label-desktop">Upload CSV</span>
        </button>

        {hasDataset ? (
          <button 
            onClick={resetWorkspace}
            style={{
              background: 'transparent',
              border: '1px solid rgba(92, 46, 126, 0.25)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '0.38rem 0.65rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
            title="Reset workspace and clear active dataset"
          >
            <RotateCcw size={13} />
            <span className="btn-label-desktop">Reset</span>
          </button>
        ) : (
          <button 
            className="btn-secondary"
            onClick={loadDemo}
            style={{ padding: '0.38rem 0.75rem', fontSize: '0.78rem' }}
            title="Load bundled enterprise demo dataset"
          >
            <Sparkles size={13} color="#C084FC" />
            <span className="btn-label-desktop">Demo</span>
          </button>
        )}

        <button 
          className="btn-primary"
          onClick={() => setActiveView('report')}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
        >
          <FileText size={14} />
          <span>Brief</span>
        </button>
      </div>
    </header>
  );
};
