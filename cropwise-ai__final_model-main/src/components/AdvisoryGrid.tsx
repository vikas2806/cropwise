import React from 'react';
import { ADVISORY_LEVELS } from '../data/constants';

const advisoryStyles: Record<string, React.CSSProperties> = {
  'adv-0': { background: 'rgba(16,185,89,0.1)', borderColor: 'rgba(16,185,89,0.3)', color: '#34d399' },
  'adv-1': { background: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.3)', color: '#fbbf24' },
  'adv-2': { background: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.3)', color: '#fb923c' },
  'adv-3': { background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#f87171' },
  'adv-4': { background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', color: '#c084fc' },
};

const AdvisoryGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-2 mb-5">
      {ADVISORY_LEVELS.map((level) => (
        <div
          key={level.level}
          className="rounded-xl py-3 px-2 text-center font-bold text-xs transition-transform hover:scale-105 cursor-default"
          style={{
            ...advisoryStyles[level.className],
            border: `1px solid ${advisoryStyles[level.className].borderColor}`,
          }}
        >
          <span className="text-xl block mb-1">{level.icon}</span>
          <div>{level.title}</div>
          <div className="text-[0.65rem] opacity-70 mt-1">{level.description}</div>
        </div>
      ))}
    </div>
  );
};

export default AdvisoryGrid;
