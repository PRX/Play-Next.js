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

    test('should force showing hours.', () => {
      const result1 = convertSecondsToDuration(42, { forceHours: true });
      const result2 = convertSecondsToDuration(105, { forceHours: true });
      const result3 = convertSecondsToDuration(3616, { forceHours: true });
      const result4 = convertSecondsToDuration(0, { forceHours: true });

      expect(result1).toBe('00:00:42');
      expect(result2).toBe('00:01:45');
      expect(result3).toBe('1:00:16');
      expect(result4).toBe('00:00:00');
    });

    test('should show padded hours.', () => {
      const result1 = convertSecondsToDuration(42, { padHours: true });
      const result2 = convertSecondsToDuration(105, { padHours: true });
      const result3 = convertSecondsToDuration(3616, { padHours: true });

      expect(result1).toBe('00:42');
      expect(result2).toBe('01:45');
      expect(result3).toBe('01:00:16');
    });

    test('should force showing padded hours.', () => {
      const result1 = convertSecondsToDuration(42, {
        forceHours: true,
        padHours: true
      });
      const result2 = convertSecondsToDuration(105, {
        forceHours: true,
        padHours: true
      });
      const result3 = convertSecondsToDuration(3616, {
        forceHours: true,
        padHours: true
      });

      expect(result1).toBe('00:00:42');
      expect(result2).toBe('00:01:45');
      expect(result3).toBe('01:00:16');
    });

    test('should show milliseconds.', () => {
      const result1 = convertSecondsToDuration(4.02, {
        showMilliseconds: true
      });
      const result2 = convertSecondsToDuration(0, { showMilliseconds: true });

      expect(result1).toBe('00:04.02');
      expect(result2).toBe('00:00.0');
    });

    test('should show padded milliseconds.', () => {
      const result1 = convertSecondsToDuration(4.02, {
        showMilliseconds: true,
        fractionDigits: 3
      });
      const result2 = convertSecondsToDuration(0, {
        showMilliseconds: true,
        fractionDigits: 3
      });

      expect(result1).toBe('00:04.020');
      expect(result2).toBe('00:00.000');
    });

    test('should use custom fractional separator.', () => {
      const result1 = convertSecondsToDuration(4.02, {
        showMilliseconds: true,
        fractionDigits: 3
      });
      const result2 = convertSecondsToDuration(4.02, {
        showMilliseconds: true,
        fractionDigits: 3,
        fractionDelimiter: ','
      });

      expect(result1).toBe('00:04.020');
      expect(result2).toBe('00:04,020');
    });
  });
});
