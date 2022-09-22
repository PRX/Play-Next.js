import Parser from 'rss-parser';
import type { IRss } from '@interfaces/data';
import { decoratePodcast } from './decoratePodcast';

type CustomFeed = { 'podcast:value': any };
type CustomItem = { 'podcast:value': any };

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    feed: ['podcast:value'],
    item: ['podcast:value']
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
 * @returns Promise for parsed IRSS data object.
 */
const fetchRssFeed = async (feedUrl: string): Promise<IRss> => {
  try {
    const feed = await parser.parseURL(feedUrl);
    return decoratePodcast(feed);
  } catch (err) {
    throw new RssProxyError(err.message, feedUrl);
  }
};

export default fetchRssFeed;
