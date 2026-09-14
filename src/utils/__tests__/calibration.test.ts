import { describe, it, expect } from 'vitest';
import {
  calculateOptotypeHeightMm,
  calculateOptotypeHeightPx,
  calculatePpmFromCardWidth,
} from '../calibration';
import { generateRandomOptotypes, getLineOptotypes, DEFAULT_ACUITY_LINES } from '../optotypes';
import { LEA_SYMBOLS } from '../testsData';

describe('Calibration & Optical Math Utilities', () => {
  it('calculates exact 20/20 optotype physical size at 6 meters', () => {
    // Standard 20/20 at 6m is approx 8.727 mm (5 arcminutes)
    const heightMm = calculateOptotypeHeightMm(6, 'meters', 0.0);
    expect(heightMm).toBeCloseTo(8.7266, 3);
  });

  it('calculates 20/200 optotype to be 10x larger than 20/20', () => {
    const height2020 = calculateOptotypeHeightMm(6, 'meters', 0.0);
    const height20200 = calculateOptotypeHeightMm(6, 'meters', 1.0);
    expect(height20200 / height2020).toBeCloseTo(10.0, 4);
  });

  it('calculates 20/20 size at 20 feet accurately', () => {
    // 20 feet = 6096 mm. 5 arcminutes height ≈ 8.87 mm
    const heightMm = calculateOptotypeHeightMm(20, 'feet', 0.0);
    expect(heightMm).toBeCloseTo(8.866, 2);
  });

  it('calculates PPM from credit card calibration', () => {
    const cardPx = 342.4; // e.g. 342.4 px for 85.6 mm
    const ppm = calculatePpmFromCardWidth(cardPx);
    expect(ppm).toBeCloseTo(4.0, 3);
  });

  it('converts mm to pixels correctly', () => {
    const heightPx = calculateOptotypeHeightPx(6, 'meters', 0.0, 4.0);
    expect(heightPx).toBeCloseTo(8.7266 * 4.0, 2);
  });

  it('generates random optotypes for given type', () => {
    const optotypes = generateRandomOptotypes('sloan', 5);
    expect(optotypes).toHaveLength(5);
  });

  it('correctly maps LEA pediatric optotypes', () => {
    const leaLine = getLineOptotypes(DEFAULT_ACUITY_LINES[1], 'lea', false);
    expect(leaLine).toEqual(['square', 'circle']);
    leaLine.forEach((symbol) => {
      expect(LEA_SYMBOLS).toContain(symbol);
    });
  });

  it('has 10 visual acuity lines defined from 20/200 to 20/10', () => {
    expect(DEFAULT_ACUITY_LINES).toHaveLength(10);
    expect(DEFAULT_ACUITY_LINES[0].snellenFeet).toBe('20/200');
    expect(DEFAULT_ACUITY_LINES[7].snellenFeet).toBe('20/20');
  });
});
