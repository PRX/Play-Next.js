import generateHtmlString from './generateHtmlString';

describe('lib/generate/html', () => {
  describe('generateHtmlString', () => {
    test('should start and end with a <p> tag', () => {
      const result = generateHtmlString('foo');
      expect(result).toBe('<p>foo</p>');
    });

    test('should wrap lines with <p> tags', () => {
      const result = generateHtmlString('foo\n<p>bar</p>');
      expect(result).toBe('<p>foo</p><p>bar</p>');
    });

    test('should preserve existing html', () => {
      const result = generateHtmlString('<div>foo</div>');
      expect(result).toBe('<div>foo</div>');
    });
    test('should handle non-string input', () => {
      const result = generateHtmlString(undefined);
      const result2 = generateHtmlString(null);
      expect(result).toBeUndefined();
      expect(result2).toBeNull();
    });
  });
});
