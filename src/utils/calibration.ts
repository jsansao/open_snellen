import { DistanceUnit } from '../types/snellen';

export const CREDIT_CARD_WIDTH_MM = 85.6; // Standard ID-1 card width in mm
export const DEFAULT_PPM = 3.7795; // Default ~96 DPI screen (96 / 25.4)

/**
 * Calculates physical optotype height in millimeters for a given viewing distance and LogMAR value.
 * Standard 20/20 (LogMAR 0.0) optotype subtends 5 arcminutes (0.08333 degrees) at viewing distance.
 *
 * @param distance Distance value (in meters or feet)
 * @param unit Unit ('meters' | 'feet')
 * @param logMar LogMAR acuity value (0.0 = 20/20, 1.0 = 20/200)
 * @returns Physical height of optotype in millimeters
 */
export function calculateOptotypeHeightMm(
  distance: number,
  unit: DistanceUnit,
  logMar: number
): number {
  // Convert distance to millimeters
  const distanceMm = unit === 'feet' ? distance * 304.8 : distance * 1000;
  
  // 5 arcminutes in radians = (5 / 60) * (PI / 180) = 0.001454441 rad
  const fiveArcMinRad = (5 / 60) * (Math.PI / 180);
  
  // 20/20 height at distance: H_2020 = 2 * D * tan(5' / 2)
  const baseHeight2020Mm = 2 * distanceMm * Math.tan(fiveArcMinRad / 2);
  
  // Acuity factor: 10^(logMar)
  // e.g. LogMAR 1.0 (20/200) -> 10^1 = 10x size
  // LogMAR 0.0 (20/20)   -> 10^0 = 1x size
  // LogMAR -0.3 (20/10)  -> 10^-0.3 ≈ 0.5x size
  const sizeFactor = Math.pow(10, logMar);
  
  return baseHeight2020Mm * sizeFactor;
}

/**
 * Calculates optotype height in screen pixels.
 */
export function calculateOptotypeHeightPx(
  distance: number,
  unit: DistanceUnit,
  logMar: number,
  pixelsPerMm: number = DEFAULT_PPM
): number {
  const heightMm = calculateOptotypeHeightMm(distance, unit, logMar);
  return heightMm * pixelsPerMm;
}

/**
 * Calculates Pixels Per Millimeter (PPM) from card width in pixels.
 */
export function calculatePpmFromCardWidth(cardWidthPx: number): number {
  return cardWidthPx / CREDIT_CARD_WIDTH_MM;
}
