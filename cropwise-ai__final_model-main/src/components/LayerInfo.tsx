import React from 'react';
import { LayerType } from '../types';
import { LAYER_DESCRIPTIONS } from '../data/constants';

interface LayerInfoProps {
  activeLayer: LayerType;
}

const LayerInfo: React.FC<LayerInfoProps> = ({ activeLayer }) => {
  return (
    <div
      className="rounded-xl py-4 px-5 mb-5 text-sm leading-relaxed"
      style={{
        background: 'linear-gradient(135deg, rgba(10,30,20,0.9), rgba(5,20,12,0.95))',
        border: '1px solid rgba(16,185,89,0.2)',
        borderLeft: '3px solid #10b981',
        color: '#cbd5e1',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}
      dangerouslySetInnerHTML={{ __html: LAYER_DESCRIPTIONS[activeLayer] }}
    />
  );
};

export default LayerInfo;
