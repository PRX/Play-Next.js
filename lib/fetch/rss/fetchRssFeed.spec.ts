import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';

describe('lib/fetch/rss', () => {
  describe('fetchRssFeed', () => {
    const valueUrl = 'https://prx-tech.s3.amazonaws.com/test/feed/feed-rss.xml';

    test('should retrieve rss with podcast:value', async () => {
      const feed = await fetchRssFeed(valueUrl);
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
