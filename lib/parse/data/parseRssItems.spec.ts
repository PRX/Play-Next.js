import { IRss, IRssItem } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/config';
import parseRssItems from './parseRssItems';

describe('lib/parse/data', () => {
  describe('parseRssItems', () => {
    const mockRssItems: IRssItem[] = [
      {
        guid: 'foo-1',
        categories: ['cat1', '  cat2', 'Cat3  '],
        enclosure: { url: 'ENCLOSURE:URL' },
        itunes: {
          season: '1',
          categories: ['cat4'],
          image: 'ITUNES:IMAGE:1'
        }
      },
      {
        guid: 'foo-2',
        categories: ['cat1', 'cat2'],
        enclosure: { url: 'ENCLOSURE:URL' }
      },
      {
        guid: 'foo-3',
        categories: ['cat1', 'cat3'],
        enclosure: { url: 'ENCLOSURE:URL' },
        itunes: {
          season: '1'
        }
      },
      {
        guid: 'foo-4',
        enclosure: { url: 'ENCLOSURE:URL' },
        itunes: {
          season: '2',
          categories: ['cat2']
        }
      },
      {
        guid: 'foo-5',
        enclosure: { url: 'ENCLOSURE:URL' }
      }
    ];
    const mockRssData: IRss = {
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

    test('should be undefined when specific item not found', () => {
      const config: IEmbedConfig = { episodeGuid: 'NOT-THERE' };
      const result = parseRssItems(mockRssData, config);

      expect(result).toBeUndefined();
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

    test('should return target episode as first item', () => {
      const config: IEmbedConfig = {
        showPlaylist: 'all',
        episodeGuid: 'foo-3'
      };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(mockRssItems.length);
      expect(result[0].guid).toBe('foo-3');
    });

    test('should episode as first item when it would have been filtered out.', () => {
      const config: IEmbedConfig = {
        showPlaylist: 'all',
        playlistSeason: 1,
        episodeGuid: 'foo-5'
      };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(3);
      expect(result[0].guid).toBe('foo-5');
    });

    test('should return first item when playlist has no results', () => {
      const config: IEmbedConfig = { showPlaylist: 'all', playlistSeason: 3 };
      const result = parseRssItems(mockRssData, config);

      expect(result.length).toBe(1);
      expect(result[0].guid).toBe('foo-1');
    });

    test('should return undefined when rss has no items', () => {
      const config: IEmbedConfig = { showPlaylist: 'all', playlistSeason: 999 };
      const result = parseRssItems(
        {
          ...mockRssData,
          items: []
        },
        config
      );

      expect(result).toBeUndefined();
    });

    test('should return items sorted by season then episode in ascending order', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(
        {
          ...mockRssData,
          itunes: {
            type: 'serial'
          },
          items: [
            {
              guid: 'GUID:2:1',
              enclosure: { url: 'ENCLOSURE:URL' },
              itunes: {
                season: '2',
                episode: '1'
              }
            },
            {
              guid: 'GUID:1:2',
              enclosure: { url: 'ENCLOSURE:URL' },
              itunes: {
                season: '1',
                episode: '2'
              }
            },
            {
              guid: 'GUID:1:1',
              enclosure: { url: 'ENCLOSURE:URL' },
              itunes: {
                episode: '1'
              }
            },
            {
              guid: 'GUID:2:2',
              enclosure: { url: 'ENCLOSURE:URL' },
              itunes: {
                season: '2',
                episode: '2'
              }
            },
            {
              guid: 'GUID:1:3',
              enclosure: { url: 'ENCLOSURE:URL' },
              itunes: {
                episode: '3'
              }
            }
          ]
        },
        config
      );

      expect(result[0].guid).toBe('GUID:1:1');
      expect(result[1].guid).toBe('GUID:1:2');
      expect(result[2].guid).toBe('GUID:1:3');
      expect(result[3].guid).toBe('GUID:2:1');
      expect(result[4].guid).toBe('GUID:2:2');
    });

    test('should filter out items w/o enclosure', () => {
      const config: IEmbedConfig = { showPlaylist: 'all' };
      const result = parseRssItems(
        {
          ...mockRssData,
          items: [
            ...mockRssData.items,
            {
              guid: 'GUID:NO_ENCLOSURE'
            }
          ]
        },
        config
      );

      expect(result[0].guid).not.toBe('GUID:NO_ENCLOSURE');
    });
  });
});
