import convertDurationToSeconds from './convertDurationToSeconds';

describe('lib/convert/string', () => {
  describe('convertDurationToSeconds', () => {
    test('should convert parts to integers, and reverse order.', () => {
      const result1 = convertDurationToSeconds('42');
      const result2 = convertDurationToSeconds('01:45');
      const result3 = convertDurationToSeconds('1:00:16');

      expect(result1).toBe(42);
      expect(result2).toBe(105);
      expect(result3).toBe(376);
    });

    test('should treat falsy argument as 0.', () => {
      const result1 = convertDurationToSeconds(undefined);
      const result2 = convertDurationToSeconds(null);

      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });
  });
});
