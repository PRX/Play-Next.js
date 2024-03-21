import Parser from 'rss-parser';
import type { IRss } from '@interfaces/data';
import { decoratePodcast } from './decoratePodcast';
import RssProxyError from './RssProxyError';

type CustomFeed = { 'podcast:value': any; 'itunes:type': string };
type CustomItem = {
  'podcast:value': any;
  'podcast:transcript': any;
  itunes: any;
  'itunes:episodeType': string;
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    feed: [
      // @ts-ignore
      ['podcast:value', 'podcast:value', { keepArray: true }],
      'itunes:type'
    ],
    // @ts-ignore
    item: [
      'podcast:value',
      'itunes:episodeType',
      ['podcast:transcript', 'podcast:transcript', { keepArray: true }]
    ]
  }
});

/**
 * Fetch and parse RSS feed URL.
 * @param feedUrl URL to request feed from.
 * @returns Promise for parsed IRss data object.
 */
const fetchRssFeed = async (feedUrl: string): Promise<IRss> => {
  try {
    const feed = await parser.parseURL(feedUrl);

    const decoratedFeed = decoratePodcast(feed);
    const result = {
      ...decoratedFeed,
      ...(decoratedFeed['itunes:type'] && {
        itunes: {
          ...decoratedFeed.itunes,
          type: decoratedFeed['itunes:type']
        },
        items: decoratedFeed.items.map((item) => ({
          ...item,
          itunes: {
            ...item.itunes,
            episodeType: item['itunes:episodeType']
          }
        }))
      })
    };

    return result;
  } catch (err) {
    throw new RssProxyError(err.message, feedUrl);
  }
};

export default fetchRssFeed;
