import React from 'react';
import { LayerType } from '../types';
import { LEGENDS } from '../data/constants';

interface LegendProps {
  activeLayer: LayerType;
}

const Legend: React.FC<LegendProps> = ({ activeLayer }) => {
  const legendItems = LEGENDS[activeLayer];

  return (
    <div>
      <div className="text-[0.7rem] font-bold tracking-widest uppercase mb-3"
        style={{ color: 'rgba(16,185,89,0.7)' }}>
        📋 Legend
      </div>
      
      <div className="space-y-1">
        {legendItems.map((item) => (
          <div
            key={item.value}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors hover:bg-emerald-500/5"
          >
            <div
              className="w-4 h-4 rounded flex-shrink-0"
              style={{
                background: item.color,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            />
            <div>
              <span className="text-[0.7rem]" style={{ color: '#64748b' }}>{item.value}</span>
              <br />
              <span className="text-sm text-slate-300">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Guide for Advisory layer */}
      {activeLayer === 'Irrigation Advisory' && (
        <div className="mt-4 p-3 rounded-xl"
          style={{
            background: 'rgba(16,185,89,0.04)',
            border: '1px solid rgba(16,185,89,0.12)',
          }}>
          <div className="text-[0.65rem] font-bold tracking-widest uppercase mb-3"
            style={{ color: 'rgba(16,185,89,0.6)' }}>
            🎯 Action Guide
          </div>
          <div className="text-xs leading-loose">
            <div><b className="text-emerald-400">L0</b> — No irrigation needed</div>
            <div><b className="text-yellow-400">L1</b> — Check in 5–7 days</div>
            <div><b className="text-orange-400">L2</b> — Plan for 3–5 days</div>
            <div><b className="text-red-400">L3</b> — Irrigate within 2-3d</div>
            <div><b className="text-purple-400">L4</b> — 🚨 Irrigate immediately</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legend;
