import React, { useState, useEffect } from 'react';
import { LayerType, SeasonType } from './types';
import HeroHeader from './components/HeroHeader';
import Sidebar from './components/Sidebar';
import MetricCards from './components/MetricCards';
import AdvisoryGrid from './components/AdvisoryGrid';
import LayerInfo from './components/LayerInfo';
import MapView from './components/MapView';
import Legend from './components/Legend';
import AnalysisTabs from './components/AnalysisTabs';
import FooterCards from './components/FooterCards';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [season, setSeason] = useState<SeasonType>('Kharif 2023 (Oct-Dec)');
  const [activeLayer, setActiveLayer] = useState<LayerType>('Moisture Stress (WSI)');
  const [opacity, setOpacity] = useState(0.85);
  const [dateRange, setDateRange] = useState({ start: '2023-10-01', end: '2023-12-31' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingOverlay isLoading={isInitialLoading} message="Connecting to satellite data services..." />
      
      <div className={`flex min-h-screen transition-opacity duration-500 ${isInitialLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Sidebar */}
        <Sidebar
          season={season}
          setSeason={setSeason}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          opacity={opacity}
          setOpacity={setOpacity}
          dateRange={dateRange}
          setDateRange={setDateRange}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 md:p-6 lg:p-8 overflow-x-hidden lg:ml-0">
          {/* Hero Header */}
          <HeroHeader />

          {/* Metric Cards */}
          <MetricCards />

          {/* Advisory Grid */}
          <AdvisoryGrid />

          {/* Layer Info */}
          <LayerInfo activeLayer={activeLayer} />

          {/* Map and Legend */}
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <MapView activeLayer={activeLayer} opacity={opacity} />
            </div>
            <div className="lg:col-span-1">
              <Legend activeLayer={activeLayer} />
            </div>
          </div>

          {/* Analysis Tabs */}
          <AnalysisTabs activeLayer={activeLayer} dateRange={dateRange} />

          {/* Footer Cards */}
          <FooterCards />
        </main>
      </div>
    </>
  );
};

export default App;
