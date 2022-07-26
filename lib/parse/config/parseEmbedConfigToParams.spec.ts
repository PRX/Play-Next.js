import { IEmbedConfig } from '@interfaces/config';
import parseEmbedConfigToParams from './parseEmbedConfigToParams';

describe('lib/parse/config', () => {
  describe('parseEmbedConfigToParams', () => {
    const mockConfig: IEmbedConfig = {
      title: 'TT',
      subtitle: 'TS',
      ctaTitle: 'TC',
      audioUrl: 'UA',
      imageUrl: 'UI',
      episodeImageUrl: 'UE',
      feedUrl: 'UF',
      feedId: 'IF',
      episodeGuid: 'GE',
      ctaUrl: 'UC',
      subscribeUrl: 'US',
      subscribeTarget: 'GS',
      ctaTarget: 'GC',
      showPlaylist: 42,
      playlistSeason: 2,
      playlistCategory: 'CT',
      showCoverArt: true,
      accentColor: ['#ff0000']
    };

    test('should handle expected parameters', () => {
      const result = parseEmbedConfigToParams(mockConfig);

      expect(result.tt).toBe('TT');
      expect(result.ts).toBe('TS');
      expect(result.tc).toBe('TC');
      expect(result.ua).toBe('UA');
      expect(result.ui).toBe('UI');
      expect(result.ue).toBe('UE');
      expect(result.uf).toBe('UF');
      expect(result.if).toBe('IF');
      expect(result.ge).toBe('GE');
      expect(result.uc).toBe('UC');
      expect(result.us).toBe('US');
      expect(result.gs).toBe('GS');
      expect(result.gc).toBe('GC');
      expect(result.sp).toBe(42);
      expect(result.se).toBe(2);
      expect(result.ct).toBe('CT');
      expect(result.ca).toBe(1);
      expect(result.ac).toStrictEqual(['ff0000']);
    });

    test('should not include falsy params', () => {
      const result = parseEmbedConfigToParams({ showCoverArt: false });

      expect(result.ca).toBeUndefined();
    });

    test('should handle no config options', () => {
      const result = parseEmbedConfigToParams({});

      expect(result).toEqual({});
    });

    test('should ignore unexpected params', () => {
      /* @ts-ignore */
      const result = parseEmbedConfigToParams({ tt: 'TITLE', foo: 'bar' });

      /* @ts-ignore */
      expect(result.foo).toBeUndefined();
    });
  });
});
