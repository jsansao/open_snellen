import { useEffect } from 'react';
import { ChartSettings } from '../types/snellen';

interface UseHotkeysOptions {
  settings: ChartSettings;
  onUpdateSettings: (newSettings: Partial<ChartSettings>) => void;
  onOpenCalibration: () => void;
  onToggleFullscreen: () => void;
  totalLines: number;
}

export function useHotkeys({
  settings,
  onUpdateSettings,
  onOpenCalibration,
  onToggleFullscreen,
  totalLines,
}: UseHotkeysOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onUpdateSettings({
            currentLineIndex: Math.max(0, settings.currentLineIndex - 1),
            currentOptotypeIndex: 0,
          });
          break;

        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          onUpdateSettings({
            currentLineIndex: Math.min(totalLines - 1, settings.currentLineIndex + 1),
            currentOptotypeIndex: 0,
          });
          break;

        case 'ArrowLeft':
          e.preventDefault();
          onUpdateSettings({
            currentOptotypeIndex: Math.max(0, settings.currentOptotypeIndex - 1),
          });
          break;

        case 'ArrowRight':
        case 'PageUp':
        case ' ': // Spacebar
          e.preventDefault();
          onUpdateSettings({
            currentOptotypeIndex: settings.currentOptotypeIndex + 1,
          });
          break;

        case 'r':
        case 'R':
          e.preventDefault();
          onUpdateSettings({ randomize: !settings.randomize });
          break;

        case 'd':
        case 'D':
          e.preventDefault();
          onUpdateSettings({ duochrome: !settings.duochrome });
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          onUpdateSettings({ crowdingBars: !settings.crowdingBars });
          break;

        case 'c':
        case 'C':
          e.preventDefault();
          onOpenCalibration();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          onToggleFullscreen();
          break;

        case '1':
          onUpdateSettings({ displayMode: 'full' });
          break;
        case '2':
          onUpdateSettings({ displayMode: 'line' });
          break;
        case '3':
          onUpdateSettings({ displayMode: 'single' });
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, onUpdateSettings, onOpenCalibration, onToggleFullscreen, totalLines]);
}
