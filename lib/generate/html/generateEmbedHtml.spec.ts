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
