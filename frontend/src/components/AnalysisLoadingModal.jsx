import React from 'react';
import { NexusMascot } from './NexusMascot';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const AnalysisLoadingModal = () => {
  const { isAnalyzing, analysisStep } = useAnalytics();

  if (!isAnalyzing) return null;

  const steps = [
    { id: 1, label: 'Validating dataset schema & data integrity' },
    { id: 2, label: 'Calculating macro business KPIs & revenue growth rates' },
    { id: 3, label: 'Segmenting customer accounts with K-Means clustering' },
    { id: 4, label: 'Training Random Forest predictive churn model' },
    { id: 5, label: 'Detecting multi-dimensional operational anomalies' },
    { id: 6, label: 'Synthesizing executive business decisions & AI recommendations' }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
    >
      <div 
        className="glass-card animate-fade-in"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '2.5rem',
          textAlign: 'center',
          position: 'relative',
          border: '1px solid rgba(126, 62, 172, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(92, 46, 126, 0.35)'
        }}
      >
        {/* Robot Mascot */}
        <div style={{ marginBottom: '1.25rem' }}>
          <NexusMascot size="md" animated={true} />
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          NEXUS AI is analyzing your business data...
        </h3>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.75rem'
        }}>
          Executing machine learning pipelines and generating decision intelligence.
        </p>

        {/* Steps List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          textAlign: 'left',
          background: 'rgba(10, 6, 15, 0.6)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(92, 46, 126, 0.25)'
        }}>
          {steps.map((s) => {
            const isDone = analysisStep > s.id;
            const isCurrent = analysisStep === s.id;

            return (
              <div 
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                  color: isDone ? '#FFFFFF' : isCurrent ? '#E9D5FF' : 'var(--text-dim)',
                  fontWeight: isCurrent ? 600 : 400,
                  transition: 'all 0.25s ease'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : isCurrent ? (
                  <Loader2 size={16} color="#C084FC" className="animate-spin" />
                ) : (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }} />
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Shimmer bar */}
        <div style={{
          marginTop: '1.5rem',
          height: '4px',
          borderRadius: '2px',
          overflow: 'hidden',
          background: 'rgba(92, 46, 126, 0.2)'
        }}>
          <div 
            className="animate-shimmer"
            style={{
              height: '100%',
              width: `${Math.min((analysisStep / 6) * 100, 100)}%`,
              backgroundColor: '#7E3EAC',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
};
