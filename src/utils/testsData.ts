import { VisualAcuityLine } from '../types/snellen';

// Pelli-Robson contrast steps in percentage (Log Contrast Sensitivity from 0.0 to 2.25)
export const PELLI_ROBSON_CONTRAST_STEPS = [
  { percent: 100.0, logCs: 0.00 },
  { percent: 70.8,  logCs: 0.15 },
  { percent: 50.1,  logCs: 0.30 },
  { percent: 35.5,  logCs: 0.45 },
  { percent: 25.1,  logCs: 0.60 },
  { percent: 17.8,  logCs: 0.75 },
  { percent: 12.6,  logCs: 0.90 },
  { percent: 8.9,   logCs: 1.05 },
  { percent: 6.3,   logCs: 1.20 },
  { percent: 4.5,   logCs: 1.35 },
  { percent: 3.2,   logCs: 1.50 },
  { percent: 2.2,   logCs: 1.65 },
  { percent: 1.6,   logCs: 1.80 },
  { percent: 1.1,   logCs: 1.95 },
  { percent: 0.8,   logCs: 2.10 },
  { percent: 0.5,   logCs: 2.25 },
];

export const PELLI_ROBSON_TRIPLETS = [
  ['V', 'R', 'S'],
  ['K', 'D', 'N'],
  ['C', 'Z', 'O'],
  ['H', 'S', 'R'],
  ['K', 'Z', 'V'],
  ['D', 'C', 'N'],
  ['O', 'V', 'S'],
  ['R', 'H', 'Z'],
  ['N', 'C', 'K'],
  ['S', 'D', 'O'],
  ['V', 'H', 'Z'],
  ['R', 'C', 'N'],
  ['K', 'S', 'O'],
  ['Z', 'D', 'V'],
  ['H', 'N', 'C'],
  ['R', 'Z', 'S'],
];

export interface IshiharaPlate {
  id: number;
  numberText: string;
  normalVisionResponse: string;
  redGreenDeficientResponse: string;
  description: string;
  palette: {
    bgColors: string[];
    numColors: string[];
  };
}

export const ISHIHARA_PLATES: IshiharaPlate[] = [
  {
    id: 1,
    numberText: '12',
    normalVisionResponse: '12',
    redGreenDeficientResponse: '12',
    description: 'Demonstration plate - visible to all subjects including total color blindness.',
    palette: {
      bgColors: ['#5a7356', '#485e44', '#789474', '#8aa885'],
      numColors: ['#d96643', '#e87856', '#c45331', '#f08a69'],
    },
  },
  {
    id: 2,
    numberText: '8',
    normalVisionResponse: '8',
    redGreenDeficientResponse: '3',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#b37356', '#9c5e42', '#cb886b', '#88492e'],
      numColors: ['#5a8c56', '#487545', '#73a86f', '#365e34'],
    },
  },
  {
    id: 3,
    numberText: '6',
    normalVisionResponse: '6',
    redGreenDeficientResponse: '5',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#c46d52', '#a6543b', '#db8469', '#8f3e27'],
      numColors: ['#4b8054', '#38663f', '#649e6f', '#2a4d2f'],
    },
  },
  {
    id: 4,
    numberText: '29',
    normalVisionResponse: '29',
    redGreenDeficientResponse: '70',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#aa6955', '#915340', '#c27e69', '#783e2c'],
      numColors: ['#50875b', '#3d6e46', '#69a175', '#2a5231'],
    },
  },
  {
    id: 5,
    numberText: '57',
    normalVisionResponse: '57',
    redGreenDeficientResponse: '35',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#4d7857', '#3c6144', '#669471', '#2f4c34'],
      numColors: ['#cc6e4e', '#b35637', '#e08362', '#993f22'],
    },
  },
  {
    id: 6,
    numberText: '5',
    normalVisionResponse: '5',
    redGreenDeficientResponse: '2',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#ba6e54', '#9e543b', '#d4856b', '#823c25'],
      numColors: ['#548b5c', '#407047', '#6ea677', '#2e5434'],
    },
  },
  {
    id: 7,
    numberText: '3',
    normalVisionResponse: '3',
    redGreenDeficientResponse: '5',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#527d5a', '#3e6344', '#6d9976', '#2d4a32'],
      numColors: ['#d16a49', '#b85333', '#e6815f', '#9e3b1c'],
    },
  },
  {
    id: 8,
    numberText: '74',
    normalVisionResponse: '74',
    redGreenDeficientResponse: '21',
    description: 'Red-green color deficiency test plate.',
    palette: {
      bgColors: ['#ad654c', '#914f37', '#c77d63', '#753923'],
      numColors: ['#4b8254', '#37663e', '#669e70', '#274f2d'],
    },
  },
];

