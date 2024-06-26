import type { IRss } from '@interfaces/data';
import parseEmbedData from './parseEmbedData';

describe('lib/parse/data', () => {
  describe('parseEmbedData', () => {
    const mockRssData: IRss = {
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
      podcast: {
        value: {
          type: 'webmonetization',
          method: 'ILP',
          valueRecipients: [
            {
              address: '$example.now/~alice',
              type: 'paymentpointer',
              split: 100
            }
          ]
        }
      },
      items: [
        {
          guid: 'foo-bar',
          link: 'http://foo.com/foo-bar',
          title: 'Foo Bar',
          categories: ['foo  ', 'bar'],
          enclosure: {
            url: 'http://foo.com/foo-bar.mp3'
          },
          itunes: {
            subtitle: 'Foo to the bar.',
            image: 'http://foo.com/foo-bar.png',
            season: '1',
            categories: ['  baz']
          }
        },
        {
          guid: 'foo-baz',
          link: 'http://foo.com/foo-baz',
          title: 'Foo Baz',
          enclosure: {
            url: 'http://foo.com/foo-baz.mp3'
          },
          itunes: {
            subtitle: 'Foo to the baz.',
            image: 'http://foo.com/foo-baz.png',
            categories: ['foo', 'baz'],
            season: '2'
          }
        },
        {
          guid: 'foo-baz-zab',
          link: 'http://foo.com/foo-baz-zab',
          title: 'Foo Baz Zab',
          enclosure: {
            url: 'http://foo.com/foo-baz-zab.mp3'
          },
          itunes: {
            subtitle: 'Foo to the baz to the zab.',
            image: 'http://foo.com/foo-baz-zab.png',
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
        audioUrlPreview: 'http://preview.foo.com/foo.mp3',
        imageUrl: 'http://foo.com/bg.png',
        episodeImageUrl: 'http://foo.com/foo.png',
        subscribeUrl: 'http://foo.com/feed.rss'
      });

      expect(result.bgImageUrl).toBe('http://foo.com/bg.png');
      expect(result.audio).toStrictEqual({
        title: 'Foo',
        subtitle: 'Foo to the bar',
        url: 'http://foo.com/foo.mp3?_from=play.prx.org',
        previewUrl: 'http://preview.foo.com/foo.mp3?_from=play.prx.org',
        imageUrl: 'http://foo.com/foo.png'
      });
      expect(result.followUrls.rss).toBe('http://foo.com/feed.rss');
      expect(result.playlist).toBeUndefined();
      expect(result.shareUrl).toBeUndefined();
    });

    test('should use first item as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result.audio.guid).toBe('foo-bar');
    });

    test('should not have audio data when guid is not in feed', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', episodeGuid: 'NOT-THERE' },
        mockRssData
      );

      expect(result.audio).toBeUndefined();
    });

    test('should get payment pointer from value recipient', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result.paymentPointer).toBe('$example.now/~alice');
    });

    test('should not set payment pointer when missing value recipient', () => {
      const data = { ...mockRssData };
      delete data.podcast.value.valueRecipients;
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        data
      );

      if (process.env.PAYMENT_POINTER) {
        expect(result.paymentPointer).toBe(process.env.PAYMENT_POINTER);
      } else {
        expect(result.paymentPointer).toBeUndefined();
      }
    });

    test('should use item matching config guid as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', episodeGuid: 'foo-baz' },
        mockRssData
      );

      expect(result.audio.guid).toBe('foo-baz');
    });

    test('should include a full playlist', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', showPlaylist: 'all' },
        mockRssData
      );

      expect(result.playlist.length).toBe(3);
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

      expect(result.playlist.length).toBe(2);
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

      expect(result.playlist.length).toBe(2);
    });

    test('should limit playlist length', () => {
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss',
          showPlaylist: 2
        },
        mockRssData
      );

      expect(result.playlist.length).toBe(2);
    });

    test('should omit playlist prop when playlist contains 1 item', () => {
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss',
          showPlaylist: 1
        },
        mockRssData
      );

      expect(result.playlist).toBeUndefined();
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

    test('should set rss link on audio when items do not have links', () => {
      const rssData = {
        ...mockRssData
      };
      delete rssData.items[0].link;
      const result = parseEmbedData(
        {
          feedUrl: 'http://foo.com/feed.rss',
          showPlaylist: 'all'
        },
        rssData
      );

      expect(result.audio.link).toBe('http://foo.com');
      expect(result.playlist[0].link).toBe('http://foo.com');
      expect(result.playlist[1].link).toBe('http://foo.com/foo-baz');
    });
  });
});
