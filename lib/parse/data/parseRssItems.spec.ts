import type Parser from 'rss-parser';
import { IRssItem } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseRssItems from './parseRssItems';

describe('lib/parse/data', () => {
  describe('parseRssItems', () => {
    const mockRssItems: IRssItem[] = [
      {
        guid: 'foo-1',
        categories: ['cat1', '  cat2', 'Cat3  '],
        itunes: {
          season: '1',
          categories: ['cat4'],
          image: 'ITUNES:IMAGE:1'
        }
      },
      {
        guid: 'foo-2',
        categories: ['cat1', 'cat2']
      },
      {
        guid: 'foo-3',
        categories: ['cat1', 'cat3'],
        itunes: {
          season: '1'
        }
      },
      {
        guid: 'foo-4',
        itunes: {
          season: '2',
          categories: ['cat2']
        }
      },
      {
        guid: 'foo-5'
      }
    ];
    const mockRssData: Parser.Output<IRssItem> = {
      title: 'TITLE',
      itunes: {
        subtitle: 'SUBTITLE',
        image: 'ITUNES:IMAGE:DEFAULT'
      },
      items: mockRssItems
    };

    test('should return undefined', () => {
      const config: IEmbedConfig = {};
      const data = {
        ...mockRssData
      };
      delete data.items;
      const result = parseRssItems(data, config);

      expect(result).toBeUndefined();
    });

    test('should return only first item', () => {
      const config: IEmbedConfig = {};
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(1);
      expect(result[0].guid).toBe('foo-1');
    });

    test('should use channel image on item when item image is missing', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(mockRssData, config);

      expect(result[0].imageUrl).toBe('ITUNES:IMAGE:1');
      expect(result[2].imageUrl).toBe('ITUNES:IMAGE:DEFAULT');
    });

    test('should handle missing itunes object', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const data = { ...mockRssData };
      delete data.itunes;
      const result = parseRssItems(data, config);

      expect(result[0].imageUrl).toBe('ITUNES:IMAGE:1');
      expect(result[2].imageUrl).toBeUndefined();
      expect(result[4].categories).toBeUndefined();
    });

    test('should consolidate and sanitize categories', () => {
      const config: IEmbedConfig = {};
      const result = parseRssItems(mockRssData, config);

      expect(result[0].categories.length).toBe(4);
      expect(result[0].categories).toStrictEqual([
        'cat1',
        'cat2',
        'Cat3',
        'cat4'
      ]);
    });

    test("should add categories from feed channel when item doesn't have categories.", () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(
        {
          ...mockRssData,
          itunes: {
            categories: ['foo']
          }
        },
        config
      );

      expect(result[0].categories).not.toContain('foo');
      expect(result[1].categories).not.toContain('foo');
      expect(result[2].categories).not.toContain('foo');
      expect(result[3].categories).not.toContain('foo');
      expect(result[4].categories).toContain('foo');
    });

    test('should remove duplicate categories', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(
        {
          ...mockRssData,
          items: [
            ...mockRssData.items.map((item) => ({
              ...item,
              itunes: {
                ...(item.itunes || {}),
                categories: [
                  ...(item.itunes?.categories || []),
                  ...(item.categories || [])
                ]
              }
            }))
          ]
        },
        config
      );

      expect(result[0].categories.length).toBe(4);
      expect(result[1].categories.length).toBe(2);
      expect(result[2].categories.length).toBe(2);
      expect(result[3].categories.length).toBe(1);
      expect(result[4].categories.length).toBe(0);
    });

    test('should only add categories when neither rss or itunes categories exist', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(mockRssData, config);

      expect(result[0].categories).not.toBeUndefined();
      expect(result[1].categories).not.toBeUndefined();
      expect(result[2].categories).not.toBeUndefined();
      expect(result[3].categories).not.toBeUndefined();
      expect(result[4].categories).toBeUndefined();
    });

    test('should return specific item', () => {
      const config: IEmbedConfig = { episodeGuid: 'foo-2' };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(1);
      expect(result[0].guid).toBe('foo-2');
    });

    test('should use first item when specific item not found', () => {
      const config: IEmbedConfig = { episodeGuid: 'NOT-THERE' };
      const result = parseRssItems(mockRssData, config);

      expect(result[0].guid).toBe('foo-1');
    });

    test('should return all items', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(mockRssItems.length);
    });

    test('should return n items', () => {
      const config: IEmbedConfig = { showPlaylist: 2 };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(2);
      expect(result[0].guid).toBe('foo-1');
      expect(result[1].guid).toBe('foo-2');
    });

    test('should return items for a season', () => {
      const config: IEmbedConfig = { showPlaylist: 'all', playlistSeason: 2 };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(1);
      expect(result[0].guid).toBe('foo-4');
    });

    test('should return items for a category', () => {
      const config: IEmbedConfig = {
        showPlaylist: 'all',
        playlistCategory: 'cat3'
      };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(2);
      expect(result[0].guid).toBe('foo-1');
      expect(result[1].guid).toBe('foo-3');
    });

    test('should return first item when playlist has no results', () => {
      const config: IEmbedConfig = { showPlaylist: 'all', playlistSeason: 3 };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(1);
      expect(result[0].guid).toBe('foo-1');
    });
  });
});
