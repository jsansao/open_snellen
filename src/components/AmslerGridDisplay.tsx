import React from 'react';

interface AmslerGridDisplayProps {
  isRedGrid: boolean;
  onToggleRedGrid?: () => void;
}

export const AmslerGridDisplay: React.FC<AmslerGridDisplayProps> = ({
  isRedGrid,
  onToggleRedGrid,
}) => {
  const strokeColor = isRedGrid ? '#ef4444' : '#ffffff';
  const dotColor = isRedGrid ? '#ef4444' : '#ffffff';

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full p-6 bg-black text-white">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Amsler Macular Grid Test</h2>
        <p className="text-xs opacity-75">
          Focus continuously on the central dot. Report any wavy, distorted, broken, or missing grid lines.
        </p>
      </div>

      <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] my-2 border-4 border-slate-800 p-2 rounded-2xl bg-black shadow-2xl flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* 20x20 Grid Lines */}
          {Array.from({ length: 21 }, (_, i) => {
            const pos = i * 20;
            return (
              <g key={i}>
                {/* Horizontal line */}
                <line
                  x1="0"
                  y1={pos}
                  x2="400"
                  y2={pos}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                {/* Vertical line */}
                <line
                  x1={pos}
                  y1="0"
                  x2={pos}
                  y2="400"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Central Fixation Dot */}
          <circle cx="200" cy="200" r="7" fill={dotColor} />
        </svg>
      </div>

      {/* Grid Color Toggle */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onToggleRedGrid}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
            isRedGrid
              ? 'bg-red-600/20 text-red-400 border-red-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isRedGrid ? 'Red Grid Active' : 'Switch to Red Grid'}
        </button>
      </div>
    </div>
  );
};
