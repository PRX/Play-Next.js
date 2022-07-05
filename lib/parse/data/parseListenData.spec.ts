import { IRssItem } from '@interfaces/data';
import Parser from 'rss-parser';
import parseListenData from './parseListenData';

describe('lib/parse/data', () => {
  describe('parseListenData', () => {
    const mockRssData: Parser.Output<IRssItem> = {
      image: {
        url: 'http://test.com/rss.png'
      },
      title: 'Foo',
      link: 'http://test.com',
      itunes: {
        image: 'http://test.com/itunes.png',
        owner: {
          name: 'John Doe',
          email: 'email@address.com'
        }
      },
      items: [
        {
          guid: 'GUID:1',
          link: 'http://test.com/1',
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
          title: 'TITLE',
          'content:encoded': 'CONTENT:ENCODED',
          enclosure: {
            url: 'http://test.com/e2.mp3'
          },
          itunes: {
            subtitle: 'ITUNES:SUBTITLE',
            image: 'http://test.com/e2.png'
          }
        }
      ]
    };

    test('should use episode matching config guid as data source', () => {
      const result = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        {
          ...mockRssData
        }
      );

      expect(result.episodeAudio.guid).toBe('GUID:1');
      expect(result.content).toBe('CONTENT:ENCODED');
      expect(result.title).toBe('ITUNES:SUBTITLE');
    });

    test('should use itunes image url for `bgImageUrl` value', () => {
      const rssData = {
        ...mockRssData
      };
      delete rssData.image;
      const result = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        rssData
      );

      expect(result.bgImageUrl).toBe('http://test.com/itunes.png');
    });

    test('should use episode image url for `bgImageUrl` value', () => {
      const rssData = {
        ...mockRssData
      };
      delete rssData.image;
      delete rssData.itunes;
      const result = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        rssData
      );

      expect(result.bgImageUrl).toBe('http://test.com/e1.png');
    });

    test('should use episode content prop for `content` value', () => {
      const result = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        {
          ...mockRssData,
          items: [
            {
              guid: 'GUID:1',
              link: 'http://test.com/1',
              title: 'TITLE',
              content: 'CONTENT',
              enclosure: {
                url: 'http://test.com/e1.mp3'
              },
              itunes: {
                subtitle: 'ITUNES:SUBTITLE',
                image: 'http://test.com/e1.png'
              }
            }
          ]
        }
      );

      expect(result.content).toBe('CONTENT');
    });

    test('should use episode itunes summary prop for `content` value', () => {
      const result = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        {
          ...mockRssData,
          items: [
            {
              guid: 'GUID:1',
              link: 'http://test.com/1',
              title: 'TITLE',
              enclosure: {
                url: 'http://test.com/e1.mp3'
              },
              itunes: {
                subtitle: 'ITUNES:SUBTITLE',
                summary: 'ITUNES:SUMMARY',
                image: 'http://test.com/e1.png'
              }
            }
          ]
        }
      );

      expect(result.content).toBe('ITUNES:SUMMARY');
    });

    test('should use episode title for `title` value', () => {
      const result1 = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        {
          ...mockRssData,
          items: [
            {
              guid: 'GUID:1',
              link: 'http://test.com/1',
              title: 'TITLE',
              enclosure: {
                url: 'http://test.com/e1.mp3'
              },
              itunes: {
                summary: 'ITUNES:SUMMARY',
                image: 'http://test.com/e1.png'
              }
            }
          ]
        }
      );
      const result2 = parseListenData(
        { feedUrl: 'http://test.com/feed.rss', episodeGuid: 'GUID:1' },
        {
          ...mockRssData,
          items: [
            {
              guid: 'GUID:1',
              link: 'http://test.com/1',
              title: 'TITLE',
              enclosure: {
                url: 'http://test.com/e1.mp3'
              }
            }
          ]
        }
      );

      expect(result1.title).toBe('TITLE');
      expect(result2.title).toBe('TITLE');
    });
  });
});
