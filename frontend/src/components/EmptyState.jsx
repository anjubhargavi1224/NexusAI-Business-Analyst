import React from 'react';
import { NexusMascot } from './NexusMascot';
import { Upload, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const EmptyState = ({
  title = "Your business intelligence workspace is ready.",
  description = "Upload your business CSV dataset to generate your first analysis, or explore with our bundled enterprise demo data.",
  badge = "Awaiting Data Source"
}) => {
  const { loadDemo, openUploadDialog, isUploading } = useAnalytics();

  return (
    <div 
      className="page-container animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '3rem 1.5rem'
      }}
    >
      <div 
        className="glass-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(92, 46, 126, 0.3) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />

        {/* Mascot Robot */}
        <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <NexusMascot size="md" animated={true} />
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
          <span className="badge badge-purple" style={{ padding: '0.35rem 0.85rem' }}>
            <ShieldCheck size={14} /> {badge}
          </span>
        </div>

        {/* Title & Description */}
        <h2 style={{
          fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '0.975rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '520px',
          marginBottom: '2.25rem',
          position: 'relative',
          zIndex: 1
        }}>
          {description}
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <button 
            className="btn-primary"
            onClick={openUploadDialog}
            disabled={isUploading}
            style={{ padding: '0.8rem 1.75rem', fontSize: '0.9375rem' }}
          >
            <Upload size={18} />
            <span>{isUploading ? 'Uploading...' : 'Upload CSV Dataset'}</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={loadDemo}
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.9375rem' }}
          >
            <Sparkles size={18} color="#C084FC" />
            <span>Use Demo Dataset</span>
          </button>
        </div>

        {/* Note */}
        <div style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Supports comma-separated (.csv) files with sales, orders, or customer records.
        </div>
      </div>
    </div>
  );
};
