import Parser from 'rss-parser';

const parser: Parser<Parser.Output<Parser.Item>, Parser.Item> = new Parser();

/**
 * Fetch and parse RSS feed URL.
 * @param feedUrl URL to request feed from.
 * @returns Parsed RSS data object.
 */
const fetchRssFeed = async (feedUrl: string) => {
  try {
    const feed = await parser.parseURL(feedUrl);

    return feed;
  } catch (err) {
    return {
      error: `Unable to fetch feed from ${feedUrl}`
    };
  }
};

export default fetchRssFeed;
