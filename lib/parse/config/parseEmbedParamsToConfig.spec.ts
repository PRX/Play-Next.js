import parseEmbedParamsToConfig from './parseEmbedParamsToConfig';

describe('lib/parse/config', () => {
  describe('parseEmbedParamsToConfig', () => {
    const params = {
      tt: 'TT',
      ts: 'TS',
      tc: 'TC',
      ua: 'UA',
      ui: 'UI',
      ue: 'UE',
      uf: 'UF',
      if: 'IF',
      ge: 'GE',
      uc: 'UC',
      us: 'US',
      gs: 'GS',
      gc: 'GC',
      sp: '42',
      se: '2',
      ct: 'CT',
      ca: '1',
      ac: 'ff0000'
    };

    test('should handle expected parameters', () => {
      const result = parseEmbedParamsToConfig(params);

      expect(result.title).toBe('TT');
      expect(result.subtitle).toBe('TS');
      expect(result.ctaTitle).toBe('TC');
      expect(result.audioUrl).toBe('UA');
      expect(result.imageUrl).toBe('UI');
      expect(result.epImageUrl).toBe('UE');
      expect(result.feedUrl).toBe('UF');
      expect(result.feedId).toBe('IF');
      expect(result.episodeGuid).toBe('GE');
      expect(result.ctaUrl).toBe('UC');
      expect(result.subscribeUrl).toBe('US');
      expect(result.subscribeTarget).toBe('GS');
      expect(result.ctaTarget).toBe('GC');
      expect(result.showPlaylist).toBe(42);
      expect(result.playlistSeason).toBe(2);
      expect(result.playlistCategory).toBe('CT');
      expect(result.showCoverArt).toBe(true);
      expect(result.accentColor).toStrictEqual(['#ff0000']);
    });

    test('should process `showPlaylist` into integer', () => {
      const resultNumeric = parseEmbedParamsToConfig({ sp: '25' });
      const resultEmpty = parseEmbedParamsToConfig({ sp: '' });

      expect(resultNumeric.showPlaylist).toBe(25);
      expect(resultEmpty.showPlaylist).toBe(0);
    });

    test('should process `playlistSeason` into integer', () => {
      const resultNumeric = parseEmbedParamsToConfig({ se: '5' });
      const resultEmpty = parseEmbedParamsToConfig({ se: '' });

      expect(resultNumeric.playlistSeason).toBe(5);
      expect(resultEmpty.playlistSeason).toBe(0);
    });

    test('should process `playlistSeason` into "all"', () => {
      const result = parseEmbedParamsToConfig({ sp: 'all' });

      expect(result.showPlaylist).toBe('all');
    });

    test('should process `accentColor` into array of sanitized hex values', () => {
      const result = parseEmbedParamsToConfig({
        ac: ['FF0000', '00FF00 20%', '0000FF42', 'NOT VALID']
      });

      expect(result.accentColor).toStrictEqual([
        '#FF0000',
        '#00FF00 20%',
        '#0000FF42'
      ]);
    });

    test('should handle no params', () => {
      const result = parseEmbedParamsToConfig({});

      expect(result).toEqual({});
    });

    test('should ignore unexpected params', () => {
      /* @ts-ignore */
      const result = parseEmbedParamsToConfig({ tt: 'TITLE', foo: 'bar' });

      /* @ts-ignore */
      expect(result.foo).toBeUndefined();
    });
  });
});
