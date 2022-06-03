import sumDurationParts from './sumDurationParts';

describe('lib/math/time', () => {
  describe('sumDurationParts', () => {
    test('should handle falsy input.', () => {
      const result1 = sumDurationParts(null);

      expect(result1.length).toBe(3);
      expect(result1).toStrictEqual([0, 0, 0]);
    });

    test('should sum seconds.', () => {
      const result1 = sumDurationParts([[10], [10], [10]]);

      expect(result1.length).toBe(3);
      expect(result1).toStrictEqual([30, 0, 0]);
    });

    test('should sum seconds to minutes.', () => {
      const result1 = sumDurationParts([[20], [20], [20]]);

      expect(result1.length).toBe(3);
      expect(result1).toStrictEqual([0, 1, 0]);
    });

    test('should sum minutes to hours.', () => {
      const result1 = sumDurationParts([
        [0, 20],
        [0, 20],
        [0, 20]
      ]);

      expect(result1.length).toBe(3);
      expect(result1).toStrictEqual([0, 0, 1]);
    });
  });
});
