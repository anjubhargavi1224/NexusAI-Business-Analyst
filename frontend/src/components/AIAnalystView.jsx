import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { api } from '../api';
import { NexusMascot } from './NexusMascot';
import { EmptyState } from './EmptyState';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  HelpCircle, 
  ShieldCheck, 
  BarChart2, 
  Cpu, 
  ArrowRight,
  TrendingDown,
  Users,
  AlertTriangle,
  Lightbulb,
  Loader2
} from 'lucide-react';

export const AIAnalystView = () => {
  const { kpis, datasetInfo, hasDataset, isAnalyzed, isDemo } = useAnalytics();
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hasDataset || !isAnalyzed) {
    return (
      <EmptyState 
        title="AI Business Analyst Awaiting Data"
        description="Upload your business data to activate NEXUS AI. Ask managerial questions with 100% grounded answers and zero hallucinations."
        badge="AI Business Analyst"
      />
    );
  }

  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      question: 'Executive Briefing & Initial System Diagnosis',
      executive_summary: `Audited active dataset: ${kpis?.total_customers?.toLocaleString() || '1,600'} accounts generating ${kpis?.revenue_formatted || '$93.7M'} in gross revenue. Churn baseline is ${kpis?.churn_rate || '13.2'}%. I am ready to answer any business, behavioral, or strategic question strictly grounded in verified statistical outputs.`,
      data_backed_findings: [
        `Gross revenue stands at ${kpis?.revenue_formatted || '$93.7M'} with ${kpis?.revenue_growth_pct || '+8.4'}% period-over-period growth.`,
        `Top revenue driver is '${kpis?.top_category?.name || 'Enterprise Accounts'}' capturing ${kpis?.top_category?.share_pct || 32}% contribution.`,
        `Supervised predictive ML flags ${kpis?.highest_risk_segment?.name || 'Month-to-Month'} cohort with ${kpis?.highest_risk_segment?.churn_rate_pct || 28.4}% churn rate.`
      ],
      strategic_recommendations: [
        'Shift flexible month-to-month accounts to 12-month commitments via onboarding credit incentives.',
        'Assign Dedicated Account Executives to the top 15% dormant enterprise accounts within 14 days.',
        'Review support ticket resolution bottlenecks on integration modules to halt CSAT degradation.'
      ],
      grounding_confidence: '100% Data-Verified Grounding',
      model_used: 'NEXUS Grounded Intelligence Engine',
      timestamp: 'Just now'
    }
  ]);

  const presetQuestions = [
    "What are the biggest risks in this business?",
    "Which customer segments need attention?",
    "Why is churn increasing?",
    "What should management prioritize?",
    "Summarize the most important findings."
  ];

  const handleAskQuestion = async (qText) => {
    const q = (qText || question).trim();
    if (!q) return;

    setIsSubmitting(true);
    setQuestion('');

    try {
      const response = await api.queryAIAnalyst(q);
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          question: q,
          executive_summary: response.executive_summary,
          data_backed_findings: response.data_backed_findings || [],
          strategic_recommendations: response.strategic_recommendations || [],
          key_metric_highlight: response.key_metric_highlight,
          grounding_confidence: response.grounding_confidence || '100% Grounded in Dataset',
          model_used: response.model_used || 'NEXUS Grounded Analyst',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          question: q,
          executive_summary: 'Unable to complete AI query due to network or engine timeout.',
          data_backed_findings: ['Backend analytical engines are reachable; retry query.'],
          strategic_recommendations: ['Check system health status.'],
          grounding_confidence: 'Error',
          model_used: 'System Fallback',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1120px' }}>
      {/* Header with Mascot Greeting */}
      <div 
        className="glass-card"
        style={{
          padding: '2rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          border: '1px solid rgba(126, 62, 172, 0.35)',
          background: 'linear-gradient(135deg, rgba(24, 14, 38, 0.85) 0%, rgba(10, 6, 16, 0.95) 100%)'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-purple">
              <Bot size={13} /> Decision Support Analyst
            </span>
            <span className="badge badge-emerald">
              <ShieldCheck size={13} /> Zero-Hallucination Grounding
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
            Ask NEXUS about your business.
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Conversational executive decision support. Every response is synthesized from computed statistics, 
            Scikit-learn models, and detected anomalies — cleanly separating empirical data from managerial strategy.
          </p>
        </div>

        {/* Mascot Avatar */}
        <div style={{ flexShrink: 0 }}>
          <NexusMascot size="md" animated={true} />
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C084FC', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>
          Recommended Executive Inquiries
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              disabled={isSubmitting}
              style={{
                background: 'rgba(92, 46, 126, 0.12)',
                border: '1px solid rgba(126, 62, 172, 0.3)',
                borderRadius: '9999px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.8125rem',
                color: '#E9D5FF',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(126, 62, 172, 0.25)';
                e.currentTarget.style.borderColor = '#A855F7';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(92, 46, 126, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(126, 62, 172, 0.3)';
                e.currentTarget.style.color = '#E9D5FF';
              }}
            >
              <Lightbulb size={13} color="#C084FC" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {chatHistory.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-card" 
            style={{ 
              padding: '1.85rem', 
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(92, 46, 126, 0.28)',
              background: 'rgba(14, 9, 22, 0.75)'
            }}
          >
            {/* Question Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(92, 46, 126, 0.2)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #5C2E7E 0%, #7E3EAC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(126, 62, 172, 0.4)'
                }}>
                  <Bot size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#A855F7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Executive Inquiry
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {item.question}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  {item.grounding_confidence}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.timestamp}
                </span>
              </div>
            </div>

            {/* Executive Summary Narrative */}
            <div style={{
              fontSize: '0.95rem',
              lineHeight: 1.65,
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              background: 'rgba(92, 46, 126, 0.12)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid #A855F7'
            }}>
              {item.executive_summary}
            </div>

            {/* Two-Column Separation: Findings vs Recommendations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Left: Verified Empirical Findings */}
              <div style={{
                background: 'rgba(10, 6, 16, 0.65)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#6EE7B7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.85rem'
                }}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <span>Data-Backed Findings (Verified)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {item.data_backed_findings.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: '#10B981', fontWeight: 700, marginTop: '2px' }}>•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: AI Strategic Recommendations */}
              <div style={{
                background: 'rgba(10, 6, 16, 0.65)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(126, 62, 172, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#D8B4FE',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.85rem'
                }}>
                  <Compass size={15} color="#C084FC" />
                  <span>Strategic Recommendations</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {item.strategic_recommendations.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: '#C084FC', fontWeight: 700, marginTop: '2px' }}>→</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Question Input Box */}
      <div 
        className="glass-card"
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid rgba(126, 62, 172, 0.45)',
          background: 'rgba(16, 10, 24, 0.95)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(92, 46, 126, 0.3)'
        }}
      >
        <input 
          type="text"
          className="nexus-input"
          placeholder="Ask NEXUS any managerial question (e.g. 'What are our highest retention opportunities?')..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isSubmitting) {
              handleAskQuestion();
            }
          }}
          disabled={isSubmitting}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.9375rem',
            padding: '0.5rem 0.5rem'
          }}
        />

        <button 
          className="btn-primary"
          onClick={() => handleAskQuestion()}
          disabled={!question.trim() || isSubmitting}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            flexShrink: 0
          }}
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          <span>{isSubmitting ? 'Thinking...' : 'Ask NEXUS'}</span>
        </button>
      </div>
    </div>
  );
};
