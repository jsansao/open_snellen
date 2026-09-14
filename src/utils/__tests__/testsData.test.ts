import { describe, it, expect } from 'vitest';
import {
  PELLI_ROBSON_CONTRAST_STEPS,
  PELLI_ROBSON_TRIPLETS,
  ISHIHARA_PLATES,
  LEA_SYMBOLS,
  HOTV_LETTERS,
  ETDRS_LINES,
} from '../testsData';

describe('Vision Examination Datasets', () => {
  it('has 16 Pelli-Robson contrast steps ending at 0.5%', () => {
    expect(PELLI_ROBSON_CONTRAST_STEPS).toHaveLength(16);
    expect(PELLI_ROBSON_CONTRAST_STEPS[0].percent).toBe(100.0);
    expect(PELLI_ROBSON_CONTRAST_STEPS[15].percent).toBe(0.5);
  });

  it('has corresponding letter triplets for all contrast steps', () => {
    expect(PELLI_ROBSON_TRIPLETS).toHaveLength(16);
    PELLI_ROBSON_TRIPLETS.forEach((triplet) => {
      expect(triplet).toHaveLength(3);
    });
  });

  it('contains valid Ishihara pseudoisochromatic plates', () => {
    expect(ISHIHARA_PLATES.length).toBeGreaterThanOrEqual(8);
    expect(ISHIHARA_PLATES[0].numberText).toBe('12'); // Demonstration plate
  });

  it('contains pediatric LEA symbols and HOTV letters', () => {
    expect(LEA_SYMBOLS).toEqual(['apple', 'house', 'square', 'circle']);
    expect(HOTV_LETTERS).toEqual(['H', 'O', 'T', 'V']);
  });

  it('has 14 ETDRS lines with 5 optotypes each', () => {
    expect(ETDRS_LINES).toHaveLength(14);
    ETDRS_LINES.forEach((line) => {
      expect(line.optotypes).toHaveLength(5);
    });
  });
});
