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
        follow: {
          url: 'http://foo.com/subscribeLinks.json',
          data: {
            version: '1.0.0',
            links: [
              {
                href: 'https://podcasts.apple.com/podcast/id1766018642',
                text: 'Apple Podcasts'
              },
              {
                href: 'https://unknown.service.com/show/id1766018642',
                text: 'Unknown Service'
              }
            ]
          }
        },
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
      const mockConfig = {
        title: 'Foo',
        subtitle: 'Foo to the bar',
        mediaType: undefined,
        audioUrl: 'http://foo.com/foo.mp3',
        audioUrlPreview: 'http://preview.foo.com/foo.mp3',
        imageUrl: 'http://foo.com/bg.png',
        episodeImageUrl: 'http://foo.com/foo.png',
        subscribeUrl: 'http://foo.com/feed.rss'
      };
      let result = parseEmbedData(mockConfig);

      expect(result.bgImageUrl).toBe('http://foo.com/bg.png');
      expect(result.media).toStrictEqual({
        title: 'Foo',
        subtitle: 'Foo to the bar',
        sources: [
          {
            type: 'audio/mpeg',
            url: 'http://foo.com/foo.mp3?_from=play.prx.org',
            length: 0
          }
        ],
        hasAudioSourceAt: 0,
        hasVideoSourceAt: false,
        previewUrl: 'http://preview.foo.com/foo.mp3?_from=play.prx.org',
        imageUrl: 'http://foo.com/foo.png'
      });
      expect(result.followLinks[0].href).toBe('http://foo.com/feed.rss');
      expect(result.playlist).toBeUndefined();
      expect(result.shareUrl).toBeUndefined();

      mockConfig.audioUrl = 'http://foo.com/foo';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('audio/mpeg');

      mockConfig.audioUrl = 'http://foo.com/foo.oga';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('audio/ogg');

      mockConfig.audioUrl = 'http://foo.com/foo.m4a';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('audio/mp4');

      mockConfig.audioUrl = 'http://foo.com/foo.opus';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('audio/opus');

      mockConfig.audioUrl = 'http://foo.com/foo.flac';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('audio/flac');

      mockConfig.audioUrl = 'http://foo.com/foo.ogv';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/ogg');

      mockConfig.audioUrl = 'http://foo.com/foo.ogg';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/ogg');

      mockConfig.audioUrl = 'http://foo.com/foo.mov';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/quicktime');

      mockConfig.audioUrl = 'http://foo.com/foo.avi';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/x-msvideo');

      mockConfig.audioUrl = 'http://foo.com/foo.wmv';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/x-ms-wmv');

      mockConfig.audioUrl = 'http://foo.com/foo.mp4';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/mp4');

      mockConfig.audioUrl = 'http://foo.com/foo.webm';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('video/webm');

      mockConfig.audioUrl = 'http://foo.com/foo.m3u8';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe('application/x-mpegURL');

      mockConfig.audioUrl = 'http://foo.com/foo';
      mockConfig.mediaType = 'video/mp4';
      result = parseEmbedData(mockConfig);
      expect(result.media.sources[0].type).toBe(mockConfig.mediaType);
    });

    test('should use first item as audio data', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result.media.guid).toBe('foo-bar');
    });

    test('should not have media data when guid is not in feed', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss', episodeGuid: 'NOT-THERE' },
        mockRssData
      );

      expect(result.media).toBeUndefined();
    });

    test('should get prepend follow data links to followLinks', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result.followLinks.length).toBe(3);
      expect(result.followLinks[0].href).toBe(
        mockRssData.podcast.follow.data.links[0].href
      );
      expect(result.followLinks[1].href).toBe(
        mockRssData.podcast.follow.data.links[1].href
      );
      expect(result.followLinks[2].href).toBe('http://foo.com/feed.rss');
    });

    test('should set service prop on followLink items', () => {
      const result = parseEmbedData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result.followLinks[0].service).toBe('apple-podcasts');
      expect(result.followLinks[1].service).toBeNull();
      expect(result.followLinks[2].service).toBe('rss');
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

      expect(result.media.guid).toBe('foo-baz');
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

      expect(result.media.link).toBe('http://foo.com');
      expect(result.playlist[0].link).toBe('http://foo.com');
      expect(result.playlist[1].link).toBe('http://foo.com/foo-baz');
    });
  });
});
