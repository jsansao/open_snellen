import React from 'react';
import { PELLI_ROBSON_CONTRAST_STEPS, PELLI_ROBSON_TRIPLETS } from '../utils/testsData';
import { OptotypeItem } from './OptotypeItem';

interface ContrastDisplayProps {
  currentStepIndex: number;
  onSelectStep?: (index: number) => void;
  inverted?: boolean;
}

export const ContrastDisplay: React.FC<ContrastDisplayProps> = ({
  currentStepIndex,
  onSelectStep,
  inverted,
}) => {
  const activeIdx = Math.min(Math.max(currentStepIndex, 0), PELLI_ROBSON_CONTRAST_STEPS.length - 1);
  const bgColor = inverted ? 'bg-black text-white' : 'bg-white text-black';

  return (
    <div className={`flex-1 flex flex-col items-center justify-center w-full p-6 ${bgColor}`}>
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">Pelli-Robson Contrast Sensitivity Chart</h2>
        <p className="text-xs opacity-75">
          Step {activeIdx + 1} of {PELLI_ROBSON_CONTRAST_STEPS.length} • Contrast:{' '}
          <strong className="font-mono text-indigo-400">{PELLI_ROBSON_CONTRAST_STEPS[activeIdx].percent}%</strong> (LogCS{' '}
          {PELLI_ROBSON_CONTRAST_STEPS[activeIdx].logCs.toFixed(2)})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        {PELLI_ROBSON_CONTRAST_STEPS.map((step, idx) => {
          const isActive = idx === activeIdx;
          const triplet = PELLI_ROBSON_TRIPLETS[idx % PELLI_ROBSON_TRIPLETS.length];
          const opacity = step.percent / 100;

          return (
            <div
              key={idx}
              onClick={() => onSelectStep && onSelectStep(idx)}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/50 bg-indigo-500/10 scale-[1.02]'
                  : 'border-current/10 hover:border-current/30'
              }`}
            >
              <div className="text-xs font-mono opacity-50 w-16">
                #{idx + 1} ({step.percent}%)
              </div>
              <div className="flex gap-6 items-center" style={{ opacity }}>
                {triplet.map((char, cIdx) => (
                  <OptotypeItem
                    key={cIdx}
                    symbol={char}
                    type="sloan"
                    heightPx={42}
                  />
                ))}
              </div>
              <div className="text-xs font-mono opacity-50 w-16 text-right">
                {step.logCs.toFixed(2)} LogCS
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
