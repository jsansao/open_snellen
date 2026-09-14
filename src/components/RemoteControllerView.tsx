import React, { useEffect, useState } from 'react';
import { RemotePeerManager } from '../services/peerService';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  XCircle,
  Smartphone,
  Wifi,
  Sparkles,
  LayoutGrid,
  Layers
} from 'lucide-react';
import { ExamMode } from '../types/snellen';
import { ISHIHARA_PLATES } from '../utils/testsData';

interface RemoteControllerViewProps {
  remoteSessionId: string;
}

export const RemoteControllerView: React.FC<RemoteControllerViewProps> = ({ remoteSessionId }) => {
  const [peerManager] = useState(() => new RemotePeerManager());
  const [isConnected, setIsConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeExamMode, setActiveExamMode] = useState<ExamMode>('acuity');
  const [ishiharaIndex, setIshiharaIndex] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    peerManager.initClient(
      remoteSessionId,
      () => setIsConnected(true),
      () => setIsConnected(false),
      (err) => setErrorMsg(err.message || 'Connection error')
    );

    return () => {
      peerManager.destroy();
    };
  }, [remoteSessionId, peerManager]);

  const sendAction = (action: string, payload?: any) => {
    peerManager.send({
      type: 'ACTION',
      action: action as any,
      payload,
    });
  };

  const handleSetExamMode = (mode: ExamMode) => {
    setActiveExamMode(mode);
    sendAction('SET_EXAM_MODE', { examMode: mode });
  };

  const handleIshiharaNext = () => {
    setIshiharaIndex((prev) => Math.min(ISHIHARA_PLATES.length - 1, prev + 1));
    sendAction('NEXT_ISHIHARA');
  };

  const handleIshiharaPrev = () => {
    setIshiharaIndex((prev) => Math.max(0, prev - 1));
    sendAction('PREV_ISHIHARA');
  };

  const handleRecord = (pass: boolean) => {
    if (pass) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
    sendAction('RECORD_RESULT', { pass });
  };

  const currentIshiharaPlate = ISHIHARA_PLATES[ishiharaIndex];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 mb-4 animate-bounce">
          <Smartphone className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold mb-2">OpenSnellen Remote Controller</h1>
        <p className="text-sm text-slate-400 max-w-xs mb-6">
          Connecting to display host <span className="font-mono text-indigo-400 font-bold">{remoteSessionId}</span>...
        </p>
        {errorMsg ? (
          <div className="text-xs text-red-400 bg-red-950/50 p-3 rounded-lg border border-red-800/50">
            {errorMsg}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Wifi className="w-4 h-4 animate-pulse text-amber-400" /> Establishing P2P WebRTC data channel...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 max-w-md mx-auto select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Remote Connected</span>
        </div>
        <div className="text-xs text-slate-500 font-mono">ID: {remoteSessionId}</div>
      </div>

      {/* Exam Mode Selector Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-4 flex items-center gap-2 overflow-x-auto">
        <Layers className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />
        <select
          value={activeExamMode}
          onChange={(e) => handleSetExamMode(e.target.value as ExamMode)}
          className="bg-slate-800 text-indigo-300 font-bold text-xs p-2 rounded-xl border border-slate-700 w-full outline-none"
        >
          <option value="acuity">Visual Acuity Chart</option>
          <option value="astigmatism">Astigmatism Test</option>
          <option value="contrast">Contrast Sensitivity</option>
          <option value="ishihara">Ishihara Color Plates</option>
          <option value="amsler">Amsler Grid Test</option>
          <option value="worth4dot">Worth 4-Dot Test</option>
          <option value="etdrs">ETDRS Trial Chart</option>
        </select>
      </div>

      {/* Main Touch Controls Grid */}
      <div className="flex-1 flex flex-col gap-4 justify-between">
        
        {/* Acuity / ETDRS Line Navigation */}
        {(activeExamMode === 'acuity' || activeExamMode === 'etdrs') && (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-lg">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Acuity Line Size</span>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => sendAction('PREV_LINE')}
                  className="flex items-center justify-center gap-2 py-4 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <ChevronUp className="w-6 h-6" /> Larger (Line Up)
                </button>
                <button
                  onClick={() => sendAction('NEXT_LINE')}
                  className="flex items-center justify-center gap-2 py-4 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <ChevronDown className="w-6 h-6" /> Smaller (Line Down)
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-lg">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Target Optotype</span>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => sendAction('PREV_OPTOTYPE')}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-800 active:bg-slate-700 text-slate-200 font-bold rounded-xl active:scale-95 transition-all border border-slate-700"
                >
                  <ChevronLeft className="w-6 h-6" /> Prev Symbol
                </button>
                <button
                  onClick={() => sendAction('NEXT_OPTOTYPE')}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-800 active:bg-slate-700 text-slate-200 font-bold rounded-xl active:scale-95 transition-all border border-slate-700"
                >
                  <ChevronRight className="w-6 h-6" /> Next Symbol
                </button>
              </div>
            </div>
          </>
        )}

        {/* Ishihara Navigation & Clinician Answer Key */}
        {activeExamMode === 'ishihara' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-lg gap-4">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ishihara Examiner Key</span>
            
            {/* Answer Key Box */}
            <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-indigo-400 font-bold">
                Plate {ishiharaIndex + 1} • Normal Expected: <span className="text-white text-base">{currentIshiharaPlate.normalVisionResponse}</span>
              </div>
              <div className="text-xs text-rose-400 font-semibold mt-1">
                Red-Green Deficient: <span className="text-white text-base">{currentIshiharaPlate.redGreenDeficientResponse}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={handleIshiharaPrev}
                disabled={ishiharaIndex === 0}
                className="flex items-center justify-center gap-2 py-4 bg-indigo-600 disabled:opacity-40 active:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                <ChevronLeft className="w-6 h-6" /> Prev Plate
              </button>
              <button
                onClick={handleIshiharaNext}
                disabled={ishiharaIndex === ISHIHARA_PLATES.length - 1}
                className="flex items-center justify-center gap-2 py-4 bg-indigo-600 disabled:opacity-40 active:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                Next Plate <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Contrast Sensitivity Navigation */}
        {activeExamMode === 'contrast' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Contrast Step</span>
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => sendAction('PREV_CONTRAST')}
                className="flex items-center justify-center gap-2 py-4 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                <ChevronUp className="w-6 h-6" /> Higher Contrast
              </button>
              <button
                onClick={() => sendAction('NEXT_CONTRAST')}
                className="flex items-center justify-center gap-2 py-4 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                <ChevronDown className="w-6 h-6" /> Lower Contrast
              </button>
            </div>
          </div>
        )}

        {/* Astigmatism Navigation */}
        {activeExamMode === 'astigmatism' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Astigmatism Mode</span>
            <button
              onClick={() => sendAction('TOGGLE_ASTIGMATISM_MODE')}
              className="w-full py-4 bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all"
            >
              Toggle Clock Dial / Dot Matrix
            </button>
          </div>
        )}

        {/* Amsler Grid Navigation */}
        {activeExamMode === 'amsler' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Amsler Grid Color</span>
            <button
              onClick={() => sendAction('TOGGLE_AMSLER_RED')}
              className="w-full py-4 bg-red-600 active:bg-red-700 text-white font-bold rounded-xl active:scale-95 transition-all"
            >
              Toggle Red / White Grid
            </button>
          </div>
        )}

        {/* Chart Options Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold text-center">Chart Options</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => sendAction('RANDOMIZE')}
              className="flex flex-col items-center justify-center p-3 bg-slate-800 active:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 text-slate-200 gap-1 active:scale-95"
            >
              <Shuffle className="w-5 h-5 text-indigo-400" /> Randomize
            </button>
            <button
              onClick={() => sendAction('TOGGLE_DUOCHROME')}
              className="flex flex-col items-center justify-center p-3 bg-slate-800 active:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 text-slate-200 gap-1 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-red-400" /> Duochrome
            </button>
            <button
              onClick={() => sendAction('CHANGE_TYPE')}
              className="flex flex-col items-center justify-center p-3 bg-slate-800 active:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 text-slate-200 gap-1 active:scale-95"
            >
              <LayoutGrid className="w-5 h-5 text-emerald-400" /> Optotype
            </button>
          </div>
        </div>

        {/* Score Logging */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-3 text-xs">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Score Log</span>
            <div className="flex gap-3 font-mono font-bold">
              <span className="text-green-400">Correct: {correctCount}</span>
              <span className="text-red-400">Incorrect: {incorrectCount}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => handleRecord(true)}
              className="flex items-center justify-center gap-2 py-3.5 bg-emerald-600/20 active:bg-emerald-600/40 text-emerald-400 border border-emerald-500/40 font-bold rounded-xl active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" /> Correct (+1)
            </button>
            <button
              onClick={() => handleRecord(false)}
              className="flex items-center justify-center gap-2 py-3.5 bg-rose-600/20 active:bg-rose-600/40 text-rose-400 border border-rose-500/40 font-bold rounded-xl active:scale-95 transition-all"
            >
              <XCircle className="w-5 h-5" /> Incorrect
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
