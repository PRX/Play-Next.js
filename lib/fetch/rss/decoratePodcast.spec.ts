import {
  decoratePodcast,
  extractPodcastValue
} from '@lib/fetch/rss/decoratePodcast';

describe('lib/fetch/rss', () => {
  describe('decoratePodcast', () => {
    const mockPodcastValue = [
      {
        $: {
          type: 'lightning',
          method: 'keysend'
        },
        'podcast:valueRecipient': [
          {
            $: {
              name: 'name@domain.com',
              type: 'node',
              address: 'abcd123456',
              split: '100'
            }
          }
        ]
      },
      {
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
      }
    ];

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

    test('should extract podcast:value usable for webmonetization', () => {
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

      expect(
        extractPodcastValue({ 'podcast:value': [{ $: mockPodcastValue[1].$ }] })
          .valueRecipients
      ).toBeUndefined();
    });

    test('should parse and decorate podcast:value items', () => {
      const feed = decoratePodcast({
        ...mockRss,
        items: [mockItem, mockItemValue]
      });
      expect(feed.items[0].podcast).toBeUndefined();
      expect(feed.items[1].podcast).toStrictEqual({
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
