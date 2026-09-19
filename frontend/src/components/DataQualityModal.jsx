import React, { useState, useRef } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { 
  ShieldCheck, 
  UploadCloud, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Database,
  Hash,
  Calendar,
  X
} from 'lucide-react';

export const DataQualityModal = () => {
  const { 
    isQualityModalOpen, 
    setIsQualityModalOpen, 
    datasetInfo, 
    uploadAndValidate, 
    loadDemo, 
    resetWorkspace,
    isLoading 
  } = useAnalytics();

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  if (!isQualityModalOpen) return null;

  const quality = datasetInfo?.quality_report || {};
  const schema = datasetInfo?.schema || {};
  const profiles = schema?.column_profiles || [];

  const handleFile = async (file) => {
    if (!file) return;
    setUploadError(null);
    try {
      await uploadAndValidate(file);
    } catch (e) {
      setUploadError(e.message || 'Failed to upload CSV');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 'clamp(0.75rem, 3vw, 1.5rem)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: 'clamp(1rem, 3vw, 2.5rem)',
        border: '1px solid var(--border-highlight)',
        background: 'var(--bg-app)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span className="badge badge-emerald">
                <ShieldCheck size={14} /> Automated Health Audit
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Schema Profiling & Readiness</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.625rem)' }}>Dataset Quality & Ingestion Center</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Currently Active: <strong>{datasetInfo?.dataset_name || 'Enterprise Telemetry Dataset'}</strong>
            </p>
          </div>

          <button 
            onClick={() => setIsQualityModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quality Scorecard Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, textTransform: 'uppercase' }}>Quality Score</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399', margin: '0.25rem 0' }}>
              {quality.quality_score || 98}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{quality.quality_grade || 'Grade A'}</span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Records</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
              {quality.total_rows?.toLocaleString() || 1600}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accounts Profiled</span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Feature Columns</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.25rem 0' }}>
              {quality.total_columns || 19}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Multi-Modal Fields</span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Missing Cell Rate</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: (quality.missing_rate_pct || 0) > 5 ? '#FB7185' : '#34D399', margin: '0.25rem 0' }}>
              {quality.missing_rate_pct || 0.0}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{quality.total_missing_cells || 0} empty cells</span>
          </div>
        </div>

        {/* Drag & Drop File Upload Box */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Ingest Custom CSV Dataset
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              textAlign: 'center',
              background: dragActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.01)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".csv,.txt" 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
              }}
            />

            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(92, 46, 126, 0.2)', border: '1px solid rgba(126, 62, 172, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <UploadCloud size={24} color="#C084FC" />
            </div>

            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Drop your custom CSV here, or click to browse
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Supports any sales, transactional, customer, or churn dataset. The system will automatically detect types, profile metrics, and adapt models.
            </p>
          </div>

          {uploadError && (
            <div style={{ marginTop: '0.75rem', color: '#FB7185', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={15} />
              <span>{uploadError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-secondary"
              onClick={loadDemo}
              disabled={isLoading}
              style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
            >
              <RotateCcw size={14} />
              <span>Use Bundled Demo Dataset</span>
            </button>
          </div>
        </div>

        {/* Column Profiling Breakdown */}
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Inferred Column Schema & Profile
          </div>

          <div className="table-responsive-wrapper" style={{ maxHeight: '260px', overflowY: 'auto' }}>
            <table className="nexus-table" style={{ minWidth: '550px' }}>
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Inferred Role</th>
                  <th>Missing Rate</th>
                  <th>Unique Values</th>
                  <th>Summary Statistics</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{p.name}</td>
                    <td>
                      <span className={`badge ${
                        p.type.includes('target') ? 'badge-rose' : 
                        p.type === 'numeric' ? 'badge-cyan' : 
                        p.type === 'datetime' ? 'badge-amber' : 'badge-violet'
                      }`} style={{ fontSize: '0.6875rem' }}>
                        {p.type}
                      </span>
                    </td>
                    <td>{p.missing_pct}%</td>
                    <td>{p.unique_count}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.min !== undefined && p.min !== null 
                        ? `Min: ${p.min} | Max: ${p.max} | Avg: ${p.mean}` 
                        : (p.top_values ? Object.keys(p.top_values).slice(0, 2).join(', ') : 'Categorical values')
                      }
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
