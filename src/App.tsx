import React, { useState, useEffect, useCallback } from 'react';
import { ChartSettings, CalibrationData, RemoteControlMessage } from './types/snellen';
import { DEFAULT_ACUITY_LINES } from './utils/optotypes';
import { DEFAULT_PPM, CREDIT_CARD_WIDTH_MM } from './utils/calibration';
import { Header } from './components/Header';
import { OptotypeDisplay } from './components/OptotypeDisplay';
import { CalibrationModal } from './components/CalibrationModal';
import { RemoteModal } from './components/RemoteModal';
import { RemoteControllerView } from './components/RemoteControllerView';
import { RemotePeerManager } from './services/peerService';
import { useHotkeys } from './hooks/useHotkeys';
import { ISHIHARA_PLATES, PELLI_ROBSON_CONTRAST_STEPS } from './utils/testsData';

const SETTINGS_STORAGE_KEY = 'open_snellen_settings';
const CALIBRATION_STORAGE_KEY = 'open_snellen_calibration';

const DEFAULT_SETTINGS: ChartSettings = {
  examMode: 'acuity',
  optotypeType: 'sloan',
  displayMode: 'line',
  distanceValue: 3,
  distanceUnit: 'meters',
  currentLineIndex: 7, // 20/20 default
  currentOptotypeIndex: 0,
  duochrome: false,
  crowdingBars: false,
  randomize: false,
  inverted: false,
  ishiharaPlateIndex: 0,
  amslerRedGrid: false,
  astigmatismMode: 'clock',
  contrastIndex: 0,
};

const DEFAULT_CALIBRATION: CalibrationData = {
  pixelsPerMm: DEFAULT_PPM,
  cardWidthPx: Math.round(CREDIT_CARD_WIDTH_MM * DEFAULT_PPM),
  isCalibrated: false,
};

