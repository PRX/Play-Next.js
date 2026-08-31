import { IEmbedConfig } from '@interfaces/config';
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

    test('should include an iframe w/ default attributes.', () => {
      const result = generateEmbedHtml({
        feedUrl: mockConfig.feedUrl
      });

      expect(result).toMatch(/^<iframe[^>]+><\/iframe>$/);
      expect(result).toMatch(/src="[^"]+"/);
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
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]sp=10/);
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="581"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for video, and a wrapper div.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        mediaType: 'video'
      });

      expect(result).toMatch(
        /^<div style="[^"]+"><iframe[^>]+><\/iframe><\/div>$/
      );
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]mt=video/);
      expect(result).toMatch(
        'position: relative; height: 0; width: 100%; min-width: 300px; padding-top: 56.25%;'
      );
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="100%"');
      expect(result).toMatch('style="position: absolute; inset: 0;"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for video, and a wrapper div using maxWidth in styles.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        mediaType: 'video',
        maxWidth: 800
      });

      expect(result).toMatch(
        /^<div style="[^"]+"><iframe[^>]+><\/iframe><\/div>$/
      );
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]mt=video/);
      expect(result).toMatch(
        'position: relative; height: 0; width: 100%; min-width: 300px; max-width: 800px; padding-top: clamp(169px, 56.25%, 450px); margin-inline: auto;'
      );
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="100%"');
      expect(result).toMatch('style="position: absolute; inset: 0;"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for cover art, and a wrapper div.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        showCoverArt: true
      });

      expect(result).toMatch(
        /^<div style="[^"]+"><iframe[^>]+><\/iframe><\/div>$/
      );
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]ca=1/);
      expect(result).toMatch(
        'position: relative; height: 0; width: 100%; min-width: 300px; padding-top: calc(100% + 200px);'
      );
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="100%"');
      expect(result).toMatch('style="position: absolute; inset: 0;"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for both playlist and cover art, and a wrapper div.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        showCoverArt: true,
        showPlaylist: 15
      });

      expect(result).toMatch(
        /^<div style="[^"]+"><iframe[^>]+><\/iframe><\/div>$/
      );
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]ca=1/);
      expect(result).toMatch(/[?&]sp=15/);
      expect(result).toMatch(
        'position: relative; height: 0; width: 100%; min-width: 300px; padding-top: calc(100% + 581px);'
      );
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="100%"');
      expect(result).toMatch('style="position: absolute; inset: 0;"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for both playlist and video, and a wrapper div.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        mediaType: 'video',
        showPlaylist: 15
      });

      expect(result).toMatch(
        /^<div style="[^"]+"><iframe[^>]+><\/iframe><\/div>$/
      );
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]mt=video/);
      expect(result).toMatch(/[?&]sp=15/);
      expect(result).toMatch(
        'position: relative; height: 0; width: 100%; min-width: 300px; padding-top: calc(56.25% + 381px);'
      );
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="100%"');
      expect(result).toMatch('style="position: absolute; inset: 0;"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });

    test('should include an iframe w/ attributes for both playlist and video, and a wrapper div using maxWidth in styles.', () => {
      const result = generateEmbedHtml({
        ...mockConfig,
        mediaType: 'video',
        showPlaylist: 15,
        maxWidth: 800
      });

      expect(result).toMatch(
        /^<div style="[^"]+"><iframe[^>]+><\/iframe><\/div>$/
      );
      expect(result).toMatch(/src="[^"]+"/);
      expect(result).toMatch(/[?&]mt=video/);
      expect(result).toMatch(/[?&]sp=15/);
      expect(result).toMatch(
        'position: relative; height: 0; width: 100%; min-width: 300px; max-width: 800px; padding-top: clamp(550px, calc(56.25% + 381px), 831px); margin-inline: auto;'
      );
      expect(result).toMatch('width="100%"');
      expect(result).toMatch('height="100%"');
      expect(result).toMatch('style="position: absolute; inset: 0;"');
      expect(result).toMatch('frameborder="0"');
      expect(result).toMatch('scrolling="no"');
      expect(result).toMatch('allow="monetization"');
    });
  });
});
