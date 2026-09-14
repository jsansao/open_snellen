import React from 'react';
import { ChartSettings, CalibrationData, VisualAcuityLine } from '../types/snellen';
import { DEFAULT_ACUITY_LINES, getLineOptotypes } from '../utils/optotypes';
import { calculateOptotypeHeightPx, DEFAULT_PPM } from '../utils/calibration';
import { OptotypeItem } from './OptotypeItem';

// Specialized test displays
import { AstigmatismDisplay } from './AstigmatismDisplay';
import { ContrastDisplay } from './ContrastDisplay';
import { IshiharaDisplay } from './IshiharaDisplay';
import { AmslerGridDisplay } from './AmslerGridDisplay';
import { Worth4DotDisplay } from './Worth4DotDisplay';
import { ETDRSChartDisplay } from './ETDRSChartDisplay';

interface OptotypeDisplayProps {
  settings: ChartSettings;
  calibration: CalibrationData;
  lines?: VisualAcuityLine[];
  onSelectLine?: (index: number) => void;
  onUpdateSettings?: (newSettings: Partial<ChartSettings>) => void;
}

export const OptotypeDisplay: React.FC<OptotypeDisplayProps> = ({
  settings,
  calibration,
  lines = DEFAULT_ACUITY_LINES,
  onSelectLine,
  onUpdateSettings,
}) => {
  // ROUTE SPECIALIZED EXAMINATION MODES
  if (settings.examMode === 'astigmatism') {
    return (
      <AstigmatismDisplay
        mode={settings.astigmatismMode}
        inverted={settings.inverted}
      />
    );
  }

  if (settings.examMode === 'contrast') {
    return (
      <ContrastDisplay
        currentStepIndex={settings.contrastIndex}
        onSelectStep={(idx) => onUpdateSettings && onUpdateSettings({ contrastIndex: idx })}
        inverted={settings.inverted}
      />
    );
  }

  if (settings.examMode === 'ishihara') {
    return (
      <IshiharaDisplay
        plateIndex={settings.ishiharaPlateIndex}
        onSelectPlate={(idx) => onUpdateSettings && onUpdateSettings({ ishiharaPlateIndex: idx })}
      />
    );
  }

  if (settings.examMode === 'amsler') {
    return (
      <AmslerGridDisplay
        isRedGrid={settings.amslerRedGrid}
        onToggleRedGrid={() => onUpdateSettings && onUpdateSettings({ amslerRedGrid: !settings.amslerRedGrid })}
      />
    );
  }

  if (settings.examMode === 'worth4dot') {
    return <Worth4DotDisplay />;
  }

  if (settings.examMode === 'etdrs') {
    return (
      <ETDRSChartDisplay
        settings={settings}
        calibration={calibration}
        onSelectLine={onSelectLine}
      />
    );
  }

  // DEFAULT: VISUAL ACUITY CHART DISPLAY
  const ppm = calibration.isCalibrated ? calibration.pixelsPerMm : DEFAULT_PPM;
  const activeLineIndex = Math.min(Math.max(settings.currentLineIndex, 0), lines.length - 1);
  const activeLine = lines[activeLineIndex];

  const activeOptotypes = getLineOptotypes(activeLine, settings.optotypeType, settings.randomize);
  const bgColor = settings.inverted ? 'bg-black text-white' : 'bg-white text-black';

  return (
    <div className={`relative flex-1 flex flex-col items-center justify-center min-h-[500px] w-full p-6 select-none overflow-hidden ${bgColor} transition-colors duration-200`}>
      
      {/* Duochrome Background Overlay */}
      {settings.duochrome && (
        <div className="absolute inset-0 flex pointer-events-none z-0">
          <div className="w-1/2 h-full bg-red-600/30 dark:bg-red-700/40 border-r border-slate-700/50" />
          <div className="w-1/2 h-full bg-green-600/30 dark:bg-green-700/40" />
        </div>
      )}

      {/* Main Display Area */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl my-auto py-8">
        
        {/* SINGLE OPTOTYPE MODE */}
        {settings.displayMode === 'single' && (
          <div className="flex flex-col items-center justify-center">
            <div className="relative p-8 flex items-center justify-center">
              {settings.crowdingBars && (
                <div className="absolute inset-0 border-y-4 border-current opacity-80 pointer-events-none" />
              )}
              <OptotypeItem
                symbol={activeOptotypes[settings.currentOptotypeIndex % activeOptotypes.length] || activeOptotypes[0]}
                type={settings.optotypeType}
                heightPx={calculateOptotypeHeightPx(
                  settings.distanceValue,
                  settings.distanceUnit,
                  activeLine.logMar,
                  ppm
                )}
              />
            </div>
            <div className="mt-8 text-sm font-semibold tracking-wider opacity-75 bg-slate-800/10 px-4 py-1.5 rounded-full border border-current/20">
              {activeLine.snellenFeet} • {activeLine.snellenMeters} • LogMAR {activeLine.logMar.toFixed(2)}
            </div>
          </div>
        )}

        {/* SINGLE LINE MODE */}
        {settings.displayMode === 'line' && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative py-8 px-12 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
              {settings.crowdingBars && (
                <div className="absolute inset-x-0 top-0 bottom-0 border-y-4 border-current opacity-80 pointer-events-none" />
              )}

              {activeOptotypes.map((opt, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-150 ${
                    idx === settings.currentOptotypeIndex ? 'ring-2 ring-indigo-500 ring-offset-4 rounded p-1' : ''
                  }`}
                >
                  <OptotypeItem
                    symbol={opt}
                    type={settings.optotypeType}
                    heightPx={calculateOptotypeHeightPx(
                      settings.distanceValue,
                      settings.distanceUnit,
                      activeLine.logMar,
                      ppm
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 text-sm font-semibold tracking-wider opacity-75 bg-slate-800/10 px-4 py-1.5 rounded-full border border-current/20">
              {activeLine.snellenFeet} • {activeLine.snellenMeters} • LogMAR {activeLine.logMar.toFixed(2)} • Decimal {activeLine.decimal}
            </div>
          </div>
        )}

        {/* FULL CHART CASCADE MODE */}
        {settings.displayMode === 'full' && (
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 w-full">
            {lines.map((line, lineIdx) => {
              const isActive = lineIdx === activeLineIndex;
              const heightPx = calculateOptotypeHeightPx(
                settings.distanceValue,
                settings.distanceUnit,
                line.logMar,
                ppm
              );

              const lineSymbols = getLineOptotypes(line, settings.optotypeType, settings.randomize);

              return (
                <div
                  key={line.id}
                  onClick={() => onSelectLine && onSelectLine(lineIdx)}
                  className={`relative flex items-center justify-between w-full max-w-4xl px-6 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-500/15 border-2 border-indigo-500 scale-[1.02] shadow-lg'
                      : 'hover:bg-slate-500/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="w-24 text-left font-mono text-xs sm:text-sm font-medium opacity-60">
                    {line.snellenFeet}
                  </div>

                  <div className="flex-1 flex items-center justify-center gap-4 sm:gap-8 flex-wrap py-1">
                    {lineSymbols.map((opt, optIdx) => (
                      <OptotypeItem
                        key={optIdx}
                        symbol={opt}
                        type={settings.optotypeType}
                        heightPx={heightPx}
                      />
                    ))}
                  </div>

                  <div className="w-24 text-right font-mono text-xs sm:text-sm font-medium opacity-60">
                    {line.snellenMeters}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
