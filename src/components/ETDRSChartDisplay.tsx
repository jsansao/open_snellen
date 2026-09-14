import React from 'react';
import { ChartSettings, CalibrationData } from '../types/snellen';
import { ETDRS_LINES } from '../utils/testsData';
import { calculateOptotypeHeightPx, DEFAULT_PPM } from '../utils/calibration';
import { OptotypeItem } from './OptotypeItem';

interface ETDRSChartDisplayProps {
  settings: ChartSettings;
  calibration: CalibrationData;
  onSelectLine?: (index: number) => void;
}

export const ETDRSChartDisplay: React.FC<ETDRSChartDisplayProps> = ({
  settings,
  calibration,
  onSelectLine,
}) => {
  const ppm = calibration.isCalibrated ? calibration.pixelsPerMm : DEFAULT_PPM;
  const activeLineIndex = Math.min(Math.max(settings.currentLineIndex, 0), ETDRS_LINES.length - 1);

  const bgColor = settings.inverted ? 'bg-black text-white' : 'bg-white text-black';

  return (
    <div className={`flex-1 flex flex-col items-center justify-center w-full p-6 select-none ${bgColor}`}>
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">ETDRS Standardized Clinical Trial Chart</h2>
        <p className="text-xs opacity-75">
          Standardized LogMAR chart with 5 letters per line and geometric progression ($0.1$ LogMAR steps)
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 w-full max-w-4xl">
        {ETDRS_LINES.map((line, lineIdx) => {
          const isActive = lineIdx === activeLineIndex;
          const heightPx = calculateOptotypeHeightPx(
            settings.distanceValue,
            settings.distanceUnit,
            line.logMar,
            ppm
          );

          return (
            <div
              key={line.id}
              onClick={() => onSelectLine && onSelectLine(lineIdx)}
              className={`relative flex items-center justify-between w-full px-6 py-2 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-500/15 border-2 border-indigo-500 scale-[1.02] shadow-lg'
                  : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Left LogMAR label */}
              <div className="w-20 text-left font-mono text-xs sm:text-sm font-medium opacity-60">
                LogMAR {line.logMar.toFixed(1)}
              </div>

              {/* 5 Standardized ETDRS Letters */}
              <div className="flex-1 flex items-center justify-center gap-6 sm:gap-12 py-1">
                {line.optotypes.map((opt, optIdx) => (
                  <OptotypeItem
                    key={optIdx}
                    symbol={opt}
                    type="sloan"
                    heightPx={heightPx}
                  />
                ))}
              </div>

              {/* Right Snellen Feet label */}
              <div className="w-20 text-right font-mono text-xs sm:text-sm font-medium opacity-60">
                {line.snellenFeet}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
