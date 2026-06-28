import React from 'react';
import { LayerType, SeasonType } from '../types';
import { LAYER_ICONS, DATA_SOURCES } from '../data/constants';

interface SidebarProps {
  season: SeasonType;
  setSeason: (season: SeasonType) => void;
  activeLayer: LayerType;
  setActiveLayer: (layer: LayerType) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  season,
  setSeason,
  activeLayer,
  setActiveLayer,
  opacity,
  setOpacity,
  dateRange,
  setDateRange,
  isOpen,
  onToggle,
}) => {
  const layers = Object.keys(LAYER_ICONS) as LayerType[];
  const seasons: SeasonType[] = ['Kharif 2023 (Oct-Dec)', 'Rabi 2023 (Jan-Mar)', 'Custom Range'];

  const handleSeasonChange = (newSeason: SeasonType) => {
    setSeason(newSeason);
    if (newSeason === 'Kharif 2023 (Oct-Dec)') {
      setDateRange({ start: '2023-10-01', end: '2023-12-31' });
    } else if (newSeason === 'Rabi 2023 (Jan-Mar)') {
      setDateRange({ start: '2023-01-01', end: '2023-03-31' });
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
      case 'orange': return 'bg-amber-500/10 border-amber-500/25 text-amber-400';
      case 'blue': return 'bg-blue-500/10 border-blue-500/25 text-blue-400';
      case 'red': return 'bg-red-500/10 border-red-500/25 text-red-400';
      default: return '';
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-emerald-900/50 border border-emerald-500/20"
      >
        <span className="text-emerald-400">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'linear-gradient(180deg, #071510 0%, #09190f 100%)',
          borderRight: '1px solid rgba(16,185,89,0.15)',
          boxShadow: '4px 0 30px rgba(0,0,0,0.5)',
        }}
      >
        <div className="h-full overflow-y-auto p-5">
          {/* Logo */}
          <div className="text-center py-4 pb-6">
            <div className="text-4xl">🌾</div>
            <div className="text-lg font-extrabold text-emerald-400 tracking-tight">CropWise AI</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.5)' }}>Control Panel</div>
          </div>

          {/* Analysis Settings */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(16,185,89,0.7)' }}>
              <span>⚙️</span> Analysis Settings
              <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(16,185,89,0.2), transparent)' }} />
            </div>
            
            <select
              value={season}
              onChange={(e) => handleSeasonChange(e.target.value as SeasonType)}
              className="w-full p-3 rounded-lg text-sm text-slate-300"
              style={{
                background: 'rgba(16,185,89,0.06)',
                border: '1px solid rgba(16,185,89,0.2)',
              }}
            >
              {seasons.map((s) => (
                <option key={s} value={s} className="bg-slate-900">{s}</option>
              ))}
            </select>

            {season !== 'Custom Range' ? (
              <div className="mt-3 p-3 rounded-lg text-xs"
                style={{
                  background: 'rgba(16,185,89,0.06)',
                  border: '1px solid rgba(16,185,89,0.15)',
                  color: '#94a3b8',
                }}>
                📅 <b className="text-emerald-400">{season.split(' ')[0]} 2023</b><br />
                {dateRange.start} → {dateRange.end}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="p-2 rounded-lg text-xs text-slate-300"
                  style={{
                    background: 'rgba(16,185,89,0.06)',
                    border: '1px solid rgba(16,185,89,0.2)',
                  }}
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="p-2 rounded-lg text-xs text-slate-300"
                  style={{
                    background: 'rgba(16,185,89,0.06)',
                    border: '1px solid rgba(16,185,89,0.2)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Layer Selection */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(16,185,89,0.7)' }}>
              <span>🗺️</span> Layer Selection
              <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(16,185,89,0.2), transparent)' }} />
            </div>
            
            <div className="space-y-1">
              {layers.map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeLayer === layer 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                      : 'text-slate-400 hover:bg-emerald-500/5'
                  }`}
                >
                  {LAYER_ICONS[layer]} {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(16,185,89,0.7)' }}>
              <span>🔆</span> Opacity
              <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(16,185,89,0.2), transparent)' }} />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${(opacity - 0.3) / 0.7 * 100}%, rgba(16,185,89,0.2) ${(opacity - 0.3) / 0.7 * 100}%, rgba(16,185,89,0.2) 100%)`,
                }}
              />
              <span className="text-emerald-400 text-sm font-semibold w-12 text-right">
                {Math.round(opacity * 100)}%
              </span>
            </div>
          </div>

          {/* Data Sources */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(16,185,89,0.7)' }}>
              <span>📡</span> Data Sources
              <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(16,185,89,0.2), transparent)' }} />
            </div>
            
            <div className="p-3 rounded-xl"
              style={{
                background: 'rgba(16,185,89,0.04)',
                border: '1px solid rgba(16,185,89,0.1)',
              }}>
              {DATA_SOURCES.map((source, idx) => (
                <div key={source.name}
                  className="flex items-center gap-2 py-2 text-xs"
                  style={{ borderBottom: idx < DATA_SOURCES.length - 1 ? '1px solid rgba(16,185,89,0.06)' : 'none' }}>
                  <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-semibold border ${getBadgeClass(source.badgeColor)}`}>
                    {source.badge}
                  </span>
                  <span className="text-slate-400">{source.name} · {source.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(16,185,89,0.7)' }}>
              <span>ℹ️</span> About
              <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(16,185,89,0.2), transparent)' }} />
            </div>
            
            <div className="text-xs leading-relaxed px-1" style={{ color: '#64748b' }}>
              <b className="text-emerald-400">ISRO Hackathon 2024</b><br />
              AI Crop Automation Track<br /><br />
              <b className="text-slate-400">Region:</b> Maharashtra, India<br />
              <b className="text-slate-400">Resolution:</b> 10-30m (Sentinel)<br />
              <b className="text-slate-400">Update Cycle:</b> 5-8 days<br /><br />
              <span className="italic" style={{ color: '#475569' }}>
                Making precision agriculture accessible to 140M farmers
              </span>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
