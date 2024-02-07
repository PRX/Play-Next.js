import { IRss } from '@interfaces/data';
import RssProxyError from './RssProxyError';

const fetchRssProxy = async (feedUrl: string) => {
  const apiProxyBaseUrl =
    process.env.API_BASE_URL || 'https://play.prx.org/api';
  const apiProxyUrl = new URL(`${apiProxyBaseUrl}/proxy/rss`);

  apiProxyUrl.searchParams.set('u', feedUrl);

  const response = await fetch(apiProxyUrl.toString());

  if (!response.ok) {
    const { error } = await response.json();
    throw new RssProxyError(error?.message, feedUrl);
  }

  const rssData = await response.json();

  return rssData as IRss;
};

export default fetchRssProxy;
