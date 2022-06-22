import { IRssItem } from '@interfaces/data';
import parseAudioData from './parseAudioData';

describe('lib/parse/data', () => {
  describe('parseAudioData', () => {
    const mockRssItem: IRssItem = {
      guid: 'foo-bar',
      link: 'http://foo.com/foo-bar',
      title: 'foo',
      enclosure: {
        url: 'http://foo.com/audio.mp3'
      },
      categories: ['cat1', '  cat2', 'cat3   '],
      itunes: {
        subtitle: 'bar',
        image: 'http://foo.com/image.png',
        season: '42',
        duration: '12:34',
        explicit: 'true'
      }
    };

    test('should map expected properties', () => {
      const result = parseAudioData(mockRssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        url: 'http://foo.com/audio.mp3?_from=play.prx.org',
        categories: ['cat1', 'cat2', 'cat3'],
        subtitle: 'bar',
        imageUrl: 'http://foo.com/image.png',
        season: 42,
        duration: '12:34',
        explicit: true
      });
    });

    test('should handle missing categories property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.categories;
      const result = parseAudioData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        url: 'http://foo.com/audio.mp3?_from=play.prx.org',
        subtitle: 'bar',
        imageUrl: 'http://foo.com/image.png',
        season: 42,
        duration: '12:34',
        explicit: true
      });
    });

    test('should handle missing itunes property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.itunes;
      const result = parseAudioData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        url: 'http://foo.com/audio.mp3?_from=play.prx.org',
        categories: ['cat1', 'cat2', 'cat3']
      });
    });

    test('should handle missing enclosure property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.enclosure;
      const result = parseAudioData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        categories: ['cat1', 'cat2', 'cat3'],
        subtitle: 'bar',
        imageUrl: 'http://foo.com/image.png',
        season: 42,
        duration: '12:34',
        explicit: true
      });
    });
  });
});