export const App: React.FC = () => {
  // Check if URL specifies remote controller mode (`?remote=SESSION_ID`)
  const searchParams = new URLSearchParams(window.location.search);
  const remoteParam = searchParams.get('remote');

  if (remoteParam) {
    return <RemoteControllerView remoteSessionId={remoteParam} />;
  }

  // Load state from LocalStorage
  const [settings, setSettings] = useState<ChartSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [calibration, setCalibration] = useState<CalibrationData>(() => {
    const saved = localStorage.getItem(CALIBRATION_STORAGE_KEY);
    return saved ? { ...DEFAULT_CALIBRATION, ...JSON.parse(saved) } : DEFAULT_CALIBRATION;
  });

  // Modal visibility
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isRemoteOpen, setIsRemoteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // PeerJS WebRTC Remote Host state
  const [peerManager] = useState(() => new RemotePeerManager());
  const [peerId, setPeerId] = useState<string | null>(null);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);

  // Handle incoming remote action commands from smartphone controller
  const handleRemoteMessage = useCallback((msg: RemoteControlMessage) => {
    if (msg.type === 'ACTION') {
      setIsRemoteConnected(true);
      switch (msg.action) {
        case 'SET_EXAM_MODE':
          if (msg.payload?.examMode) {
            setSettings((prev) => ({ ...prev, examMode: msg.payload.examMode }));
          }
          break;
        case 'NEXT_LINE':
          setSettings((prev) => ({
            ...prev,
            currentLineIndex: Math.min(DEFAULT_ACUITY_LINES.length - 1, prev.currentLineIndex + 1),
            currentOptotypeIndex: 0,
          }));
          break;
        case 'PREV_LINE':
          setSettings((prev) => ({
            ...prev,
            currentLineIndex: Math.max(0, prev.currentLineIndex - 1),
            currentOptotypeIndex: 0,
          }));
          break;
        case 'NEXT_OPTOTYPE':
          setSettings((prev) => ({
            ...prev,
            currentOptotypeIndex: prev.currentOptotypeIndex + 1,
          }));
          break;
        case 'PREV_OPTOTYPE':
          setSettings((prev) => ({
            ...prev,
            currentOptotypeIndex: Math.max(0, prev.currentOptotypeIndex - 1),
          }));
          break;
        case 'RANDOMIZE':
          setSettings((prev) => ({ ...prev, randomize: !prev.randomize }));
          break;
        case 'TOGGLE_DUOCHROME':
          setSettings((prev) => ({ ...prev, duochrome: !prev.duochrome }));
          break;
        case 'CHANGE_TYPE':
          setSettings((prev) => {
            const types: ChartSettings['optotypeType'][] = ['sloan', 'snellen', 'tumbling-e', 'landolt-c', 'lea', 'hotv'];
            const nextIdx = (types.indexOf(prev.optotypeType) + 1) % types.length;
            return { ...prev, optotypeType: types[nextIdx] };
          });
          break;
        case 'NEXT_ISHIHARA':
          setSettings((prev) => ({
            ...prev,
            ishiharaPlateIndex: Math.min(ISHIHARA_PLATES.length - 1, prev.ishiharaPlateIndex + 1),
          }));
          break;
        case 'PREV_ISHIHARA':
          setSettings((prev) => ({
            ...prev,
            ishiharaPlateIndex: Math.max(0, prev.ishiharaPlateIndex - 1),
          }));
          break;
        case 'TOGGLE_AMSLER_RED':
          setSettings((prev) => ({ ...prev, amslerRedGrid: !prev.amslerRedGrid }));
          break;
        case 'TOGGLE_ASTIGMATISM_MODE':
          setSettings((prev) => ({
            ...prev,
            astigmatismMode: prev.astigmatismMode === 'clock' ? 'dots' : 'clock',
          }));
          break;
        case 'NEXT_CONTRAST':
          setSettings((prev) => ({
            ...prev,
            contrastIndex: Math.min(PELLI_ROBSON_CONTRAST_STEPS.length - 1, prev.contrastIndex + 1),
          }));
          break;
        case 'PREV_CONTRAST':
          setSettings((prev) => ({
            ...prev,
            contrastIndex: Math.max(0, prev.contrastIndex - 1),
          }));
          break;
        default:
          break;
      }
    }
  }, []);

  // Initialize PeerJS host
  useEffect(() => {
    peerManager.initHost(
      (id) => setPeerId(id),
      handleRemoteMessage
    );

    return () => {
      peerManager.destroy();
    };
  }, [peerManager, handleRemoteMessage]);

  // Save state to LocalStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(calibration));
  }, [calibration]);

  const updateSettings = useCallback((newSettings: Partial<ChartSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  // Bind keyboard & presenter hotkeys
  useHotkeys({
    settings,
    onUpdateSettings: updateSettings,
    onOpenCalibration: () => setIsCalibrationOpen(true),
    onToggleFullscreen: toggleFullscreen,
    totalLines: DEFAULT_ACUITY_LINES.length,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 overflow-x-hidden">
      
      {/* Header Toolbar */}
      <Header
        settings={settings}
        calibration={calibration}
        onUpdateSettings={updateSettings}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        onOpenRemote={() => setIsRemoteOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Visual Acuity Chart Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full">
        <OptotypeDisplay
          settings={settings}
          calibration={calibration}
          lines={DEFAULT_ACUITY_LINES}
          onSelectLine={(index) => updateSettings({ currentLineIndex: index, currentOptotypeIndex: 0 })}
          onUpdateSettings={updateSettings}
        />
      </main>

      {/* Footer Hotkey Guide */}
      <footer className="w-full bg-slate-900/80 border-t border-slate-800/80 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between gap-4 flex-wrap z-20 font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">↑/↓</kbd> Change Line / Contrast</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">←/→</kbd> Next/Prev</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">R</kbd> Randomize</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">D</kbd> Duochrome</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">C</kbd> Calibrate</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">F</kbd> Fullscreen</span>
        </div>
        <div>
          Exam Mode: <strong className="text-indigo-400 uppercase">{settings.examMode}</strong> | Distance: <strong className="text-indigo-400">{settings.distanceValue} {settings.distanceUnit}</strong>
        </div>
      </footer>

      {/* Calibration Modal */}
      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        calibration={calibration}
        onSaveCalibration={(newCalib) => setCalibration(newCalib)}
      />

      {/* Remote Pairing QR Modal */}
      <RemoteModal
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        peerId={peerId}
        isConnected={isRemoteConnected}
      />

    </div>
  );
};
export default App;
