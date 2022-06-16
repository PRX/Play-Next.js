import type { IAudioData, IEmbedData, IRssItem } from '@interfaces/data';
import type Parser from 'rss-parser';
import parseEmbedData from './parseEmbedData';

describe('lib/parse/data', () => {
  describe('parseEmbedData', () => {
    const mockRssData: Parser.Output<IRssItem> = {
      image: {
        url: 'http://foo.com/foo.png'
      },
      title: 'Foo',
      link: 'http://foo.com',
      itunes: {
        image: 'http://foo.com/foo-3000.png',
        owner: {
          name: 'John Doe',
          email: 'email@address.com'
        }
      },
      items: [
        {
          guid: 'foo-bar',
          link: 'http://foo.com/foo-bar',
          title: 'Foo Bar',
          categories: ['foo', 'bar'],
          enclosure: {
            url: 'http://foo.com/foo-bar.mp3?_from=play.prx.org'
          },
          itunes: {
            subtitle: 'Foo to the bar.',
            image: 'http://foo.com/foo-bar.png',
            season: '1'
          }
        },
        {
          guid: 'foo-baz',
          link: 'http://foo.com/foo-baz',
          title: 'Foo Baz',
          categories: ['foo', 'baz'],
          enclosure: {
            url: 'http://foo.com/foo-baz.mp3?_from=play.prx.org'
          },
          itunes: {
            subtitle: 'Foo to the baz.',
            image: 'http://foo.com/foo-baz.png',
            season: '2'
          }
        }
      ]
    };

    test('should handle config overrides only', () => {
      const result = parseEmbedData({
        title: 'Foo',
        subtitle: 'Foo to the bar',
        audioUrl: 'http://foo.com/foo.mp3',
        imageUrl: 'http://foo.com/bg.png',
        epImageUrl: 'http://foo.com/foo.png',
        subscribeUrl: 'http://foo.com/feed.rss'
      });

      expect(result).toStrictEqual({
        bgImageUrl: 'http://foo.com/bg.png',
        audio: {
          title: 'Foo',
          subtitle: 'Foo to the bar',
          url: 'http://foo.com/foo.mp3?_from=play.prx.org',
          imageUrl: 'http://foo.com/foo.png'
        },
        followUrls: {
          rss: 'http://foo.com/feed.rss'
        }
      });
      expect(result.playlist).toBeUndefined();
      expect(result.shareUrl).toBeUndefined();
    });

    test('should use first item as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result).toStrictEqual({
        bgImageUrl: 'http://foo.com/foo.png',
        audio: {
          guid: 'foo-bar',
          link: 'http://foo.com/foo-bar',
          url: 'http://foo.com/foo-bar.mp3?_from=play.prx.org',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        },
        followUrls: {
          rss: 'http://foo.com/feed.rss'
        },
        rssTitle: 'Foo',
        shareUrl: 'http://foo.com/foo-bar',
        owner: {
          name: 'John Doe',
          email: 'email@address.com'
        }
      } as IEmbedData);
    });

    test('should use item matching config guid as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', episodeGuid: 'foo-baz' },
        mockRssData
      );

      expect(result).toStrictEqual({
        bgImageUrl: 'http://foo.com/foo.png',
        audio: {
          guid: 'foo-baz',
          link: 'http://foo.com/foo-baz',
          url: 'http://foo.com/foo-baz.mp3?_from=play.prx.org',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        },
        followUrls: {
          rss: 'http://foo.com/feed.rss'
        },
        rssTitle: 'Foo',
        shareUrl: 'http://foo.com/foo-baz',
        owner: {
          name: 'John Doe',
          email: 'email@address.com'
        }
      } as IEmbedData);
    });

    test('should use first item as audio data when config guid is not in items', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', episodeGuid: 'not-there' },
        mockRssData
      );

      expect(result).toStrictEqual({
        bgImageUrl: 'http://foo.com/foo.png',
        audio: {
          guid: 'foo-bar',
          link: 'http://foo.com/foo-bar',
          url: 'http://foo.com/foo-bar.mp3?_from=play.prx.org',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        },
        followUrls: {
          rss: 'http://foo.com/feed.rss'
        },
        rssTitle: 'Foo',
        shareUrl: 'http://foo.com/foo-bar',
        owner: {
          name: 'John Doe',
          email: 'email@address.com'
        }
      } as IEmbedData);
    });

    test('should include a full playlist', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', showPlaylist: 'all' },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-bar',
          link: 'http://foo.com/foo-bar',
          url: 'http://foo.com/foo-bar.mp3?_from=play.prx.org',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-bar.png',
          categories: ['foo', 'bar'],
          season: 1
        },
        {
          guid: 'foo-baz',
          link: 'http://foo.com/foo-baz',
          url: 'http://foo.com/foo-baz.mp3?_from=play.prx.org',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        }
      ] as IAudioData[]);
      expect(result.shareUrl).toBe('http://foo.com');
    });

    test('should filter playlist by season', () => {
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss',
          showPlaylist: 'all',
          playlistSeason: 2
        },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-baz',
          link: 'http://foo.com/foo-baz',
          url: 'http://foo.com/foo-baz.mp3?_from=play.prx.org',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        }
      ] as IAudioData[]);
    });

    test('should filter playlist by category', () => {
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss',
          showPlaylist: 'all',
          playlistCategory: 'baz'
        },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-baz',
          link: 'http://foo.com/foo-baz',
          url: 'http://foo.com/foo-baz.mp3?_from=play.prx.org',
          title: 'Foo Baz',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-baz.png',
          categories: ['foo', 'baz'],
          season: 2
        }
      ] as IAudioData[]);
    });

    test('should limit playlist length', () => {
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss',
          showPlaylist: 1
        },
        mockRssData
      );

      expect(result.playlist).toStrictEqual([
        {
          guid: 'foo-bar',
          link: 'http://foo.com/foo-bar',
          url: 'http://foo.com/foo-bar.mp3?_from=play.prx.org',
          title: 'Foo Bar',
          subtitle: 'Foo',
          imageUrl: 'http://foo.com/foo-bar.png',
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
          feedUrl: 'http://foo.com/feed.rss'
        },
        rssData
      );

      expect(result.bgImageUrl).toBe('http://foo.com/foo-3000.png');
    });

    test('should fallback to audio image for background image', () => {
      const rssData = { ...mockRssData };
      delete rssData.image;
      delete rssData.itunes;
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss'
        },
        rssData
      );

      expect(result.bgImageUrl).toBe('http://foo.com/foo-bar.png');
    });
  });
});
