import parseAccentColorParam from './parseAccentColorParam';

describe('lib/parse/config', () => {
  describe('parseAccentColorParam', () => {
    test('should convert single value to array', () => {
      const result = parseAccentColorParam('ff0000');

      expect(result).toBeInstanceOf(Array);
    });

    test('should prefix colors with `#`', () => {
      const result = parseAccentColorParam('ff0000');

      expect(result[0]).toBe('#ff0000');
    });

    test('should allow valid CSS hex colors, with optional gradient position percentage', () => {
      const result = parseAccentColorParam(['ff0000', '7ab3f8e9 80%', '00f']);

      expect(result.length).toBe(3);
      expect(result).toStrictEqual(['#ff0000', '#7ab3f8e9 80%', '#00f']);
    });

    test('should filter out bad color input', () => {
      const result = parseAccentColorParam(['INVALID_COLOR', 'ff0000']);

      expect(result).toStrictEqual(['#ff0000']);
    });

    test('should return null when all input is invalid', () => {
      const result = parseAccentColorParam('INVALID_COLOR');

      expect(result).toBeNull();
    });
  });
});
