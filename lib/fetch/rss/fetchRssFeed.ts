import Parser from 'rss-parser';

const parser: Parser<Parser.Output<Parser.Item>, Parser.Item> = new Parser();

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
 * @returns Parsed RSS data object.
 */
const fetchRssFeed = async (feedUrl: string) => {
  try {
    return await parser.parseURL(feedUrl);
  } catch (err) {
    throw new RssProxyError(err.message, feedUrl);
  }
};

export default fetchRssFeed;
