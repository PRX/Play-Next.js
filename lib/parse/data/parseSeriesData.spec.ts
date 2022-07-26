import { IRss } from '@interfaces/data';
import parseSeriesData from './parseSeriesData';

describe('lib/parse/data', () => {
  describe('parseSeriesData', () => {
    const mockRssData: IRss = {
      image: {
        url: 'http://test.com/foo.png'
      },
      title: 'Foo',
      link: 'http://test.com',
      itunes: {
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
      const result = parseSeriesData(
        { feedUrl: 'http://test.com/feed.rss' },
        {
          ...mockRssData
        }
      );

      expect(result.bgImageUrl).toBe('http://test.com/foo.png');
      expect(result.imageUrl).toBe('http://test.com/foo.png');
      expect(result.title).toBe('Foo');
      expect(result.summary).toBe('<p>ITUNES:SUMMARY</p>');
      expect(result.episodes[0].guid).toBe('GUID:1');
      expect(result.episodes[0].title).toBe('TITLE');
      expect(result.episodes[0].teaser).toBe('ITUNES:SUBTITLE');
      expect(result.episodes[0].pubDate).toBe(
        'Wed, 16 Jun 2022 19:00:00 -0000'
      );
    });

    test('should use episode summary for `teaser` value', () => {
      const rssData = {
        ...mockRssData
      };
      delete rssData.items[1].itunes;
      const result = parseSeriesData(
        { feedUrl: 'http://test.com/feed.rss' },
        rssData
      );

      expect(result.episodes[1].teaser).toBeUndefined();
    });

    test('should use itunes image for `bgImageUrl` and `imageUrl` values value', () => {
      const rssData = {
        ...mockRssData
      };
      delete rssData.image;
      const result = parseSeriesData(
        { feedUrl: 'http://test.com/feed.rss' },
        rssData
      );

      expect(result.episodes[1].teaser).toBeUndefined();
    });

    test('should use description for `summary` values value', () => {
      const rssData = {
        ...mockRssData,
        description: 'DESCRIPTION'
      };
      delete rssData.itunes;
      const result = parseSeriesData(
        { feedUrl: 'http://test.com/feed.rss' },
        rssData
      );

      expect(result.summary).toBe('<p>DESCRIPTION</p>');
    });
  });
});
