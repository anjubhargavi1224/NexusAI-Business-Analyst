// API client for NEXUS AI backend
const API_BASE = '/api';

async function fetchJson(endpoint, options = {}, timeoutMs = 30000) {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      let stageName = null;
      try {
        const errData = await response.json();
        if (errData.detail) {
          if (typeof errData.detail === 'object') {
            stageName = errData.detail.stage;
            errorMsg = errData.detail.error || errData.detail.message || JSON.stringify(errData.detail);
          } else {
            errorMsg = errData.detail;
          }
        }
      } catch (e) {
        // ignore parse error
      }
      const err = new Error(errorMsg);
      if (stageName) err.stage = stageName;
      throw err;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error(`Request timed out after ${timeoutMs / 1000}s on [${endpoint}]. Please retry.`);
      timeoutErr.stage = 'Network / Engine Timeout';
      console.error(timeoutErr);
      throw timeoutErr;
    }
    console.error(`API Error on [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // System Health, Status & Dataset Lifecycle
  getHealth: () => fetchJson('/health'),
  getStatus: () => fetchJson('/status'),
  loadDemoDataset: () => fetchJson('/dataset/load-demo', { method: 'POST' }),
  loadSampleDataset: () => fetchJson('/dataset/load-demo', { method: 'POST' }),
  
  // Real CSV Upload with explicit error extraction
  uploadDataset: async (formData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(`${API_BASE}/dataset/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        let errDetail = `Upload failed (${res.status})`;
        try {
          const errData = await res.json();
          if (errData.detail) errDetail = errData.detail;
        } catch (e) {}
        throw new Error(errDetail);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Upload timed out. Please check file size and server connectivity.');
      }
      console.error('Upload Error:', err);
      throw err;
    }
  },

  // Trigger Analytics & ML calculation
  analyzeDataset: () => fetchJson('/dataset/analyze', { method: 'POST' }),
  resetDataset: () => fetchJson('/dataset/reset', { method: 'POST' }),
  getDataQuality: () => fetchJson('/dataset/quality'),

  // Business Analytics & Trends
  getExecutiveKPIs: () => fetchJson('/analytics/executive'),
  getTrendsAndBreakdowns: () => fetchJson('/analytics/trends'),

  // Machine Learning & Predictive Modeling
  getSegmentation: (k = 4) => fetchJson(`/ml/segmentation?k=${k}`),
  getChurnModel: () => fetchJson('/ml/churn-model'),
  simulateWhatIf: (scenarioData) => fetchJson('/ml/what-if', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scenarioData)
  }),

  // Anomaly Alerts & Action Framework
  getAnomalies: () => fetchJson('/anomalies'),
  getRecommendations: () => fetchJson('/recommendations'),

  // Grounded AI Business Analyst
  queryAIAnalyst: (question) => fetchJson('/ai/analyst', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  }),

  // Executive Memo & Governance
  getExecutiveReport: () => fetchJson('/report')
};
