import Parser from 'rss-parser';
import type { IRss } from '@interfaces/data';
import { decoratePodcast } from './decoratePodcast';

type CustomFeed = { 'podcast:value': any; 'itunes:type': string };
type CustomItem = {
  'podcast:value': any;
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
    item: ['podcast:value', 'itunes:episodeType']
  }
});

class RssProxyError extends Error {
  public url: string;

  constructor(message: string, url: string) {
    super(message);
    this.name = 'RssProxyError';
    this.message = message;
    this.url = url;
  }
}

/**
 * Fetch and parse RSS feed URL.
 * @param feedUrl URL to request feed from.
 * @returns Promise for parsed IRss data object.
 */
const fetchRssFeed = async (feedUrl: string): Promise<IRss> => {
  try {
    const feed = await parser.parseURL(feedUrl);

    const result = {
      ...decoratePodcast(feed),
      ...(feed['itunes:type'] && {
        itunes: {
          ...feed.itunes,
          type: feed['itunes:type']
        },
        items: feed.items.map((item) => ({
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
