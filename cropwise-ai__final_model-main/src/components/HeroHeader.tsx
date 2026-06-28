import React from 'react';

const HeroHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[20px] mb-7 p-8 md:px-10"
      style={{
        background: 'linear-gradient(135deg, rgba(5,60,30,0.95) 0%, rgba(6,78,40,0.90) 40%, rgba(4,50,25,0.95) 100%)',
        border: '1px solid rgba(16,185,89,0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 0 1px rgba(16,185,89,0.1), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
      {/* Background effects */}
      <div className="absolute -top-1/2 -left-1/5 w-[140%] h-[200%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 70% 50%, rgba(16,185,89,0.08) 0%, transparent 70%)',
        }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(16,185,89,0.4), rgba(52,211,153,0.3), transparent)',
        }} />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left side - Logo and title */}
        <div className="flex items-center">
          <span className="text-5xl animate-float mr-5">🌾</span>
          <div>
            <h1 className="text-3xl md:text-[2.6rem] font-black leading-tight mb-1"
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #6ee7b7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-1px',
              }}>
              CropWise AI
            </h1>
            <p className="text-sm" style={{ color: 'rgba(167,243,208,0.7)' }}>
              AI-Driven Crop Moisture Stress Detection & Precision Irrigation Advisory
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['🛰️ Sentinel-1/2', '🌡️ MODIS ET', '☔ CHIRPS', '🌍 Maharashtra'].map((badge) => (
                <span key={badge} className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(16,185,89,0.12)',
                    border: '1px solid rgba(16,185,89,0.25)',
                    color: '#6ee7b7',
                    letterSpacing: '0.05em',
                  }}>
                  {badge}
                </span>
              ))}
              <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                style={{
                  background: 'rgba(16,185,89,0.2)',
                  border: '1px solid rgba(16,185,89,0.25)',
                  color: '#6ee7b7',
                }}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-ring" />
                LIVE
              </span>
            </div>
          </div>
        </div>
        
        {/* Right side - Stats */}
        <div className="flex items-center gap-0">
          {[
            { value: '307K', label: 'km² coverage' },
            { value: '10m', label: 'resolution' },
            { value: '6', label: 'AI layers' },
            { value: '4', label: 'satellites' },
          ].map((stat, idx) => (
            <div key={stat.label} className="text-center px-6"
              style={{ borderLeft: idx > 0 ? '1px solid rgba(16,185,89,0.15)' : 'none' }}>
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 leading-none">
                {stat.value}
              </div>
              <div className="text-[0.68rem] mt-1 uppercase tracking-widest"
                style={{ color: 'rgba(167,243,208,0.55)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
