import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Loading satellite data...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5, 13, 10, 0.95)' }}>
      <div className="text-center">
        {/* Animated satellite icon */}
        <div className="relative mb-6">
          <div className="text-6xl animate-float">🛰️</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/30 animate-ping" />
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">CropWise AI</h2>
        <p className="text-slate-400 text-sm animate-pulse">{message}</p>

        {/* Progress bar */}
        <div className="mt-6 w-64 h-1 rounded-full overflow-hidden mx-auto"
          style={{ background: 'rgba(16,185,89,0.2)' }}>
          <div className="h-full bg-emerald-500 rounded-full animate-progress"
            style={{
              animation: 'progress 1.5s ease-in-out infinite',
            }} />
        </div>

        {/* Data sources */}
        <div className="mt-8 flex justify-center gap-4">
          {['S-2', 'S-1', 'MOD', 'CHR'].map((source, idx) => (
            <span key={source}
              className="text-xs px-2 py-1 rounded-full font-semibold opacity-0"
              style={{
                background: 'rgba(16,185,89,0.1)',
                border: '1px solid rgba(16,185,89,0.2)',
                color: '#34d399',
                animation: `fadeIn 0.5s ease-out ${idx * 0.2}s forwards`,
              }}>
              {source}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
