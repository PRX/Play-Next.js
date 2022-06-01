import parseEmbedParams from './parseEmbedParams';

describe('lib/parse/config', () => {
  describe('parseEmbedParams', () => {
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
      const result = parseEmbedParams(params);

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
      expect(result.accentColor).toBe('ff0000');
    });

    test('should process `showPlaylist` into integer', () => {
      const resultNumeric = parseEmbedParams({ sp: '25' });
      const resultEmpty = parseEmbedParams({ sp: '' });

      expect(resultNumeric.showPlaylist).toBe(25);
      expect(resultEmpty.showPlaylist).toBe(0);
    });

    test('should process `playlistSeason` into integer', () => {
      const resultNumeric = parseEmbedParams({ se: '5' });
      const resultEmpty = parseEmbedParams({ se: '' });

      expect(resultNumeric.playlistSeason).toBe(5);
      expect(resultEmpty.playlistSeason).toBe(0);
    });

    test('should process `playlistSeason` into "all"', () => {
      const result = parseEmbedParams({ sp: 'all' });

      expect(result.showPlaylist).toBe('all');
    });

    test('should handle no params', () => {
      const result = parseEmbedParams({});

      expect(result).toEqual({});
    });

    test('should ignore unexpected params', () => {
      /* @ts-ignore */
      const result = parseEmbedParams({ tt: 'TITLE', foo: 'bar' });

      /* @ts-ignore */
      expect(result.foo).toBeUndefined();
    });
  });
});
