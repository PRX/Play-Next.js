import type Parser from 'rss-parser';
import { IAudioData, IListenPageData, IRssItem } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseAudioData from './parseAudioData';

/**
 * Parse RSS data object into embed data object for use on embed page.
 * @param config Embed config object.
 * @param rssData RSS data object.
 * @returns Embed data object.
 */
const parseListenData = (
  config: IEmbedConfig,
  rssData?: Parser.Output<IRssItem>
): IListenPageData => {
  const { episodeGuid, imageUrl: configBgImageUrl } = config;
  const {
    image: rssImage,
    itunes: rssItunes,
    items: rssItems,
    title: rssTitle
  } = rssData;
  const { url: rssImageUrl } = rssImage || {};
  const { image: rssItunesImage } = rssItunes || {};
  const rssEpisode = rssItems.find((item) => item.guid === episodeGuid);
  const episodeAudio = {
    ...parseAudioData(rssEpisode),
    subtitle: rssTitle
  } as IAudioData;
  const bgImageUrl =
    configBgImageUrl || rssImageUrl || rssItunesImage || episodeAudio.imageUrl;
  const content =
    rssEpisode['content:encoded'] ||
    rssEpisode.content ||
    rssEpisode.itunes?.summary;
  const title = rssEpisode.itunes?.subtitle || rssEpisode.title;

  const data: IListenPageData = {
    episodeAudio,
    bgImageUrl,
    content,
    title
  };

  return data;
};

export default parseListenData;
