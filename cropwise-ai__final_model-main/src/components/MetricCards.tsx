import React from 'react';

interface MetricCard {
  icon: string;
  label: string;
  value: string;
  unit: string;
}

const metrics: MetricCard[] = [
  { icon: '📍', label: 'Coverage Area', value: '307K', unit: 'km² monitored' },
  { icon: '🛰️', label: 'Satellite Sources', value: '4', unit: 'datasets fused' },
  { icon: '🧩', label: 'Analysis Layers', value: '6', unit: 'AI-derived maps' },
  { icon: '🎯', label: 'Best Resolution', value: '10m', unit: 'Sentinel-2 optical' },
];

const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="relative overflow-hidden rounded-2xl p-5 cursor-default transition-all duration-300 hover:-translate-y-1"
          style={{
            background: 'linear-gradient(145deg, rgba(15,25,20,0.9) 0%, rgba(10,20,15,0.95) 100%)',
            border: '1px solid rgba(16,185,89,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={(e) => {
            const card = e.currentTarget;
            card.style.borderColor = 'rgba(16,185,89,0.35)';
            card.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,89,0.1)';
            const topBar = card.querySelector('.top-bar') as HTMLElement;
            if (topBar) topBar.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget;
            card.style.borderColor = 'rgba(16,185,89,0.15)';
            card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            const topBar = card.querySelector('.top-bar') as HTMLElement;
            if (topBar) topBar.style.opacity = '0';
          }}
        >
          {/* Top bar glow */}
          <div className="top-bar absolute top-0 left-0 right-0 h-0.5 opacity-0 transition-opacity"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(16,185,89,0.6), rgba(52,211,153,0.4), transparent)',
            }} />
          
          {/* Icon */}
          <span className="text-2xl mb-2 block">{metric.icon}</span>
          
          {/* Label */}
          <div className="text-[0.68rem] font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'rgba(148,163,184,0.7)' }}>
            {metric.label}
          </div>
          
          {/* Value */}
          <div className="text-3xl font-extrabold text-emerald-400 leading-none">
            {metric.value}
          </div>
          
          {/* Unit */}
          <div className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.55)' }}>
            {metric.unit}
          </div>
          
          {/* Background glow */}
          <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(16,185,89,0.08) 0%, transparent 70%)',
            }} />
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
