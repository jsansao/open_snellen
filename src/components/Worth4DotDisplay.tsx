import React from 'react';

export const Worth4DotDisplay: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full p-8 bg-black text-white">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">Worth 4-Dot Binocular Test</h2>
        <p className="text-xs opacity-75 max-w-md">
          Patient wears Red-Green glasses (Red lens right eye, Green lens left eye).
          Evaluates binocular single vision, fusion, and eye suppression.
        </p>
      </div>

      {/* Diamond Arrangement of 4 Lights */}
      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] my-4 bg-slate-950 border-4 border-slate-900 rounded-full p-6 shadow-2xl flex items-center justify-center">
        <svg viewBox="-150 -150 300 300" className="w-full h-full">
          {/* Top Dot: RED */}
          <circle cx="0" cy="-80" r="32" fill="#ef4444" className="shadow-lg shadow-red-500/50" />

          {/* Left Dot: GREEN */}
          <circle cx="-80" cy="0" r="32" fill="#22c55e" className="shadow-lg shadow-green-500/50" />

          {/* Right Dot: GREEN */}
          <circle cx="80" cy="0" r="32" fill="#22c55e" className="shadow-lg shadow-green-500/50" />

          {/* Bottom Dot: WHITE */}
          <circle cx="0" cy="80" r="32" fill="#ffffff" className="shadow-lg shadow-white/50" />
        </svg>
      </div>

      {/* Diagnostic Legend */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono opacity-80 text-center max-w-2xl">
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-indigo-400 font-bold">4 Dots Seen:</span> Normal Fusion
        </div>
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-red-400 font-bold">2 Red Seen:</span> Left Suppression
        </div>
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-green-400 font-bold">3 Green Seen:</span> Right Suppression
        </div>
        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-amber-400 font-bold">5 Dots Seen:</span> Diplopia (Double Vision)
        </div>
      </div>
    </div>
  );
};
