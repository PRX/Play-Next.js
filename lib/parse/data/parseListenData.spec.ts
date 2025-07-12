import { IRss } from '@interfaces/data';
import parseListenData from './parseListenData';

describe('lib/parse/data', () => {
  describe('parseListenData', () => {
    const mockRssData: IRss = {
      image: {
        url: 'http://test.com/foo.png'
      },
      link: 'http://test.com',
      title: 'Foo',
      description: 'DESCRIPTION',
      copyright: 'COPYRIGHT',
      itunes: {
        author: 'John Doe',
        summary: 'ITUNES:SUMMARY',
        image: 'http://test.com/foo-3000.png',
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
        }
      },
      items: [
        {
          guid: 'GUID:1',
          link: 'http://test.com/1',
          pubDate: 'Wed, 16 Jun 2022 19:00:00 -0000',
          title: 'TITLE',
          'content:encoded': 'CONTENT:ENCODED',
          enclosure: {
            url: 'http://test.com/e1.mp3'
          },
          itunes: {
            subtitle: 'ITUNES:SUBTITLE',
            image: 'http://test.com/e1.png'
          }
        },
        {
          guid: 'GUID:2',
          link: 'http://test.com/2',
          pubDate: 'Wed, 15 Jun 2022 11:00:00 -0000',
          title: 'TITLE',
          'content:encoded': 'CONTENT:ENCODED',
          enclosure: {
            url: 'http://test.com/e2.mp3'
          },
          itunes: {
            subtitle: '',
            summary: 'ITUNES:SUMMARY',
            image: 'http://test.com/e2.png'
          }
        }
      ]
    };

    test('should parse defined default values', () => {
      const result = parseListenData(
        { feedUrl: 'http://test.com/feed.rss' },
        {
          ...mockRssData
        }
      );

      expect(result.bgImageUrl).toBe('http://test.com/foo-3000.png');
      expect(result.title).toBe('Foo');
      expect(result.author).toBe('John Doe');
      expect(result.owner).toStrictEqual({
        name: 'John Doe',
        email: 'email@address.com'
      });
      expect(result.copyright).toBe('COPYRIGHT');
      expect(result.content).toBe('<p>ITUNES:SUMMARY</p>');
      expect(result.link).toBe('http://test.com');
      expect(result.followLinks[2].href).toBe('http://test.com/feed.rss');
      expect(result.episodes.length).toBe(2);
    });

    test('should handle no rss data', () => {
      const result = parseListenData({});

      expect(result).toStrictEqual({ followLinks: [] });
    });

    test('should get prepend follow data links to followLinks', () => {
      const result = parseListenData(
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

    test('should get set service prop on followLink items', () => {
      const result = parseListenData(
        { feedUrl: 'http://foo.com/feed.rss' },
        mockRssData
      );

      expect(result.followLinks[0].service).toBe('apple-podcasts');
      expect(result.followLinks[1].service).toBeNull();
      expect(result.followLinks[2].service).toBe('rss');
    });
  });
});
