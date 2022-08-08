import { IEmbedConfig } from '@interfaces/config';
import generateEmbedUrl from './generateEmbedUrl';

describe('lib/generate/string', () => {
  describe('generateEmbedUrl', () => {
    const mockConfig: IEmbedConfig = {
      feedUrl: 'https://show.com/feed.xml',
      showCoverArt: false,
      showPlaylist: 0,
      /* @ts-ignore */
      notAConfigProp: null
    };

    test('should not include params in src URL that are falsy.', () => {
      const result = generateEmbedUrl({
        ...mockConfig
      });

      expect(result).toMatch('http://localhost/e?');
      expect(result).not.toMatch(/[?&]ca=/);
      expect(result).not.toMatch(/[?&]sp=/);
    });

    test('should include params in src URL for any config prop.', () => {
      const result = generateEmbedUrl({
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
      });

      expect(result).toMatch(/[?&]tt=TT/);
      expect(result).toMatch(/[?&]ts=TS/);
      expect(result).toMatch(/[?&]tc=TC/);
      expect(result).toMatch(/[?&]ua=UA/);
      expect(result).toMatch(/[?&]ui=UI/);
      expect(result).toMatch(/[?&]ue=UE/);
      expect(result).toMatch(/[?&]uf=UF/);
      expect(result).toMatch(/[?&]if=IF/);
      expect(result).toMatch(/[?&]ge=GE/);
      expect(result).toMatch(/[?&]uc=UC/);
      expect(result).toMatch(/[?&]us=US/);
      expect(result).toMatch(/[?&]gs=GS/);
      expect(result).toMatch(/[?&]gc=GC/);
      expect(result).toMatch(/[?&]sp=42/);
      expect(result).toMatch(/[?&]se=2/);
      expect(result).toMatch(/[?&]ct=CT/);
      expect(result).toMatch(/[?&]ca=1/);
      expect(result).toMatch(/[?&]ac=ff0000/);
    });
  });
});
