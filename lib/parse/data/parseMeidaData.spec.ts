import { IRssItem } from '@interfaces/data';
import parseMediaData from './parseMediaData';

describe('lib/parse/data', () => {
  describe('parseMediaData', () => {
    const mockRssItem: IRssItem = {
      guid: 'foo-bar',
      link: 'http://foo.com/foo-bar',
      title: 'foo',
      enclosure: {
        type: 'audio/mpeg',
        url: 'http://foo.com/audio.mp3',
        length: 12345
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
      const result = parseMediaData(mockRssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        sources: [
          {
            type: 'audio/mpeg',
            url: 'http://foo.com/audio.mp3?_from=play.prx.org',
            length: 12345
          }
        ],
        hasAudioSourceAt: 0,
        hasVideoSourceAt: false,
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
      const result = parseMediaData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        sources: [
          {
            type: 'audio/mpeg',
            url: 'http://foo.com/audio.mp3?_from=play.prx.org',
            length: 12345
          }
        ],
        hasAudioSourceAt: 0,
        hasVideoSourceAt: false,
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
      const result = parseMediaData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        sources: [
          {
            type: 'audio/mpeg',
            url: 'http://foo.com/audio.mp3?_from=play.prx.org',
            length: 12345
          }
        ],
        hasAudioSourceAt: 0,
        hasVideoSourceAt: false,
        categories: ['cat1', 'cat2', 'cat3']
      });
    });

    test('should handle missing enclosure property', () => {
      const rssItem = { ...mockRssItem };
      delete rssItem.enclosure;
      const result = parseMediaData(rssItem);

      expect(result).toStrictEqual({
        guid: 'foo-bar',
        link: 'http://foo.com/foo-bar',
        title: 'foo',
        sources: [],
        hasAudioSourceAt: false,
        hasVideoSourceAt: false,
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
