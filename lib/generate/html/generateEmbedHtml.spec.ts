import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import generateEmbedHtml from './generateEmbedHtml';

describe('lib/generate/html', () => {
  describe('generateEmbedHtml', () => {
    const mockConfig: IEmbedConfig = {
      feedUrl: 'https://show.com/feed.xml',
      showCoverArt: false,
      showPlaylist: 0,
      /* @ts-ignore */
      notAConfigProp: null
    };

    test('should not include params in src that are falsy.', () => {
      const result = generateEmbedHtml({
        ...mockConfig
      });

      expect(result).not.toMatch(/[?&]ca=/);
      expect(result).not.toMatch(/[?&]sp=/);
    });

    test('should include params in src any config prop.', () => {
      const result = generateEmbedHtml({
        title: 'TT',
        subtitle: 'TS',
        ctaTitle: 'TC',
        audioUrl: 'UA',
        imageUrl: 'UI',
        epImageUrl: 'UE',
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
        accentColor: 'ff0000'
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

    test('should include an iframe w/ default attributes.', () => {
      const result = generateEmbedHtml({
        feedUrl: mockConfig.feedUrl
      });

      expect(result).toMatch(/^<iframe[^>]+><\/iframe>$/);
      expect(result).toMatch(/src="https:\/\/play\.prx\.org\/e\?[^"]+"/);
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="200"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for playlist.', () => {
      const result = generateEmbedHtml({
        feedUrl: mockConfig.feedUrl,
        showPlaylist: 10
      });

      expect(result).toMatch(/^<iframe[^>]+><\/iframe>$/);
      expect(result).toMatch(/src="https:\/\/play\.prx\.org\/e\?[^"]+"/);
      expect(result).toMatch(/[?&]sp=10/);
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="600"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for cover art.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        showCoverArt: true
      });

      expect(result).toMatch(/^<iframe[^>]+><\/iframe>$/);
      expect(result).toMatch(/src="https:\/\/play\.prx\.org\/e\?[^"]+"/);
      expect(result).toMatch(/[?&]ca=1/);
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="1000"');
      expect(result).toMatch('style="height: calc(100% + 200px)"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for both playlist and cover art.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        showCoverArt: true,
        showPlaylist: 15
      });

      expect(result).toMatch(/^<iframe[^>]+><\/iframe>$/);
      expect(result).toMatch(/src="https:\/\/play\.prx\.org\/e\?[^"]+"/);
      expect(result).toMatch(/[?&]ca=1/);
      expect(result).toMatch(/[?&]sp=15/);
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="1400"');
      expect(result).toMatch('style="height: calc(100% + 600px)"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });
  });
});
