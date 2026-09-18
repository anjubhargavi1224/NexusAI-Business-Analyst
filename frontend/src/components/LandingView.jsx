import React, { useState, useRef } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { NexusMascot } from './NexusMascot';
import { DatasetValidationPanel } from './DatasetValidationPanel';
import { AnalysisLoadingModal } from './AnalysisLoadingModal';
import { 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Compass, 
  Upload,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Cpu,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';

export const LandingView = () => {
  const { 
    setActiveView, 
    hasDataset, 
    isAnalyzed, 
    isDemo, 
    datasetName, 
    loadDemo, 
    uploadAndValidate, 
    isUploading, 
    uploadProgress, 
    uploadError, 
    openUploadDialog 
  } = useAnalytics();

  const [isDragActive, setIsDragActive] = useState(false);
  const uploadSectionRef = useRef(null);

  const handleStartAnalyzingClick = () => {
    if (hasDataset && isAnalyzed) {
      setActiveView('dashboard');
    } else if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      openUploadDialog();
    } else {
      openUploadDialog();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadAndValidate(file);
    }
  };

  const capabilities = [
    {
      icon: BarChart3,
      title: 'Automated Business Analytics',
      desc: 'Deterministic KPI engines computing revenue trajectories, AOV, retention rates, and multi-dimensional financial breakdowns without hallucinations.',
      tag: 'Macro KPIs'
    },
    {
      icon: Users,
      title: 'Customer Intelligence & Personas',
      desc: 'Unsupervised K-Means clustering across RFM vectors, translating statistical centroids into actionable business personas (Champions vs At-Risk Accounts).',
      tag: 'K-Means'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Churn ML',
      desc: 'Random Forest churn classification with cross-validated metrics (ROC-AUC, Confusion Matrix), plus an interactive What-If scenario simulator.',
      tag: 'Random Forest'
    },
    {
      icon: Compass,
      title: 'Decision Support & Action Framework',
      desc: 'Transforms statistical observations into structured managerial business cases: Finding → Evidence → Financial Impact → Recommended Action.',
      tag: 'Prescriptive'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <div 
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '4.5rem 2rem 3rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3.5rem'
        }}
      >
        {/* Left Column: Hero Text & CTAs */}
        <div>
          {/* Tagline Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span 
              className="badge badge-purple"
              style={{
                padding: '0.4rem 0.95rem',
                fontSize: '0.8125rem',
                border: '1px solid rgba(126, 62, 172, 0.5)'
              }}
            >
              <Cpu size={14} color="#C084FC" />
              <span>NEXUS AI • Business Intelligence & Decision Support</span>
            </span>
          </div>

          {/* Headline */}
          <h1 
            style={{
              fontSize: '3.75rem',
              lineHeight: 1.12,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '1.5rem',
              letterSpacing: '-0.035em'
            }}
          >
            Turn Business Data Into{' '}
            <span 
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #D8B4FE 60%, #9047C4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Better Decisions.
            </span>
          </h1>

          {/* Supporting Text */}
          <p 
            style={{
              fontSize: '1.1875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '580px',
              marginBottom: '2.5rem',
              fontWeight: 400
            }}
          >
            Analyze business performance, identify customer risks, uncover unusual patterns, 
            and turn data into actionable decisions with AI.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button 
              className="btn-primary" 
              onClick={handleStartAnalyzingClick}
              style={{
                padding: '0.95rem 2.25rem',
                fontSize: '1.05rem',
                fontWeight: 700
              }}
            >
              <span>{hasDataset && isAnalyzed ? 'Open Executive Dashboard' : 'Start Analyzing'}</span>
              <ArrowRight size={20} />
            </button>

            <button 
              className="btn-secondary"
              onClick={loadDemo}
              disabled={isUploading}
              style={{
                padding: '0.95rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'rgba(92, 46, 126, 0.15)',
                borderColor: 'rgba(126, 62, 172, 0.4)'
              }}
            >
              <Sparkles size={18} color="#C084FC" />
              <span>Explore Demo</span>
            </button>
          </div>

          {/* Value Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} color="#7E3EAC" />
              <span>Zero-Hallucination Analytics</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <Activity size={16} color="#7E3EAC" />
              <span>Grounded Random Forest ML</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#7E3EAC" />
              <span>Real Business Ingestion</span>
            </div>
          </div>
        </div>

        {/* Right Column: Original Cute Robot Mascot & Floating Telemetry */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '440px'
          }}
        >
          {/* Main 3D Robot Mascot */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <NexusMascot size="lg" animated={true} glow={true} />
          </div>

          {/* Floating Telemetry Card 1 (Top Right) */}
          <div 
            className="glass-card"
            style={{
              position: 'absolute',
              top: '8%',
              right: '2%',
              padding: '0.85rem 1.15rem',
              zIndex: 3,
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(126, 62, 172, 0.4)',
              background: 'rgba(18, 12, 28, 0.85)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(92, 46, 126, 0.3)',
              transform: 'translateY(-5px)',
              animation: 'robotFloat 5s ease-in-out infinite'
            }}
          >
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              AI Prediction Accuracy
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
              94.5% <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 500 }}>ROC-AUC</span>
            </div>
          </div>

          {/* Floating Telemetry Card 2 (Bottom Left) */}
          <div 
            className="glass-card"
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '4%',
              padding: '0.85rem 1.15rem',
              zIndex: 3,
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(126, 62, 172, 0.4)',
              background: 'rgba(18, 12, 28, 0.85)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(92, 46, 126, 0.3)',
              transform: 'translateY(5px)',
              animation: 'robotFloat 6s ease-in-out infinite reverse'
            }}
          >
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Churn Risk Exposure
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F87171', marginTop: '2px' }}>
              13.2% <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Monitored</span>
            </div>
          </div>

          {/* Floating Telemetry Card 3 (Bottom Right) */}
          <div 
            className="glass-card"
            style={{
              position: 'absolute',
              bottom: '18%',
              right: '8%',
              padding: '0.65rem 1rem',
              zIndex: 3,
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(92, 46, 126, 0.35)',
              background: 'rgba(18, 12, 28, 0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 8px #A855F7' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#E9D5FF' }}>
              K-Means Personas Active
            </span>
          </div>
        </div>
      </div>

      {/* Dataset Ingestion / Validation Section */}
      <div 
        ref={uploadSectionRef}
        style={{
          maxWidth: '1240px',
          margin: '2rem auto 4.5rem auto',
          padding: '0 2rem'
        }}
      >
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A855F7', fontWeight: 600, marginBottom: '0.4rem' }}>
            Data Ingestion & Integrity Engine
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.025em' }}>
            {hasDataset && !isAnalyzed ? 'Dataset Validation & Quality Audit' : 'Upload Your Business Data'}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0.5rem auto 0 auto' }}>
            {hasDataset && !isAnalyzed 
              ? 'NEXUS has audited your dataset structure. Review the metrics below and launch full machine learning analysis.'
              : 'Upload your sales, transactional, or customer CSV dataset to begin. Zero data is pre-populated without your permission.'}
          </p>
        </div>

        {/* Upload Error Alert if any */}
        {uploadError && (
          <div 
            className="animate-fade-in"
            style={{
              padding: '1rem 1.5rem',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: 'var(--radius-md)',
              color: '#FDA4AF',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={20} color="#F43F5E" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600 }}>{uploadError}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Please ensure your file is a valid CSV with recognizable columns (e.g. revenue, customer ID, or orders).
              </div>
            </div>
          </div>
        )}

        {/* State A: User uploaded file, waiting for analysis approval */}
        {hasDataset && !isAnalyzed && (
          <DatasetValidationPanel />
        )}

        {/* State B: Already analyzed */}
        {hasDataset && isAnalyzed && (
          <div 
            className="glass-card animate-fade-in"
            style={{
              padding: '2rem 2.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              border: '1px solid rgba(126, 62, 172, 0.45)',
              background: 'linear-gradient(135deg, rgba(24, 15, 38, 0.8) 0%, rgba(12, 8, 18, 0.9) 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(92, 46, 126, 0.3)',
                border: '1px solid #7E3EAC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={24} color="#34D399" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {datasetName}
                  </span>
                  {isDemo && (
                    <span className="badge badge-demo">Demo Dataset</span>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Analysis complete. Executive KPIs, behavioral clusters, and predictions ready for review.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="btn-secondary"
                onClick={openUploadDialog}
              >
                <Upload size={16} />
                <span>Upload New CSV</span>
              </button>

              <button 
                className="btn-primary"
                onClick={() => setActiveView('dashboard')}
                style={{ padding: '0.8rem 1.75rem' }}
              >
                <span>Enter Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* State C: No dataset uploaded - Prominent Clean Dropzone */}
        {!hasDataset && (
          <div>
            <div 
              className={`upload-dropzone ${isDragActive ? 'active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openUploadDialog}
              style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(92, 46, 126, 0.25)',
                border: '1px solid rgba(126, 62, 172, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Upload size={28} color="#C084FC" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                {isUploading ? `Uploading file (${uploadProgress}%)...` : 'Drop your business CSV here, or browse files'}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '1.5rem' }}>
                Supports standard comma-delimited files (.csv). Automated schema detection infers customers, orders, and revenues.
              </p>

              {/* Upload Progress Bar if uploading */}
              {isUploading && (
                <div style={{ width: '280px', height: '6px', background: 'rgba(92, 46, 126, 0.3)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#A855F7', transition: 'width 0.2s ease' }} />
                </div>
              )}

              <button 
                type="button"
                className="btn-primary" 
                disabled={isUploading}
                style={{ padding: '0.75rem 1.8rem', fontSize: '0.9375rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  openUploadDialog();
                }}
              >
                <FileSpreadsheet size={18} />
                <span>Select Business CSV</span>
              </button>
            </div>

            {/* Secondary Option: Explicit Demo */}
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <span>Want to preview the platform first?</span>
              <button 
                onClick={loadDemo}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C084FC',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: 0
                }}
              >
                <Sparkles size={14} />
                <span>Use Demo Dataset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Capabilities Section */}
      <div 
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '0 2rem'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div 
                key={i}
                className="glass-card"
                style={{
                  padding: '1.75rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  background: 'rgba(14, 9, 22, 0.65)',
                  border: '1px solid rgba(92, 46, 126, 0.22)'
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(92, 46, 126, 0.25)',
                      border: '1px solid rgba(126, 62, 172, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} color="#E9D5FF" />
                    </div>
                    <span 
                      className="badge" 
                      style={{
                        background: 'rgba(92, 46, 126, 0.15)',
                        color: '#D8B4FE',
                        border: '1px solid rgba(126, 62, 172, 0.3)',
                        fontSize: '0.7rem'
                      }}
                    >
                      {c.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                    {c.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
