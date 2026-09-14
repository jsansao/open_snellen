import React, { useState } from 'react';
import { X, Check, RotateCcw, CreditCard, MonitorCheck } from 'lucide-react';
import { CalibrationData } from '../types/snellen';
import { CREDIT_CARD_WIDTH_MM, calculatePpmFromCardWidth } from '../utils/calibration';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calibration: CalibrationData;
  onSaveCalibration: (newCalibration: CalibrationData) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  calibration,
  onSaveCalibration,
}) => {
  // Initial width in UI pixels (default ~323.5px for ~96 DPI screen)
  const initialWidth = calibration.cardWidthPx || Math.round(CREDIT_CARD_WIDTH_MM * 3.7795);
  const [cardPx, setCardPx] = useState<number>(initialWidth);

  if (!isOpen) return null;

  const currentPpm = calculatePpmFromCardWidth(cardPx);
  const estimatedDpi = Math.round(currentPpm * 25.4);

  const handleSave = () => {
    onSaveCalibration({
      cardWidthPx: cardPx,
      pixelsPerMm: currentPpm,
      isCalibrated: true,
    });
    onClose();
  };

  const handleReset = () => {
    const defaultPx = Math.round(CREDIT_CARD_WIDTH_MM * 3.7795);
    setCardPx(defaultPx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col items-center">
        
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <MonitorCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Screen Calibration</h2>
              <p className="text-xs text-slate-400">Match the box below to a physical card (e.g., Credit Card / ID Card)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-slate-300 text-center mb-6 max-w-lg">
          Hold a standard credit card or driver's license (width: <strong>85.6 mm</strong>) against your screen and adjust the slider until the blue rectangle matches the exact width of your card.
        </div>

        {/* Physical Measurement Card Target */}
        <div className="flex flex-col items-center justify-center my-4 w-full overflow-hidden">
          <div
            style={{ width: `${cardPx}px`, height: `${Math.round(cardPx / 1.586)}px` }}
            className="relative border-2 border-dashed border-indigo-400 bg-indigo-500/15 rounded-xl flex flex-col items-center justify-center transition-all duration-75 shadow-lg shadow-indigo-500/10"
          >
            <CreditCard className="w-10 h-10 text-indigo-400 mb-2 opacity-80" />
            <span className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
              Place Physical Card Here
            </span>
            <span className="text-[10px] font-mono text-indigo-400/80 mt-1">
              {cardPx} px • 85.6 mm
            </span>
          </div>
        </div>

        {/* Controls Slider */}
        <div className="w-full max-w-md my-6 flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full text-xs text-slate-400 font-mono">
            <span>Smaller</span>
            <span className="text-indigo-400 font-bold">{cardPx} px ({estimatedDpi} DPI)</span>
            <span>Larger</span>
          </div>
          <input
            type="range"
            min="200"
            max="600"
            step="1"
            value={cardPx}
            onChange={(e) => setCardPx(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setCardPx((prev) => Math.max(200, prev - 1))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md border border-slate-700"
            >
              -1 px
            </button>
            <button
              onClick={() => setCardPx((prev) => Math.min(600, prev + 1))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md border border-slate-700"
            >
              +1 px
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md border border-slate-700 text-slate-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 w-full pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/25 transition-colors"
          >
            <Check className="w-4 h-4" /> Save Calibration
          </button>
        </div>

      </div>
    </div>
  );
};
