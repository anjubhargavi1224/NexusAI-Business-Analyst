import React from 'react';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { AIAnalystView } from './components/AIAnalystView';
import { CustomerIntelligence } from './components/CustomerIntelligence';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { AnomalyDetection } from './components/AnomalyDetection';
import { RecommendationsView } from './components/RecommendationsView';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { DataQualityModal } from './components/DataQualityModal';
import { AnalysisLoadingModal } from './components/AnalysisLoadingModal';

const AppContent = () => {
  const { activeView } = useAnalytics();
  const isLanding = activeView === 'landing';

  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'analyst':
        return <AIAnalystView />;
      case 'customers':
        return <CustomerIntelligence />;
      case 'predictive':
        return <PredictiveAnalytics />;
      case 'anomalies':
        return <AnomalyDetection />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'report':
        return <ExecutiveReportView />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Collapsible Executive Sidebar (shown in dashboard views) */}
      {!isLanding && <Sidebar />}

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />
        <main style={{ flex: 1 }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Global Analysis Loading Progress Modal */}
      <AnalysisLoadingModal />

      {/* Global Data Quality & Ingestion Modal */}
      <DataQualityModal />
    </div>
  );
};

export default function App() {
  return (
    <AnalyticsProvider>
      <AppContent />
    </AnalyticsProvider>
  );
}
