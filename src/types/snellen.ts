export type ExamMode = 'acuity' | 'astigmatism' | 'contrast' | 'ishihara' | 'amsler' | 'worth4dot' | 'etdrs';

export type OptotypeType = 'sloan' | 'snellen' | 'tumbling-e' | 'landolt-c' | 'lea' | 'hotv' | 'numbers' | 'etdrs';

export type DisplayMode = 'full' | 'line' | 'single';

export type DistanceUnit = 'meters' | 'feet';

export interface VisualAcuityLine {
  id: string;
  snellenFeet: string; // e.g., "20/200", "20/20"
  snellenMeters: string; // e.g., "6/60", "6/6"
  logMar: number; // e.g., 1.0, 0.0
  decimal: number; // e.g., 0.1, 1.0
  optotypes: string[]; // Character set or direction angles: "0", "90", "180", "270"
}

export interface CalibrationData {
  pixelsPerMm: number; // calculated screen resolution density
  cardWidthPx: number; // card width in UI pixels during calibration
  isCalibrated: boolean;
}

export interface ChartSettings {
  examMode: ExamMode;
  optotypeType: OptotypeType;
  displayMode: DisplayMode;
  distanceValue: number; // e.g. 3 or 6 or 20
  distanceUnit: DistanceUnit; // 'meters' | 'feet'
  currentLineIndex: number;
  currentOptotypeIndex: number;
  duochrome: boolean; // Red-Green split background
  crowdingBars: boolean; // Isolation / crowding bars around line
  randomize: boolean;
  inverted: boolean; // White on black vs black on white
  // Additional test parameters
  ishiharaPlateIndex: number;
  amslerRedGrid: boolean;
  astigmatismMode: 'clock' | 'dots';
  contrastIndex: number; // Index in Pelli-Robson contrast steps array
}

export interface RemoteControlMessage {
  type: 'SYNC_STATE' | 'ACTION';
  action?: 
    | 'NEXT_LINE' | 'PREV_LINE' | 'NEXT_OPTOTYPE' | 'PREV_OPTOTYPE' 
    | 'RANDOMIZE' | 'TOGGLE_DUOCHROME' | 'CHANGE_TYPE' | 'RECORD_RESULT'
    | 'SET_EXAM_MODE' | 'NEXT_ISHIHARA' | 'PREV_ISHIHARA' | 'TOGGLE_AMSLER_RED'
    | 'TOGGLE_ASTIGMATISM_MODE' | 'NEXT_CONTRAST' | 'PREV_CONTRAST';
  payload?: any;
}
