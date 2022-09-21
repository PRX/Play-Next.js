import Parser from 'rss-parser';
import type { IRss, IRssItem } from '@interfaces/data';
import {
  IRssPodcastValue,
  IRssPodcastValueRecipient
} from '@interfaces/data/IRssPodcast';

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

const extractPodcastValue = (data): IRssPodcastValue => {
  const recipients: IRssPodcastValueRecipient[] = data['podcast:value']?.[
    'podcast:valueRecipient'
  ].map((recipient) => ({
    ...recipient.$
  }));

  const podcastValue: IRssPodcastValue = data['podcast:value'] && {
    ...data['podcast:value'].$,
    ...(recipients?.length > 0 && { valueRecipients: recipients })
  };

  return podcastValue;
};

const decoratePodcast = (feed: Parser.Output<CustomFeed>): IRss => {
  const feedItems: IRssItem[] = feed.items.map((item) => {
    const itemVal = extractPodcastValue(item);
    return {
      ...item,
      ...(itemVal && { podcast: { value: itemVal } })
    } as IRssItem;
  });

  const feedVal = extractPodcastValue(feed);
  const rssData: IRss = {
    ...feed,
    ...{ items: feedItems },
    ...(feedVal && { podcast: { value: feedVal } })
  };

  delete rssData['podcast:value'];

  return rssData;
};

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
