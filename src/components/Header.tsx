import React from 'react';
import {
  Eye,
  Sliders,
  Smartphone,
  Maximize2,
  Minimize2,
  Sparkles,
  Shuffle,
  Grid,
  Square,
  ListFilter,
  Sun,
  Moon,
  Ruler,
  Layers
} from 'lucide-react';
import { ChartSettings, CalibrationData, OptotypeType, DistanceUnit, ExamMode } from '../types/snellen';

interface HeaderProps {
  settings: ChartSettings;
  calibration: CalibrationData;
  onUpdateSettings: (newSettings: Partial<ChartSettings>) => void;
  onOpenCalibration: () => void;
  onOpenRemote: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  calibration,
  onUpdateSettings,
  onOpenCalibration,
  onOpenRemote,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-3 text-slate-100 flex items-center justify-between gap-4 flex-wrap select-none z-30 shadow-md">
      
      {/* Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold tracking-tight text-base sm:text-lg flex items-center gap-1.5">
            OpenSnellen <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">v1.2</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Clinical Vision Examination Suite</p>
        </div>
      </div>

      {/* Main Controls Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        
        {/* Exam Mode Selector */}
        <div className="flex items-center bg-indigo-600/15 border border-indigo-500/40 rounded-lg p-1 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-1" />
          <select
            value={settings.examMode}
            onChange={(e) => onUpdateSettings({ examMode: e.target.value as ExamMode })}
            className="bg-transparent text-indigo-300 font-bold outline-none cursor-pointer pr-2"
          >
            <option value="acuity" className="bg-slate-900 text-white">Visual Acuity Chart</option>
            <option value="astigmatism" className="bg-slate-900 text-white">Astigmatism Test</option>
            <option value="contrast" className="bg-slate-900 text-white">Contrast Sensitivity</option>
            <option value="ishihara" className="bg-slate-900 text-white">Ishihara Color Plates</option>
            <option value="amsler" className="bg-slate-900 text-white">Amsler Grid Test</option>
            <option value="worth4dot" className="bg-slate-900 text-white">Worth 4-Dot Test</option>
            <option value="etdrs" className="bg-slate-900 text-white">ETDRS Trial Chart</option>
          </select>
        </div>

        {/* Optotype Type Picker (When in Acuity mode) */}
        {settings.examMode === 'acuity' && (
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <select
              value={settings.optotypeType}
              onChange={(e) => onUpdateSettings({ optotypeType: e.target.value as OptotypeType })}
              className="bg-transparent text-slate-200 font-semibold px-2 py-1 outline-none cursor-pointer"
            >
              <option value="sloan" className="bg-slate-900 text-white">Sloan Letters</option>
              <option value="snellen" className="bg-slate-900 text-white">Snellen Letters</option>
              <option value="tumbling-e" className="bg-slate-900 text-white">Tumbling E</option>
              <option value="landolt-c" className="bg-slate-900 text-white">Landolt C</option>
              <option value="lea" className="bg-slate-900 text-white">LEA Pediatric Symbols</option>
              <option value="hotv" className="bg-slate-900 text-white">HOTV Chart</option>
              <option value="numbers" className="bg-slate-900 text-white">Numbers / Digits Chart</option>
            </select>
          </div>
        )}

        {/* Astigmatism Mode Toggle */}
        {settings.examMode === 'astigmatism' && (
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => onUpdateSettings({ astigmatismMode: 'clock' })}
              className={`px-2 py-1 rounded transition-colors ${
                settings.astigmatismMode === 'clock' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Clock Dial
            </button>
            <button
              onClick={() => onUpdateSettings({ astigmatismMode: 'dots' })}
              className={`px-2 py-1 rounded transition-colors ${
                settings.astigmatismMode === 'dots' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Dot Matrix
            </button>
          </div>
        )}

        {/* Display Mode Toggle */}
        {settings.examMode === 'acuity' && (
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              onClick={() => onUpdateSettings({ displayMode: 'full' })}
              title="Full Chart Cascade"
              className={`p-1.5 rounded-md transition-colors ${
                settings.displayMode === 'full' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ displayMode: 'line' })}
              title="Single Line Mode"
              className={`p-1.5 rounded-md transition-colors ${
                settings.displayMode === 'line' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateSettings({ displayMode: 'single' })}
              title="Single Optotype Mode"
              className={`p-1.5 rounded-md transition-colors ${
                settings.displayMode === 'single' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Distance Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1 border border-slate-700 text-xs font-medium">
          <Ruler className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="number"
            min="0.5"
            max="20"
            step="0.5"
            value={settings.distanceValue}
            onChange={(e) => onUpdateSettings({ distanceValue: Math.max(0.5, Number(e.target.value)) })}
            className="w-12 bg-transparent text-center text-white font-bold outline-none border-b border-slate-600 focus:border-indigo-400"
          />
          <select
            value={settings.distanceUnit}
            onChange={(e) => onUpdateSettings({ distanceUnit: e.target.value as DistanceUnit })}
            className="bg-transparent text-slate-300 outline-none cursor-pointer font-bold"
          >
            <option value="meters" className="bg-slate-900 text-white">m</option>
            <option value="feet" className="bg-slate-900 text-white">ft</option>
          </select>
        </div>

        {/* Randomize Button */}
        {settings.examMode === 'acuity' && (
          <button
            onClick={() => onUpdateSettings({ randomize: !settings.randomize })}
            title="Randomize Chart"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              settings.randomize
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Random</span>
          </button>
        )}

        {/* Duochrome Toggle */}
        {settings.examMode === 'acuity' && (
          <button
            onClick={() => onUpdateSettings({ duochrome: !settings.duochrome })}
            title="Toggle Red-Green Duochrome Filter"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              settings.duochrome
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Duochrome</span>
          </button>
        )}

        {/* Color Inversion (White/Black) */}
        <button
          onClick={() => onUpdateSettings({ inverted: !settings.inverted })}
          title="Toggle Contrast Inversion"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
        >
          {settings.inverted ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Screen Calibration Trigger */}
        <button
          onClick={onOpenCalibration}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            calibration.isCalibrated
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{calibration.isCalibrated ? 'Calibrated' : 'Calibrate Screen'}</span>
        </button>

        {/* Remote Pairing QR Trigger */}
        <button
          onClick={onOpenRemote}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Phone Remote</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

      </div>
    </header>
  );
};
