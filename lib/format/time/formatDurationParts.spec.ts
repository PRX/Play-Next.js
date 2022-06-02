import formatDurationParts from './formatDurationParts';

describe('lib/format/time', () => {
  describe('formatDurationParts', () => {
    test('should format to `HHhr`.', () => {
      const result = formatDurationParts([0, 0, 3]);

      expect(result).toBe('3hr');
    });

    test('should format to `HHhr MMmin`.', () => {
      const result = formatDurationParts([0, 25, 3]);

      expect(result).toBe('3hr 25min');
    });

    test('should format to `HHhr MMmin`, rounding up minutes.', () => {
      const result = formatDurationParts([45, 25, 3]);

      expect(result).toBe('3hr 26min');
    });

    test('should format to `MMmin`.', () => {
      const result = formatDurationParts([0, 25, 0]);

      expect(result).toBe('25min');
    });

    test('should format to `MMmin SSsec`.', () => {
      const result = formatDurationParts([42, 25, 0]);

      expect(result).toBe('25min 42sec');
    });

    test('should format to `SSsec`.', () => {
      const result = formatDurationParts([42, 0, 0]);

      expect(result).toBe('42sec');
    });
  });
});
