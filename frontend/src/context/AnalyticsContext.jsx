import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../api';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [activeView, setActiveView] = useState('landing');
  
  // Real Dataset & Workflow State
  const [hasDataset, setHasDataset] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [datasetName, setDatasetName] = useState(null);
  const [validationReport, setValidationReport] = useState(null);
  
  // Analytical Payloads (Populated ONLY after analysis)
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState(null);
  const [segmentation, setSegmentation] = useState(null);
  const [mlModel, setMlModel] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // UI Modals & Progress Indicators
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisError, setAnalysisError] = useState(null); // { stage: string, message: string }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Check initial backend status on mount (Never automatically preload demo data!)
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const status = await api.getStatus();
        if (status.has_dataset && status.is_analyzed) {
          setHasDataset(true);
          setIsDemo(status.is_demo);
          setIsAnalyzed(true);
          setDatasetName(status.dataset_name);
          setValidationReport(status.validation);
          await fetchAllAnalytics().catch(() => {});
        } else if (status.has_dataset && !status.is_analyzed) {
          setHasDataset(true);
          setIsDemo(false);
          setIsAnalyzed(false);
          setDatasetName(status.dataset_name);
          setValidationReport(status.validation);
        } else {
          // Clean initial state - no data
          setHasDataset(false);
          setIsDemo(false);
          setIsAnalyzed(false);
          setDatasetName(null);
          setValidationReport(null);
        }
      } catch (err) {
        console.warn('Backend status check returned:', err.message);
      }
    };
    checkInitialStatus();
  }, []);

  const fetchAllAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [qualityRes, kpiRes, trendsRes, segRes, mlRes, anomRes, recRes] = await Promise.all([
        api.getDataQuality(),
        api.getExecutiveKPIs(),
        api.getTrendsAndBreakdowns(),
        api.getSegmentation(4),
        api.getChurnModel(),
        api.getAnomalies(),
        api.getRecommendations()
      ]);

      setDatasetInfo(qualityRes);
      setKpis(kpiRes);
      setTrends(trendsRes);
      setSegmentation(segRes);
      setMlModel(mlRes);
      setAnomalies(anomRes.anomalies || []);
      setRecommendations(recRes.recommendations || []);
      return { qualityRes, kpiRes, trendsRes, segRes, mlRes, anomRes, recRes };
    } catch (err) {
      console.error('Failed to load analytics suite:', err);
      setError(err.message || 'Error connecting to analytics engine');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Real CSV Upload & Dataset Validation
  const uploadAndValidate = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(15);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 100);

      const formData = new FormData();
      formData.append('file', file);

      const res = await api.uploadDataset(formData);
      clearInterval(progressTimer);
      setUploadProgress(100);

      setHasDataset(true);
      setIsDemo(false);
      setIsAnalyzed(false);
      setDatasetName(res.dataset_name);
      setValidationReport(res.validation);
      setDatasetInfo({
        quality_report: res.quality_report,
        validation: res.validation,
        dataset_name: res.dataset_name,
        is_demo: false
      });

      // Clear any previous analysis data so old metrics are never displayed
      setKpis(null);
      setTrends(null);
      setSegmentation(null);
      setMlModel(null);
      setAnomalies([]);
      setRecommendations([]);
      setAnalysisError(null);
      setActiveView('landing');

      return res;
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please verify that your file is a valid CSV.');
      throw err;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // 2. Trigger Full Analysis Pipeline with multi-step feedback
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setError(null);
    setAnalysisStep(1); // 1: Validating dataset schema & integrity

    let t1, t2, t3, t4, t5;
    try {
      t1 = setTimeout(() => setAnalysisStep(2), 200); // 2: Calculating macro business KPIs
      t2 = setTimeout(() => setAnalysisStep(3), 400); // 3: Segmenting customer accounts
      t3 = setTimeout(() => setAnalysisStep(4), 600); // 4: Predicting customer churn
      t4 = setTimeout(() => setAnalysisStep(5), 800); // 5: Detecting operational anomalies
      t5 = setTimeout(() => setAnalysisStep(6), 1000); // 6: Generating recommendations

      // Execute backend analysis pipeline
      const analyzeRes = await api.analyzeDataset();

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      setAnalysisStep(6);

      if (analyzeRes && analyzeRes.results) {
        const r = analyzeRes.results;
        setKpis(r.kpis);
        setTrends(r.trends);
        setSegmentation(r.segmentation);
        setMlModel(r.churn);
        setAnomalies(r.anomalies || []);
        setRecommendations(r.recommendations || []);
        const qualityRes = await api.getDataQuality().catch(() => null);
        if (qualityRes) setDatasetInfo(qualityRes);
      } else {
        await fetchAllAnalytics();
      }

      setIsAnalyzed(true);
      setAnalysisError(null);
      await new Promise(r => setTimeout(r, 250));
      setActiveView('dashboard');
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      console.error('Analysis failed:', err);
      const stage = err.stage || 'Analytics Pipeline';
      const msg = err.message || 'Analysis pipeline encountered an error.';
      setAnalysisError({ stage, error: msg });
      setError(msg);
      // DO NOT navigate to dashboard on error
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // 3. Explicit Demo Dataset Loading
  const loadDemo = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setError(null);
    setAnalysisStep(1);

    try {
      await new Promise(r => setTimeout(r, 250));
      setAnalysisStep(2);
      
      const demoRes = await api.loadDemoDataset();
      setAnalysisStep(4);
      
      await new Promise(r => setTimeout(r, 250));
      setAnalysisStep(6);

      setHasDataset(true);
      setIsDemo(true);
      setIsAnalyzed(true);
      setDatasetName("Demo Dataset (1,600 Enterprise Accounts)");
      setValidationReport(demoRes.validation);
      
      if (demoRes?.results) {
        const r = demoRes.results;
        setKpis(r.kpis);
        setTrends(r.trends);
        setSegmentation(r.segmentation);
        setMlModel(r.churn);
        setAnomalies(r.anomalies || []);
        setRecommendations(r.recommendations || []);
      } else {
        await fetchAllAnalytics();
      }

      setAnalysisError(null);
      await new Promise(r => setTimeout(r, 250));
      setActiveView('dashboard');
    } catch (err) {
      const stage = err.stage || 'Demo Dataset Loading';
      const msg = err.message || 'Failed to load demo dataset';
      setAnalysisError({ stage, error: msg });
      setError(msg);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  // 4. Reset Workspace to Clean Initial State
  const resetWorkspace = async () => {
    try {
      await api.resetDataset();
    } catch (e) {
      // ignore
    }
    setHasDataset(false);
    setIsDemo(false);
    setIsAnalyzed(false);
    setDatasetName(null);
    setValidationReport(null);
    setDatasetInfo(null);
    setKpis(null);
    setTrends(null);
    setSegmentation(null);
    setMlModel(null);
    setAnomalies([]);
    setRecommendations([]);
    setUploadError(null);
    setAnalysisError(null);
    setError(null);
    setActiveView('landing');
  };

  const openUploadDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAndValidate(file);
    }
  };

  return (
    <AnalyticsContext.Provider value={{
      activeView,
      setActiveView,
      hasDataset,
      isDemo,
      isAnalyzed,
      datasetName,
      validationReport,
      datasetInfo,
      kpis,
      trends,
      segmentation,
      mlModel,
      anomalies,
      recommendations,
      isQualityModalOpen,
      setIsQualityModalOpen,
      isMobileNavOpen,
      setIsMobileNavOpen,
      isUploading,
      uploadProgress,
      uploadError,
      isAnalyzing,
      analysisStep,
      analysisError,
      setAnalysisError,
      isLoading,
      error,
      uploadAndValidate,
      runAnalysis,
      loadDemo,
      resetWorkspace,
      openUploadDialog
    }}>
      {children}
      {/* Hidden File Input for System File Picker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange} 
        accept=".csv,text/csv" 
        style={{ display: 'none' }} 
      />
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
