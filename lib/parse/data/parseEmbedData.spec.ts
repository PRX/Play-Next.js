import { IAudioData, IEmbedData, IRssItem } from '@interfaces/data';
import Parser from 'rss-parser';
import parseEmbedData from './parseEmbedData';

describe('lib/parse/data', () => {
  describe('parseEmbedData', () => {
    const mockRssData: Parser.Output<IRssItem> = {
      image: {
        url: '//foo.com/foo.png'
      },
      title: 'Foo',
      link: '//foo.com',
      itunes: {
        image: '//foo.com/foo-3000.png'
      },
      items: [
        {
          guid: 'foo-bar',
          link: '//foo.com/foo-bar',
          title: 'Foo Bar',
          categories: ['foo', 'bar'],
          enclosure: {
            url: '//foo.com/foo-bar.mp3'
          },
          itunes: {
            subtitle: 'Foo to the bar.',
            image: '//foo.com/foo-bar.png',
            season: '1'
          }
        },
        {
          guid: 'foo-baz',
          link: '//foo.com/foo-baz',
          title: 'Foo Baz',
          categories: ['foo', 'baz'],
          enclosure: {
            url: '//foo.com/foo-baz.mp3'
          },
          itunes: {
            subtitle: 'Foo to the baz.',
            image: '//foo.com/foo-baz.png',
            season: '2'
          }
        }
      ]
    };

    test('should handle config overrides only', () => {
      const result = parseEmbedData({
        title: 'Foo',
        subtitle: 'Foo to the bar',
        audioUrl: '//foo.com/foo.mp3',
        imageUrl: '//foo.com/bg.png',
        epImageUrl: '//foo.com/foo.png',
        subscribeUrl: '//foo.com/feed.rss'
      });

      expect(result).toStrictEqual({
        bgImageUrl: '//foo.com/bg.png',
        audio: {
          title: 'Foo',
          subtitle: 'Foo to the bar',
          url: '//foo.com/foo.mp3',
          imageUrl: '//foo.com/foo.png'
        },
        followUrls: {
          rss: '//foo.com/feed.rss'
        }
      });
      expect(result.playlist).toBeUndefined();
      expect(result.shareUrl).toBeUndefined();
    });

    test('should use first item as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: '//foo.com/feed.rss' },
        mockRssData
      );

      expect(result).toStrictEqual({
        bgImageUrl: '//foo.com/foo.png',
        audio: {
          guid: 'foo-bar',
          link: '//foo.com/foo-bar',
          url: '//foo.com/foo-bar.mp3',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        },
        followUrls: {
          rss: '//foo.com/feed.rss'
        },
        shareUrl: '//foo.com/foo-bar'
      } as IEmbedData);
    });

    test('should use item matching config guid as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: '//foo.com/feed.rss', episodeGuid: 'foo-baz' },
        mockRssData
      );

      expect(result).toStrictEqual({
        bgImageUrl: '//foo.com/foo.png',
        audio: {
          guid: 'foo-baz',
          link: '//foo.com/foo-baz',
          url: '//foo.com/foo-baz.mp3',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        },
        followUrls: {
          rss: '//foo.com/feed.rss'
        },
        shareUrl: '//foo.com/foo-baz'
      } as IEmbedData);
    });

    test('should use first item as audio data when config guid is not in items', () => {
      const result = parseEmbedData(
        { feedUrl: '//foo.com/feed.rss', episodeGuid: 'not-there' },
        mockRssData
      );

      expect(result).toStrictEqual({
        bgImageUrl: '//foo.com/foo.png',
        audio: {
          guid: 'foo-bar',
          link: '//foo.com/foo-bar',
          url: '//foo.com/foo-bar.mp3',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        },
        followUrls: {
          rss: '//foo.com/feed.rss'
        },
        shareUrl: '//foo.com/foo-bar'
      } as IEmbedData);
    });

    test('should include a full playlist', () => {
      const result = parseEmbedData(
        { feedUrl: '//foo.com/feed.rss', showPlaylist: 'all' },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-bar',
          link: '//foo.com/foo-bar',
          url: '//foo.com/foo-bar.mp3',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        },
        {
          guid: 'foo-baz',
          link: '//foo.com/foo-baz',
          url: '//foo.com/foo-baz.mp3',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        }
      ] as IAudioData[]);
      expect(result.shareUrl).toBe('//foo.com');
    });

    test('should filter playlist by season', () => {
      const result = parseEmbedData(
        {
          feedUrl: '//foo.com/feed.rss',
          showPlaylist: 'all',
          playlistSeason: 2
        },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-baz',
          link: '//foo.com/foo-baz',
          url: '//foo.com/foo-baz.mp3',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        }
      ] as IAudioData[]);
    });

    test('should filter playlist by category', () => {
      const result = parseEmbedData(
        {
          feedUrl: '//foo.com/feed.rss',
          showPlaylist: 'all',
          playlistCategory: 'baz'
        },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-baz',
          link: '//foo.com/foo-baz',
          url: '//foo.com/foo-baz.mp3',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        }
      ] as IAudioData[]);
    });

    test('should limit playlist length', () => {
      const result = parseEmbedData(
        {
          feedUrl: '//foo.com/feed.rss',
          showPlaylist: 1
        },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-bar',
          link: '//foo.com/foo-bar',
          url: '//foo.com/foo-bar.mp3',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: '//foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        }
      ] as IAudioData[]);
    });

    test('should fallback to itunes image for background image', () => {
      const rssData = { ...mockRssData };
      delete rssData.image;
      const result = parseEmbedData(
        {
          feedUrl: '//foo.com/feed.rss'
        },
        rssData
      );

      expect(result.bgImageUrl).toBe('//foo.com/foo-3000.png');
    });

    test('should fallback to audio image for background image', () => {
      const rssData = { ...mockRssData };
      delete rssData.image;
      delete rssData.itunes;
      const result = parseEmbedData(
        {
          feedUrl: '//foo.com/feed.rss'
        },
        rssData
      );

      expect(result.bgImageUrl).toBe('//foo.com/foo-bar.png');
    });
  });
});
