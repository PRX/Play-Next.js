import {
  decoratePodcast,
  extractPodcastValue
} from '@lib/fetch/rss/decoratePodcast';

describe('lib/fetch/rss', () => {
  describe('decoratePodcast', () => {
    const mockPodcastValue = {
      $: {
        type: 'webmonetization',
        method: 'ILP'
      },
      'podcast:valueRecipient': [
        {
          $: {
            name: 'Alice',
            type: 'paymentpointer',
            address: '$example.now/~alice',
            split: '100'
          }
        }
      ]
    };

    const mockItem = {
      guid: 'foo-bar',
      link: 'http://foo.com/foo-bar',
      title: 'Foo Bar'
    };

    const mockItemValue = {
      ...mockItem,
      ...{ 'podcast:value': mockPodcastValue }
    };

    const mockRss = {
      'podcast:value': mockPodcastValue,
      items: [mockItem]
    };

    test('should extract podcast:value', () => {
      expect(extractPodcastValue(mockItem)).toBeUndefined();

      expect(extractPodcastValue(mockItemValue)).toStrictEqual({
        type: 'webmonetization',
        method: 'ILP',
        valueRecipients: [
          {
            name: 'Alice',
            type: 'paymentpointer',
            address: '$example.now/~alice',
            split: '100'
          }
        ]
      });
    });

    test('should parse and decorate podcast:value items', () => {
      const feed = decoratePodcast(mockRss);
      const item = feed.items[0];
      expect(item.podcast).toBeUndefined();

      expect(feed.podcast).toStrictEqual({
        value: {
          type: 'webmonetization',
          method: 'ILP',
          valueRecipients: [
            {
              name: 'Alice',
              type: 'paymentpointer',
              address: '$example.now/~alice',
              split: '100'
            }
          ]
        }
      });
    });
  });
});
