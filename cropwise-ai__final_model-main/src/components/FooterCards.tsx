import React from 'react';
import { FOOTER_CARDS } from '../data/constants';

const FooterCards: React.FC = () => {
  return (
    <div className="mt-8">
      {/* Divider */}
      <div className="h-px my-5"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(16,185,89,0.2), rgba(52,211,153,0.15), transparent)',
        }} />
      
      {/* Sensor cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {FOOTER_CARDS.map((card) => (
          <div
            key={card.name}
            className="rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(145deg, rgba(10,22,16,0.9), rgba(6,15,10,0.95))',
              border: '1px solid rgba(16,185,89,0.12)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(16,185,89,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(16,185,89,0.12)';
            }}
          >
            <span className="text-xl block mb-1.5">{card.icon}</span>
            <div className="text-[0.64rem] font-bold uppercase tracking-widest mb-1"
              style={{ color: 'rgba(148,163,184,0.55)' }}>
              {card.label}
            </div>
            <div className="text-sm font-bold text-emerald-400">{card.name}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.5)' }}>
              {card.description}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom branding */}
      <div className="text-center mt-10 pt-5"
        style={{ borderTop: '1px solid rgba(16,185,89,0.08)' }}>
        <div className="text-2xl mb-1.5">🌾</div>
        <div className="text-lg font-bold text-emerald-400 tracking-tight">CropWise AI</div>
        <div className="text-xs mt-1" style={{ color: '#334155' }}>
          ISRO Hackathon 2024 · AI Crop Automation · Maharashtra Agricultural Intelligence
        </div>
        <div className="text-[0.68rem] mt-1" style={{ color: '#1e293b' }}>
          Powered by Sentinel-1/2 · MODIS · CHIRPS · Google Earth Engine
        </div>
      </div>
    </div>
  );
};

export default FooterCards;
