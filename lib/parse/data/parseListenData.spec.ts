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
      expect(result.followUrls.rss).toBe('http://test.com/feed.rss');
      expect(result.episodes.length).toBe(2);
    });

    test('should handle no rss data', () => {
      const result = parseListenData({});

      expect(result).toStrictEqual({ followUrls: {} });
    });
  });
});
