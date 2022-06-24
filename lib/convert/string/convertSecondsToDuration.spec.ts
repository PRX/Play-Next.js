import convertSecondsToDuration from './convertSecondsToDuration';

describe('lib/convert/string', () => {
  describe('convertSecondsToDuration', () => {
    test('should convert parts to integers, and reverse order.', () => {
      const result1 = convertSecondsToDuration(42);
      const result2 = convertSecondsToDuration(105);
      const result3 = convertSecondsToDuration(3616);

      expect(result1).toBe('00:42');
      expect(result2).toBe('01:45');
      expect(result3).toBe('1:00:16');
    });

    test('should return duration strings.', () => {
      const result = convertSecondsToDuration('12:34');

      expect(result).toBe('12:34');
    });

    test('should handle numeric string input.', () => {
      const result = convertSecondsToDuration('120');

      expect(result).toBe('02:00');
    });
  });
});
