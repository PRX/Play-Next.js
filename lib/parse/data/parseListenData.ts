import type { IListenData, IListenEpisodeData, IRss } from '@interfaces/data';
import type { IListenConfig } from '@interfaces/config';
import generateHtmlString from '@lib/generate/html/generateHtmlString';
import getServiceFromUrl from '@lib/parse/string/getServiceFromUrl';
import parseListenEpisodeData from './parseListenEpisodeData';
import parseRssItems from './parseRssItems';

/**
 * Parse RSS data object into listen data object for use on listen page.
 * @param config Embed config object.
 * @param rssData RSS data object.
 * @returns Listen data object.
 */
const parseListenData = (
  config: IListenConfig,
  rssData?: IRss
): IListenData => {
  const { feedUrl, subscribeUrl } = config;
  const {
    title,
    link,
    image: rssImage,
    itunes,
    copyright,
    description,
    podcast
  } = rssData || {};
  const { follow: podcastFollow } = podcast || {};
  const { data: podcastFollowData } = podcastFollow || {};
  const { url: rssImageUrl } = rssImage || {};
  const {
    author: rssItunesAuthor,
    image: rssItunesImage,
    owner: rssItunesOwner,
    summary: rssItunesSummary
  } = itunes || {};
  const episodes = parseRssItems(
    rssData,
    {
      // Default to showing all items in feed. Allow config to override.
      showPlaylist: 'all',
      ...config
    },
    parseListenEpisodeData
  ) as IListenEpisodeData[];
  const hasRssData = !!(feedUrl && rssData);
  const bgImageUrl = rssItunesImage || rssImageUrl;
  const content = generateHtmlString(rssItunesSummary || description);
  const followLinks = [
    ...(podcastFollowData?.links
      ? podcastFollowData.links.map((l) => ({
          ...l,
          service: getServiceFromUrl(l.href) || null
        }))
      : []),
    ...(subscribeUrl || feedUrl
      ? [{ href: subscribeUrl || feedUrl, text: 'RSS Feed', service: 'rss' }]
      : [])
  ];

  const data: IListenData = {
    ...(bgImageUrl && { bgImageUrl }),
    ...(hasRssData && {
      link,
      title,
      content,
      ...(copyright && { copyright }),
      ...(rssItunesAuthor && { author: rssItunesAuthor }),
      ...(rssItunesOwner && { owner: rssItunesOwner }),
      ...(episodes && episodes.length && { episodes })
    }),
    followLinks
  };

  return data;
};

export default parseListenData;
