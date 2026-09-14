import React, { useMemo, useState } from 'react';
import { ISHIHARA_PLATES, IshiharaPlate } from '../utils/testsData';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface IshiharaDisplayProps {
  plateIndex: number;
  onSelectPlate: (index: number) => void;
}

// Pseudorandom deterministic seed generator for reproducible dot plates
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Canvas-assisted stippling algorithm for realistic, typographical Ishihara plates
function generateIshiharaDots(plate: IshiharaPlate): Array<{ x: number; y: number; r: number; color: string }> {
  // 1. Draw numeral text onto offscreen 300x300 canvas for exact pixel masking
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 150px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(plate.numberText, 150, 150);

  const imgData = ctx.getImageData(0, 0, 300, 300).data;

  // Check if SVG coordinate (x,y in range -180..180) falls on numeral text
  const isDigitPixel = (x: number, y: number) => {
    const canvasX = Math.round(((x + 180) / 360) * 300);
    const canvasY = Math.round(((y + 180) / 360) * 300);
    if (canvasX < 0 || canvasX >= 300 || canvasY < 0 || canvasY >= 300) return false;
    const idx = (canvasY * 300 + canvasX) * 4;
    return imgData[idx + 3] > 128; // Alpha threshold check
  };

  // 2. Structured ring-jitter dot packing inside 180px radius plate
  const dots: Array<{ x: number; y: number; r: number; color: string }> = [];
  let seed = plate.id * 888;
  const numRings = 18;

  for (let rIdx = 1; rIdx <= numRings; rIdx++) {
    const r = (rIdx / numRings) * 175;
    const circumference = 2 * Math.PI * r;
    const dotsInRing = Math.floor(circumference / 13.5);

    for (let dIdx = 0; dIdx < dotsInRing; dIdx++) {
      const angle = (dIdx / dotsInRing) * 2 * Math.PI + (seededRandom(seed++) * 0.25);
      const jitterR = r + (seededRandom(seed++) - 0.5) * 5;
      if (jitterR > 176) continue;

      const x = Math.cos(angle) * jitterR;
      const y = Math.sin(angle) * jitterR;
      const dotRadius = 3.5 + seededRandom(seed++) * 5.5;

      const isText = isDigitPixel(x, y);
      const colorPalette = isText ? plate.palette.numColors : plate.palette.bgColors;
      const color = colorPalette[Math.floor(seededRandom(seed++) * colorPalette.length)];

      dots.push({ x, y, r: dotRadius, color });
    }
  }

  return dots;
}

export const IshiharaDisplay: React.FC<IshiharaDisplayProps> = ({
  plateIndex,
  onSelectPlate,
}) => {
  const activeIdx = Math.min(Math.max(plateIndex, 0), ISHIHARA_PLATES.length - 1);
  const plate = ISHIHARA_PLATES[activeIdx];
  const [showKey, setShowKey] = useState(false);

  // Generate crisp canvas-masked pseudoisochromatic dots
  const dots = useMemo(() => {
    return generateIshiharaDots(plate);
  }, [plate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full p-6 bg-slate-950 text-slate-100 select-none">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Ishihara Color Vision Screening</h2>
        <p className="text-xs text-slate-400">
          Plate {activeIdx + 1} of {ISHIHARA_PLATES.length}
        </p>
      </div>

      {/* SVG Pseudoisochromatic Plate */}
      <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] my-2 bg-slate-900 border-4 border-slate-800 rounded-full p-4 shadow-2xl flex items-center justify-center">
        <svg viewBox="-200 -200 400 400" className="w-full h-full">
          {/* Plate Background Base */}
          <circle cx="0" cy="0" r="190" fill="#2d3748" />

          {/* Canvas Masked Pseudoisochromatic Dots */}
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.color} />
          ))}
        </svg>
      </div>

      {/* Navigation & Examiner Key Toggle */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md mt-4">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => onSelectPlate(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded-lg border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <button
            onClick={() => setShowKey(!showKey)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300"
          >
            {showKey ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-indigo-400" />}
            <span>{showKey ? 'Hide Answer Key' : 'Show Examiner Key'}</span>
          </button>

          <button
            onClick={() => onSelectPlate(Math.min(ISHIHARA_PLATES.length - 1, activeIdx + 1))}
            disabled={activeIdx === ISHIHARA_PLATES.length - 1}
            className="flex items-center gap-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold rounded-lg border border-slate-700"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Examiner Answer Key */}
        {showKey && (
          <div className="w-full text-center p-3 bg-slate-900 border border-slate-800 rounded-xl animate-in fade-in duration-150">
            <div className="text-xs font-bold text-indigo-400 mb-0.5">
              Normal Vision Expected Response: <span className="text-white text-sm">{plate.normalVisionResponse}</span>
            </div>
            <div className="text-xs text-rose-400">
              Red-Green Deficient Response: <span className="text-white text-sm">{plate.redGreenDeficientResponse}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 italic">{plate.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};
