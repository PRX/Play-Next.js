import convertStringToInteger from './convertStringToInteger';

describe('lib/convert/string', () => {
  describe('convertStringToInteger', () => {
    test('should parse numeric strings to integer values.', () => {
      const result1 = convertStringToInteger('45');
      const result2 = convertStringToInteger('45px');
      const result3 = convertStringToInteger('45.654321');
      const result4 = convertStringToInteger('0');

      expect(result1).toBe(45);
      expect(result2).toBe(45);
      expect(result3).toBe(45);
      expect(result4).toBe(0);
    });

    test('should convert non-numeric values to 0', () => {
      const result1 = convertStringToInteger('foo');
      const result2 = convertStringToInteger('One2Three');
      const result3 = convertStringToInteger('NaN');

      expect(result1).toBe(0);
      expect(result2).toBe(0);
      expect(result3).toBe(0);
    });
  });
});
