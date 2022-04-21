import { IRssItem } from '@interfaces/data';
import parseAudioData from './parseAudioData';

describe('lib/parse/data', () => {
  describe('parseAudioData', () => {
    const mockRssItem: IRssItem = {
      guid: 'foo-bar',
      link: '//foo.com/foo-bar',
      title: 'foo',
      enclosure: {
        url: '//foo.com/audio.mp3'
      },
      categories: ['cat1', '  cat2', 'cat3   '],
      itunes: {
        subtitle: 'bar',
        image: '//foo.com/image.png',
        season: '42'
      }
    };

    test('should map expected properties', () => {
      const result = parseAudioData(mockRssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: '//foo.com/foo-bar',
        title: 'foo',
        url: '//foo.com/audio.mp3',
        categories: ['cat1', 'cat2', 'cat3'],
        subtitle: 'bar',
        imageUrl: '//foo.com/image.png',
        season: 42
      });
    });

    test('should handle missing categories property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.categories;
      const result = parseAudioData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: '//foo.com/foo-bar',
        title: 'foo',
        url: '//foo.com/audio.mp3',
        subtitle: 'bar',
        imageUrl: '//foo.com/image.png',
        season: 42
      });
    });

    test('should handle missing itunes property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.itunes;
      const result = parseAudioData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: '//foo.com/foo-bar',
        title: 'foo',
        url: '//foo.com/audio.mp3',
        categories: ['cat1', 'cat2', 'cat3']
      });
    });

    test('should handle missing enclosure property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.enclosure;
      const result = parseAudioData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: '//foo.com/foo-bar',
        title: 'foo',
        categories: ['cat1', 'cat2', 'cat3'],
        subtitle: 'bar',
        imageUrl: '//foo.com/image.png',
        season: 42
      });
    });
  });
});
