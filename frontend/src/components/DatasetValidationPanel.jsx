import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Play, 
  FileText, 
  Layers, 
  Hash, 
  Check, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const DatasetValidationPanel = ({ onAnalyzeClick }) => {
  const { 
    validationReport, 
    datasetName, 
    runAnalysis, 
    isAnalyzing, 
    analysisError,
    openUploadDialog 
  } = useAnalytics();

  if (!validationReport) return null;

  const {
    total_rows = 0,
    total_columns = 0,
    completeness_pct = 100,
    total_missing_cells = 0,
    duplicate_rows = 0,
    invalid_values_count = 0,
    detected_columns = [],
    missing_columns = [],
    checklist = [],
    is_valid_for_analysis = true,
    status_label = "DATASET READY",
    quality_grade = "A"
  } = validationReport;

  const isReady = is_valid_for_analysis;
  const isWarning = status_label.includes("WARNING");

  return (
    <div 
      className="glass-card animate-fade-in"
      style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        border: isReady 
          ? '1px solid rgba(126, 62, 172, 0.45)' 
          : '1px solid rgba(244, 63, 94, 0.4)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(92, 46, 126, 0.25)',
        background: 'linear-gradient(180deg, rgba(22, 14, 34, 0.85) 0%, rgba(12, 8, 18, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(92, 46, 126, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(92, 46, 126, 0.3)',
            border: '1px solid #7E3EAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={20} color="#C084FC" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              {datasetName || 'Uploaded Dataset'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Structural schema audit & statistical profiling
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: isReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: isReady ? '#34D399' : '#FDA4AF',
            border: `1px solid ${isReady ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
          }}>
            {status_label}
          </span>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontWeight: 600,
            background: 'rgba(92, 46, 126, 0.25)',
            color: '#E9D5FF',
            border: '1px solid rgba(126, 62, 172, 0.4)'
          }}>
            Quality Grade: {quality_grade}
          </span>
        </div>
      </div>

      {/* Analysis Error Alert if any */}
      {analysisError && (
        <div 
          className="animate-fade-in"
          style={{
            marginBottom: '1.5rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.5)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(244, 63, 94, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <XCircle size={22} color="#F43F5E" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#FDA4AF'
                }}>
                  ANALYSIS FAILED
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
                  Stage: <span style={{ color: '#F43F5E' }}>{analysisError.stage}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#FECDD3', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  Error: {analysisError.error}
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={runAnalysis}
              disabled={isAnalyzing}
              style={{
                background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
                borderColor: '#F43F5E',
                fontSize: '0.85rem',
                padding: '0.5rem 1.25rem'
              }}
            >
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid: 4 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'rgba(10, 6, 15, 0.5)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(92, 46, 126, 0.2)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Rows</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.25rem' }}>
            {total_rows.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: total_rows >= 100 ? '#34D399' : '#FCD34D', marginTop: '0.2rem' }}>
            {total_rows >= 100 ? 'Optimal for ML' : 'Compact Dataset'}
          </div>
        </div>

        <div style={{
          background: 'rgba(10, 6, 15, 0.5)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(92, 46, 126, 0.2)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Columns</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.25rem' }}>
            {total_columns}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {detected_columns.length} dimensions mapped
          </div>
        </div>

        <div style={{
          background: 'rgba(10, 6, 15, 0.5)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(92, 46, 126, 0.2)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completeness</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: completeness_pct > 95 ? '#34D399' : '#FCD34D', marginTop: '0.25rem' }}>
            {completeness_pct}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {total_missing_cells} missing values
          </div>
        </div>

        <div style={{
          background: 'rgba(10, 6, 15, 0.5)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(92, 46, 126, 0.2)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duplicates</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: duplicate_rows === 0 ? '#34D399' : '#FCD34D', marginTop: '0.25rem' }}>
            {duplicate_rows}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {duplicate_rows === 0 ? 'Zero row duplication' : 'Handled automatically'}
          </div>
        </div>
      </div>

      {/* Two Columns: Checklist & Mapped Dimensions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}>
        {/* Verification Checklist */}
        <div style={{
          background: 'rgba(10, 6, 15, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px solid rgba(92, 46, 126, 0.2)'
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#E9D5FF', marginBottom: '0.85rem' }}>
            Dataset Integrity Checklist
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {checklist.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.8125rem' }}>
                {item.passed ? (
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <span style={{ color: item.passed ? '#FFFFFF' : '#FCD34D', fontWeight: 500 }}>
                    {item.label}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapped Dimensions */}
        <div style={{
          background: 'rgba(10, 6, 15, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px solid rgba(92, 46, 126, 0.2)'
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#E9D5FF', marginBottom: '0.85rem' }}>
            Mapped Business Dimensions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {detected_columns.map((col, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{col.dimension}:</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  background: 'rgba(92, 46, 126, 0.25)',
                  border: '1px solid rgba(126, 62, 172, 0.35)',
                  borderRadius: '4px',
                  color: '#F3E8FF'
                }}>
                  {col.column_name}
                </span>
              </div>
            ))}

            {missing_columns.length > 0 && (
              <div style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(92, 46, 126, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: '#FCD34D', marginBottom: '0.25rem' }}>
                  Optional dimensions not detected (AI will use statistical heuristics):
                </div>
                {missing_columns.map((col, idx) => (
                  <div key={idx} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    • {col.dimension} (suggested: {col.suggested_names})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Action Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(92, 46, 126, 0.2)'
      }}>
        <button
          className="btn-secondary"
          onClick={openUploadDialog}
          style={{ fontSize: '0.875rem' }}
        >
          <span>Upload Different File</span>
        </button>

        <button
          className="btn-primary"
          onClick={onAnalyzeClick || runAnalysis}
          disabled={!isReady || isAnalyzing}
          style={{
            padding: '0.85rem 2.25rem',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: isReady ? '0 0 25px rgba(126, 62, 172, 0.6)' : 'none'
          }}
        >
          <Play size={18} fill="#FFFFFF" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Data'}</span>
        </button>
      </div>
    </div>
  );
};
