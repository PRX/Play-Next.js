import {
  decoratePodcast,
  extractPodcastTranscript,
  extractPodcastValue,
  extractPodcastFollow
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
    const mockPodcastTranscript = [
      {
        $: {
          url: 'http://foo.com/transcript',
          type: 'text/html'
        }
      },
      {
        $: {
          url: 'http://foo.com/transcript.srt',
          type: 'application/srt'
        }
      }
    ];
    const mockPodcastFollow = {
      $: {
        url: 'http://foo.com/subscribelinks.json'
      }
    };

    const mockItem = {
      guid: 'foo-bar',
      link: 'http://foo.com/foo-bar',
      title: 'Foo Bar'
    };

    const mockItemWithPodcastProps = {
      ...mockItem,
      'podcast:value': mockPodcastValue,
      'podcast:transcript': mockPodcastTranscript
    };

    const mockRss = {
      'podcast:follow': mockPodcastFollow,
      'podcast:value': mockPodcastValue,
      items: [mockItem]
    };

    test('should extract podcast:follow', () => {
      expect(extractPodcastFollow(mockRss)).toEqual(mockPodcastFollow.$);
    });

    test('should extract podcast:value usable for webmonetization', () => {
      expect(extractPodcastValue(mockItem)).toBeUndefined();

      expect(extractPodcastValue(mockItemWithPodcastProps)).toStrictEqual({
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

    test('should extract podcast:transcript prop', () => {
      expect(extractPodcastTranscript(mockItem)).toBeUndefined();

      expect(extractPodcastTranscript(mockItemWithPodcastProps)).toStrictEqual([
        {
          url: 'http://foo.com/transcript',
          type: 'text/html'
        },
        {
          url: 'http://foo.com/transcript.srt',
          type: 'application/srt'
        }
      ]);
    });

    test('should parse and decorate podcast props', () => {
      const feed = decoratePodcast({
        ...mockRss,
        items: [mockItem, mockItemWithPodcastProps]
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
        },
        transcript: [
          {
            url: 'http://foo.com/transcript',
            type: 'text/html'
          },
          {
            url: 'http://foo.com/transcript.srt',
            type: 'application/srt'
          }
        ]
      });

      expect(feed.podcast).toStrictEqual({
        follow: { url: 'http://foo.com/subscribelinks.json' },
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
