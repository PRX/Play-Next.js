import type Parser from 'rss-parser';
import { IRssItem, ISeriesData } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';

/**
 * Parse RSS data object into embed data object for series landing page.
 *
 */

const parseSeriesData = (
  config: IEmbedConfig,
  rssData?: Parser.Output<IRssItem>
) => {
  const { imageUrl: configBgImageUrl } = config;
  const {
    image: rssImage,
    itunes: rssItunes,
    items: rssItems,
    title: rssTitle
  } = rssData;
  const { url: rssImageUrl } = rssImage || {};
  const { image: rssItunesImage } = rssItunes || {};
  const;
  const bgImageUrl = configBgImageUrl || rssImageUrl || rssItunesImage;
  const imageUrl = rssImage || {};
  const title = rssTitle || {};

  const data: ISeriesData = {
    bgImageUrl,
    imageUrl,
    title,
    summary,
    guid,
    teaser,
    pubDate
  };

  return data;
};

export default parseSeriesData;
