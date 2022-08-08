import { IRssItem } from '@interfaces/data';
import parseListenEpisodeData from './parseListenEpisodeData';

describe('lib/parse/data', () => {
  describe('parseListenEpisodeData', () => {
    const mockRssItem: IRssItem = {
      guid: 'GUID:1',
      link: 'http://test.com/1',
      title: 'TITLE',
      content: 'CONTENT',
      'content:encoded': 'CONTENT:ENCODED',
      enclosure: {
        url: 'http://test.com/e1.mp3'
      },
      categories: ['cat1', '  cat2', 'cat3   '],
      itunes: {
        subtitle: 'ITUNES:SUBTITLE',
        summary: 'ITUNES:SUMMARY',
        image: 'http://test.com/e1.png',
        season: '42',
        duration: '12:34',
        explicit: 'true'
      }
    };

    test('should map expected properties', () => {
      const result = parseListenEpisodeData(mockRssItem);

      expect(result.guid).toBe('GUID:1');
      expect(result.link).toBe('http://test.com/1');
      expect(result.title).toBe('TITLE');
      expect(result.content).toBe('CONTENT:ENCODED');
      expect(result.url).toBe('http://test.com/e1.mp3?_from=play.prx.org');
      expect(result.imageUrl).toBe('http://test.com/e1.png');
      expect(result.subtitle).toBe('ITUNES:SUBTITLE');
      expect(result.season).toBe(42);
      expect(result.duration).toBe('12:34');
      expect(result.explicit).toBe(true);
      expect(result.categories).toStrictEqual(['cat1', 'cat2', 'cat3']);
    });

    test('should use content prop for `content` value', () => {
      const rssItem = {
        ...mockRssItem
      };
      delete rssItem['content:encoded'];
      const result = parseListenEpisodeData(rssItem);

      expect(result.content).toBe('CONTENT');
    });

    test('should use itunes summary prop for `content` value', () => {
      const rssItem = {
        ...mockRssItem
      };
      delete rssItem.content;
      delete rssItem['content:encoded'];
      const result = parseListenEpisodeData(rssItem);

      expect(result.content).toBe('ITUNES:SUMMARY');
    });

    test('should handle missing categories property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.categories;
      const result = parseListenEpisodeData(rssItem);

      expect(result.categories).toBeUndefined();
    });

    test('should handle missing itunes property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.content;
      delete rssItem['content:encoded'];
      delete rssItem.itunes;
      const result = parseListenEpisodeData(rssItem);

      expect(result.subtitle).toBeUndefined();
      expect(result.content).toBeUndefined();
      expect(result.season).toBeUndefined();
      expect(result.duration).toBeUndefined();
      expect(result.explicit).toBeUndefined();
    });

    test('should handle missing enclosure property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.enclosure;
      const result = parseListenEpisodeData(rssItem);

      expect(result.url).toBeUndefined();
    });
  });
});
