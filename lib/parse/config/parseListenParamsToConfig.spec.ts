import { IEmbedParams } from '@interfaces/config';
import parseListenParamsToConfig from './parseListenParamsToConfig';

describe('lib/parse/config', () => {
  describe('parseListenParamsToConfig', () => {
    const params: IEmbedParams = {
      uf: ['UF', 'UF2'],
      ge: 'GE',
      us: 'US',
      sp: '42',
      se: '2',
      ct: 'CT',
      ac: 'ff0000'
    };

    test('should handle expected parameters', () => {
      const result = parseListenParamsToConfig(params);

      expect(result.feedUrl).toBe('UF');
      expect(result.episodeGuid).toBe('GE');
      expect(result.subscribeUrl).toBe('US');
      expect(result.showPlaylist).toBe(42);
      expect(result.playlistSeason).toBe(2);
      expect(result.playlistCategory).toBe('CT');
      expect(result.accentColor).toStrictEqual(['#ff0000']);
    });

    test('should process `showPlaylist` into integer', () => {
      const resultNumeric = parseListenParamsToConfig({ sp: '25' });
      const resultEmpty = parseListenParamsToConfig({ sp: '' });

      expect(resultNumeric.showPlaylist).toBe(25);
      expect(resultEmpty.showPlaylist).toBe(0);
    });

    test('should process `playlistSeason` into integer', () => {
      const resultNumeric = parseListenParamsToConfig({ se: '5' });
      const resultEmpty = parseListenParamsToConfig({ se: '' });

      expect(resultNumeric.playlistSeason).toBe(5);
      expect(resultEmpty.playlistSeason).toBe(0);
    });

    test('should process `playlistSeason` into "all"', () => {
      const result = parseListenParamsToConfig({ sp: 'all' });

      expect(result.showPlaylist).toBe('all');
    });

    test('should process `accentColor` into array of sanitized hex values', () => {
      const result = parseListenParamsToConfig({
        ac: ['FF0000', '00FF00 20%', '0000FF42', 'NOT VALID']
      });

      expect(result.accentColor).toStrictEqual([
        '#FF0000',
        '#00FF00 20%',
        '#0000FF42'
      ]);
    });

    test('should handle no params', () => {
      const result = parseListenParamsToConfig({});

      expect(result).toEqual({});
    });

    test('should ignore unexpected params', () => {
      /* @ts-ignore */
      const result = parseListenParamsToConfig({ foo: 'bar' });

      /* @ts-ignore */
      expect(result.foo).toBeUndefined();
    });
  });
});
