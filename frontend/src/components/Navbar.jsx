import React from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  Database, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Layers, 
  RefreshCw, 
  ShieldCheck,
  RotateCcw
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
    resetWorkspace
  } = useAnalytics();

  const qualityScore = datasetInfo?.quality_report?.quality_score || 96;

  return (
    <header className="no-print" style={{
      height: '64px',
      borderBottom: '1px solid rgba(92, 46, 126, 0.25)',
      background: 'rgba(5, 4, 8, 0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Brand & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div 
          onClick={() => setActiveView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          title="Return to Landing Page"
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #5C2E7E 0%, #7E3EAC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(126, 62, 172, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Layers size={18} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                NEXUS<span style={{ color: '#C084FC' }}>AI</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid rgba(92, 46, 126, 0.4)', paddingLeft: '0.5rem' }}>
                Business Intelligence & Decision Support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Dataset Status Indicator Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {hasDataset && isAnalyzed ? (
          <>
            {isDemo ? (
              <span 
                className="badge badge-demo" 
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                title="Application is currently running on the synthetic enterprise demo dataset"
              >
                <Sparkles size={13} color="#F3E8FF" />
                <span>Demo Dataset</span>
              </span>
            ) : (
              <span 
                className="badge badge-purple" 
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Database size={13} color="#E9D5FF" />
                <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {datasetName || 'User CSV Dataset'}
                </span>
              </span>
            )}

            {/* Quality Health Score Pill */}
            <button
              onClick={() => setIsQualityModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(92, 46, 126, 0.3)',
                borderRadius: '9999px',
                padding: '0.3rem 0.75rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                transition: 'all 0.2s ease'
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
              <span>{qualityScore}% Quality</span>
            </button>
          </>
        ) : (
          <span 
            className="badge" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.04)', 
              color: 'var(--text-muted)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem'
            }}
          >
            No Active Dataset
          </span>
        )}
      </div>

      {/* Right Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <button 
          className="btn-outline"
          onClick={openUploadDialog}
          style={{ padding: '0.42rem 0.85rem', fontSize: '0.8125rem' }}
          title="Upload a business CSV from your computer"
        >
          <UploadCloud size={15} />
          <span>Upload CSV</span>
        </button>

        {hasDataset ? (
          <button 
            onClick={resetWorkspace}
            style={{
              background: 'transparent',
              border: '1px solid rgba(92, 46, 126, 0.25)',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '0.42rem 0.75rem',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
            title="Reset workspace and clear active dataset"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        ) : (
          <button 
            className="btn-secondary"
            onClick={loadDemo}
            style={{ padding: '0.42rem 0.85rem', fontSize: '0.8125rem' }}
            title="Load bundled enterprise demo dataset"
          >
            <Sparkles size={14} color="#C084FC" />
            <span>Use Demo</span>
          </button>
        )}

        <button 
          className="btn-primary"
          onClick={() => setActiveView('report')}
          style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem' }}
        >
          <FileText size={15} />
          <span>Executive Brief</span>
        </button>
      </div>
    </header>
  );
};
