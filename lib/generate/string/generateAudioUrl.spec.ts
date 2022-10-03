import generateAudioUrl from './generateAudioUrl';

describe('lib/generate/string', () => {
  describe('generateAudioUrl', () => {
    test('should append `_from` param.', () => {
      const result = generateAudioUrl('http://foo.com/bar.mp3');

      expect(result).toMatch('http://foo.com/bar.mp3?_from=play.prx.org');
    });

    test('should preserve `_from` param.', () => {
      const result = generateAudioUrl(
        'http://foo.com/bar.mp3?_from=AcmePlayer'
      );

      expect(result).toMatch('http://foo.com/bar.mp3?_from=AcmePlayer');
    });

    test('should add `https` protocol when one is not present.', () => {
      const result = generateAudioUrl('//foo.com/bar.mp3');

      expect(result).toMatch('https://foo.com/bar.mp3?_from=play.prx.org');
    });
  });
});
