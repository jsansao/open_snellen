import { OptotypeType, VisualAcuityLine } from '../types/snellen';
import { LEA_SYMBOLS, HOTV_LETTERS } from './testsData';

export const SLOAN_LETTERS = ['C', 'D', 'E', 'F', 'L', 'N', 'O', 'P', 'Z', 'V'];
export const SNELLEN_LETTERS = ['E', 'F', 'P', 'T', 'O', 'Z', 'L', 'D', 'C', 'P'];
export const E_DIRECTIONS = ['0', '90', '180', '270'];
export const LANDOLT_DIRECTIONS = ['0', '45', '90', '135', '180', '225', '270', '315'];

export const DEFAULT_ACUITY_LINES: VisualAcuityLine[] = [
  { id: 'line-20-200', snellenFeet: '20/200', snellenMeters: '6/60', logMar: 1.0, decimal: 0.1, optotypes: ['E'] },
  { id: 'line-20-100', snellenFeet: '20/100', snellenMeters: '6/30', logMar: 0.7, decimal: 0.2, optotypes: ['F', 'P'] },
  { id: 'line-20-70',  snellenFeet: '20/70',  snellenMeters: '6/21', logMar: 0.54, decimal: 0.28, optotypes: ['T', 'O', 'Z'] },
  { id: 'line-20-50',  snellenFeet: '20/50',  snellenMeters: '6/15', logMar: 0.4, decimal: 0.4, optotypes: ['L', 'P', 'E', 'D'] },
  { id: 'line-20-40',  snellenFeet: '20/40',  snellenMeters: '6/12', logMar: 0.3, decimal: 0.5, optotypes: ['P', 'E', 'C', 'F', 'D'] },
  { id: 'line-20-30',  snellenFeet: '20/30',  snellenMeters: '6/9',  logMar: 0.18, decimal: 0.66, optotypes: ['E', 'D', 'F', 'C', 'Z', 'P'] },
  { id: 'line-20-25',  snellenFeet: '20/25',  snellenMeters: '6/7.5', logMar: 0.1, decimal: 0.8, optotypes: ['F', 'E', 'L', 'O', 'P', 'Z', 'D'] },
  { id: 'line-20-20',  snellenFeet: '20/20',  snellenMeters: '6/6',  logMar: 0.0, decimal: 1.0, optotypes: ['D', 'E', 'F', 'P', 'O', 'T', 'E'] },
  { id: 'line-20-15',  snellenFeet: '20/15',  snellenMeters: '6/4.5', logMar: -0.12, decimal: 1.33, optotypes: ['L', 'E', 'F', 'O', 'D', 'P', 'C', 'T'] },
  { id: 'line-20-10',  snellenFeet: '20/10',  snellenMeters: '6/3',  logMar: -0.3, decimal: 2.0, optotypes: ['F', 'D', 'P', 'L', 'T', 'C', 'E', 'O'] },
];

/**
 * Returns randomized set of optotypes for a given type and count.
 */
export function generateRandomOptotypes(type: OptotypeType, count: number): string[] {
  let pool: string[];
  switch (type) {
    case 'sloan':
      pool = SLOAN_LETTERS;
      break;
    case 'snellen':
      pool = SNELLEN_LETTERS;
      break;
    case 'tumbling-e':
      pool = E_DIRECTIONS;
      break;
    case 'landolt-c':
      pool = ['0', '90', '180', '270'];
      break;
    case 'lea':
      pool = LEA_SYMBOLS;
      break;
    case 'hotv':
      pool = HOTV_LETTERS;
      break;
    default:
      pool = SLOAN_LETTERS;
  }

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result.push(pool[randomIndex]);
  }
  return result;
}

/**
 * Ensures line optotypes match selected optotype type (converts letters vs angles vs pediatric symbols)
 */
export function getLineOptotypes(line: VisualAcuityLine, type: OptotypeType, isRandom: boolean): string[] {
  const count = Math.min(Math.max(line.optotypes.length, 1), 8);
  if (isRandom) {
    return generateRandomOptotypes(type, count);
  }

  if (type === 'tumbling-e' || type === 'landolt-c') {
    const pool = type === 'tumbling-e' ? E_DIRECTIONS : ['0', '90', '180', '270'];
    return Array.from({ length: count }, (_, idx) => pool[(idx * 3) % pool.length]);
  }

  if (type === 'sloan') {
    return Array.from({ length: count }, (_, idx) => SLOAN_LETTERS[(idx + line.optotypes.length) % SLOAN_LETTERS.length]);
  }

  if (type === 'snellen') {
    return Array.from({ length: count }, (_, idx) => SNELLEN_LETTERS[(idx + line.optotypes.length) % SNELLEN_LETTERS.length]);
  }

  if (type === 'lea') {
    return Array.from({ length: count }, (_, idx) => LEA_SYMBOLS[(idx + line.optotypes.length) % LEA_SYMBOLS.length]);
  }

  if (type === 'hotv') {
    return Array.from({ length: count }, (_, idx) => HOTV_LETTERS[(idx + line.optotypes.length) % HOTV_LETTERS.length]);
  }

  return line.optotypes;
}