export const LEA_SYMBOLS = ['apple', 'house', 'square', 'circle'];
export const HOTV_LETTERS = ['H', 'O', 'T', 'V'];

export const ETDRS_LINES: VisualAcuityLine[] = [
  { id: 'etdrs-1.0',  snellenFeet: '20/200', snellenMeters: '6/60', logMar: 1.0,  decimal: 0.1,  optotypes: ['N', 'C', 'K', 'Z', 'O'] },
  { id: 'etdrs-0.9',  snellenFeet: '20/160', snellenMeters: '6/48', logMar: 0.9,  decimal: 0.125,optotypes: ['R', 'H', 'S', 'D', 'K'] },
  { id: 'etdrs-0.8',  snellenFeet: '20/125', snellenMeters: '6/38', logMar: 0.8,  decimal: 0.16, optotypes: ['D', 'O', 'V', 'H', 'R'] },
  { id: 'etdrs-0.7',  snellenFeet: '20/100', snellenMeters: '6/30', logMar: 0.7,  decimal: 0.2,  optotypes: ['C', 'Z', 'R', 'H', 'S'] },
  { id: 'etdrs-0.6',  snellenFeet: '20/80',  snellenMeters: '6/24', logMar: 0.6,  decimal: 0.25, optotypes: ['O', 'N', 'H', 'R', 'C'] },
  { id: 'etdrs-0.5',  snellenFeet: '20/63',  snellenMeters: '6/19', logMar: 0.5,  decimal: 0.32, optotypes: ['D', 'K', 'S', 'N', 'V'] },
  { id: 'etdrs-0.4',  snellenFeet: '20/50',  snellenMeters: '6/15', logMar: 0.4,  decimal: 0.4,  optotypes: ['Z', 'S', 'O', 'K', 'N'] },
  { id: 'etdrs-0.3',  snellenFeet: '20/40',  snellenMeters: '6/12', logMar: 0.3,  decimal: 0.5,  optotypes: ['C', 'K', 'D', 'N', 'R'] },
  { id: 'etdrs-0.2',  snellenFeet: '20/32',  snellenMeters: '6/9.5',logMar: 0.2,  decimal: 0.63, optotypes: ['S', 'R', 'Z', 'K', 'D'] },
  { id: 'etdrs-0.1',  snellenFeet: '20/25',  snellenMeters: '6/7.5',logMar: 0.1,  decimal: 0.8,  optotypes: ['H', 'Z', 'O', 'V', 'C'] },
  { id: 'etdrs-0.0',  snellenFeet: '20/20',  snellenMeters: '6/6',  logMar: 0.0,  decimal: 1.0,  optotypes: ['N', 'R', 'D', 'S', 'R'] },
  { id: 'etdrs--0.1', snellenFeet: '20/16',  snellenMeters: '6/4.8',logMar: -0.1, decimal: 1.25, optotypes: ['V', 'Z', 'B', 'R', 'H'] },
  { id: 'etdrs--0.2', snellenFeet: '20/12.5',snellenMeters: '6/3.8',logMar: -0.2, decimal: 1.6,  optotypes: ['K', 'D', 'N', 'R', 'O'] },
  { id: 'etdrs--0.3', snellenFeet: '20/10',  snellenMeters: '6/3',  logMar: -0.3, decimal: 2.0,  optotypes: ['Z', 'K', 'C', 'S', 'D'] },
];
