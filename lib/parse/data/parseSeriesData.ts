import { IRss, ISeriesData } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/config';
import generateHtmlString from '@lib/generate/html/generateHtmlString';

/**
 * Parse RSS data object into embed data object for series landing page.
 *
 */

const parseSeriesData = (config: IEmbedConfig, rssData?: IRss) => {
  const { imageUrl: configBgImageUrl, episodeImageUrl: configEpisodeImageUrl } =
    config;
  const {
    image: rssImage,
    itunes: rssItunes,
    items: rssItems,
    title,
    description
  } = rssData;
  const { url: rssImageUrl } = rssImage || {};
  const { image: rssItunesImage, summary: rssItunesSummary } = rssItunes || {};
  const bgImageUrl = configBgImageUrl || rssImageUrl || rssItunesImage;
  const imageUrl = configEpisodeImageUrl || rssImageUrl || rssItunesImage;
  const summary = generateHtmlString(rssItunesSummary || description);
  const episodes = rssItems.map((item) => ({
    guid: item.guid,
    title: item.title,
    teaser: item.itunes?.subtitle || item.itunes?.summary,
    pubDate: item.pubDate
  }));

  const data: ISeriesData = {
    bgImageUrl,
    imageUrl,
    title,
    summary,
    episodes
  };

  return data;
};

export default parseSeriesData;
