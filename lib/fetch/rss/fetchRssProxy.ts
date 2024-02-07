import { IRss } from '@interfaces/data';

const fetchRssProxy = async (feedUrl: string) => {
  const apiProxyBaseUrl =
    process.env.API_BASE_URL || 'https://play.prx.org/api';
  const apiProxyUrl = new URL(`${apiProxyBaseUrl}/proxy/rss`);

  apiProxyUrl.searchParams.set('u', feedUrl);

  const rssData = await fetch(apiProxyUrl.toString()).then((resp) =>
    resp.ok ? resp.json() : null
  );

  return rssData as IRss;
};

export default fetchRssProxy;
