import React, { useState } from 'react';
import { LayerType } from '../types';
import { PROCESSING_PIPELINE_CODE } from '../data/constants';

interface AnalysisTabsProps {
  activeLayer: LayerType;
  dateRange: { start: string; end: string };
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ activeLayer, dateRange }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { label: '📊  Analysis Details', id: 0 },
    { label: '💡  Interpretation Guide', id: 1 },
    { label: '🔧  Technical Info', id: 2 },
  ];

  return (
    <div className="mt-8">
      {/* Tab buttons */}
      <div className="inline-flex gap-1 p-1.5 rounded-xl mb-4"
        style={{
          background: 'rgba(5,15,10,0.6)',
          border: '1px solid rgba(16,185,89,0.12)',
        }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl p-5"
              style={{
                background: 'rgba(10,25,18,0.8)',
                border: '1px solid rgba(16,185,89,0.15)',
              }}>
              <div className="text-[0.65rem] font-bold tracking-widest uppercase mb-4"
                style={{ color: 'rgba(16,185,89,0.6)' }}>
                📌 Current Layer Info
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Active Layer</td>
                    <td className="font-semibold text-slate-200">{activeLayer}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Time Period</td>
                    <td className="font-semibold text-slate-200">{dateRange.start} → {dateRange.end}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Resolution</td>
                    <td className="font-semibold text-slate-200">10–30 m</td>
                  </tr>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Data Latency</td>
                    <td className="font-semibold text-emerald-400">~5–8 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl p-5"
              style={{
                background: 'rgba(10,25,18,0.8)',
                border: '1px solid rgba(16,185,89,0.15)',
              }}>
              <div className="text-[0.65rem] font-bold tracking-widest uppercase mb-4"
                style={{ color: 'rgba(16,185,89,0.6)' }}>
                ⚡ Quick Stats
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>System Status</td>
                    <td className="font-semibold text-emerald-400">✅ All Systems Operational</td>
                  </tr>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Pixels Analyzed</td>
                    <td className="font-semibold text-slate-200">~1 M pixels</td>
                  </tr>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Coverage</td>
                    <td className="font-semibold text-slate-200">307,000 km²</td>
                  </tr>
                  <tr>
                    <td className="py-1.5" style={{ color: '#64748b' }}>Processing Time</td>
                    <td className="font-semibold text-slate-200">~90 seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl p-5"
              style={{
                background: 'rgba(10,25,18,0.8)',
                border: '1px solid rgba(16,185,89,0.15)',
              }}>
              <div className="text-2xl mb-2">🌾</div>
              <div className="text-sm font-bold text-emerald-400 mb-3">For Farmers</div>
              <ul className="text-sm space-y-2" style={{ color: '#94a3b8' }}>
                <li>• <b className="text-emerald-400">Green</b> = No irrigation needed</li>
                <li>• <b className="text-red-400">Red</b> = Irrigate immediately</li>
                <li>• <b className="text-yellow-400">Yellow/Orange</b> = Water in 2-5 days</li>
                <li>• Use advisory layer for daily decisions</li>
              </ul>
            </div>

            <div className="rounded-xl p-5"
              style={{
                background: 'rgba(10,25,18,0.8)',
                border: '1px solid rgba(16,185,89,0.15)',
              }}>
              <div className="text-2xl mb-2">🏢</div>
              <div className="text-sm font-bold text-emerald-400 mb-3">For Canal Managers</div>
              <ul className="text-sm space-y-2" style={{ color: '#94a3b8' }}>
                <li>• Use <b className="text-blue-400">Water Deficit</b> for release planning</li>
                <li>• <b className="text-purple-400">Advisory layer</b> shows priority zones</li>
                <li>• Plan 8-day irrigation cycles</li>
                <li>• Identify drought hotspots early</li>
              </ul>
            </div>

            <div className="rounded-xl p-5"
              style={{
                background: 'rgba(10,25,18,0.8)',
                border: '1px solid rgba(16,185,89,0.15)',
              }}>
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm font-bold text-emerald-400 mb-3">For Policymakers</div>
              <ul className="text-sm space-y-2" style={{ color: '#94a3b8' }}>
                <li>• Identify water stress hotspots</li>
                <li>• Optimize water allocation</li>
                <li>• Plan irrigation infrastructure</li>
                <li>• Track seasonal crop patterns</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <div className="text-[0.65rem] font-bold tracking-widest uppercase mb-4"
              style={{ color: 'rgba(16,185,89,0.6)' }}>
              🔧 Data Processing Pipeline
            </div>
            <pre className="code-block whitespace-pre-wrap">
              {PROCESSING_PIPELINE_CODE}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisTabs;
