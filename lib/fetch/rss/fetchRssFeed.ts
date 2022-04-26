import { IRssProxyError } from '@interfaces/error/IRssProxyError';
import Parser from 'rss-parser';

const parser: Parser<Parser.Output<Parser.Item>, Parser.Item> = new Parser();

/**
 * Fetch and parse RSS feed URL.
 * @param feedUrl URL to request feed from.
 * @returns Parsed RSS data object.
 */
const fetchRssFeed = async (feedUrl: string) => {
  let error: IRssProxyError;
  const feed: Parser.Output<Parser.Item> = await parser.parseURL(feedUrl).then(
    (resp) => resp,
    (reason: Error) => {
      error = {
        name: 'RssProxyError',
        message: `Bad URL Provided. Reason: ${reason.message}`,
        url: feedUrl
      };
      return null;
    }
  );

  return !error
    ? feed
    : {
        error
      };
};

export default fetchRssFeed;
