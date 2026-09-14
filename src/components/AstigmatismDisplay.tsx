import React from 'react';

interface AstigmatismDisplayProps {
  mode: 'clock' | 'dots';
  inverted?: boolean;
}

export const AstigmatismDisplay: React.FC<AstigmatismDisplayProps> = ({ mode, inverted }) => {
  const strokeColor = inverted ? '#ffffff' : '#000000';
  const bgColor = inverted ? 'bg-black text-white' : 'bg-white text-black';

  if (mode === 'dots') {
    // Jackson Cross Cylinder Dot Matrix
    return (
      <div className={`flex-1 flex flex-col items-center justify-center w-full p-8 ${bgColor}`}>
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">Jackson Cross Cylinder Dot Matrix</h2>
          <p className="text-xs opacity-75">Astigmatism axis & power refinement dot grid</p>
        </div>
        <div className="grid grid-cols-8 gap-6 sm:gap-10 p-8 border-2 border-current rounded-3xl bg-slate-500/5">
          {Array.from({ length: 48 }, (_, i) => (
            <div
              key={i}
              className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-current transition-transform hover:scale-125"
            />
          ))}
        </div>
      </div>
    );
  }

  // Astigmatic Clock Dial / Sunburst Fan (12 Radiating Line Pairs at 30° intervals)
  return (
    <div className={`flex-1 flex flex-col items-center justify-center w-full p-8 ${bgColor}`}>
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Astigmatic Clock Dial (Sunburst Fan)</h2>
        <p className="text-xs opacity-75">Identify principal astigmatic meridians (lines appear darker/sharper along astigmatic axis)</p>
      </div>

      <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px]">
        <svg viewBox="-220 -220 440 440" className="w-full h-full">
          {/* Outer circle */}
          <circle cx="0" cy="0" r="180" fill="none" stroke={strokeColor} strokeWidth="3" />

          {/* Radiating 12 hour lines */}
          {Array.from({ length: 12 }, (_, i) => {
            const hour = i === 0 ? 12 : i;
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = Math.cos(angle) * 40;
            const y1 = Math.sin(angle) * 40;
            const x2 = Math.cos(angle) * 170;
            const y2 = Math.sin(angle) * 170;

            const textX = Math.cos(angle) * 200;
            const textY = Math.sin(angle) * 200;

            return (
              <g key={i}>
                {/* Dual parallel lines for each hour */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <text
                  x={textX}
                  y={textY}
                  fill={strokeColor}
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {hour}
                </text>
              </g>
            );
          })}

          {/* Central target dot */}
          <circle cx="0" cy="0" r="8" fill={strokeColor} />
        </svg>
      </div>
    </div>
  );
};
