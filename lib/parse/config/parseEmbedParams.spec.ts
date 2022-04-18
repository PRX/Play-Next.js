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
      sp: '1',
      se: 'SE',
      ct: 'CT'
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
      expect(result.showPlaylist).toBe(true);
      expect(result.playlistSeason).toBe('SE');
      expect(result.playlistCategory).toBe('CT');
    });

    test('should process showPlaylist into boolean', () => {
      const result1 = parseEmbedParams({ sp: '1' });
      const resultTrue = parseEmbedParams({ sp: 'true' });
      const result0 = parseEmbedParams({ sp: '0' });
      const resultFalse = parseEmbedParams({ sp: 'false' });
      const resultNull = parseEmbedParams({ sp: 'null' });
      const resultUndefined = parseEmbedParams({ sp: 'undefined' });
      const resultEmpty = parseEmbedParams({ sp: '' });

      // True values
      expect(result1.showPlaylist).toBe(true);
      expect(resultTrue.showPlaylist).toBe(true);

      // False values
      expect(result0.showPlaylist).toBe(false);
      expect(resultFalse.showPlaylist).toBe(false);
      expect(resultNull.showPlaylist).toBe(false);
      expect(resultUndefined.showPlaylist).toBe(false);
      expect(resultEmpty.showPlaylist).toBe(false);
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
