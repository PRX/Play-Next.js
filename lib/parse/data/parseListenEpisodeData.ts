import type { IListenEpisodeData, IRssItem } from '@interfaces/data';
import parseAudioData from './parseAudioData';

/**
 * Parse RSS data item into listen episode data object for use on landing page.
 * @param rssEpisode RSS data object.
 * @returns Embed data object.
 */
const parseListenEpisodeData = (rssEpisode?: IRssItem): IListenEpisodeData => {
  const { itunes, pubDate } = rssEpisode;
  const { subtitle } = itunes || {};
  const episodeAudio = parseAudioData(rssEpisode);
  const content =
    rssEpisode['content:encoded'] ||
    rssEpisode.content ||
    rssEpisode.itunes?.summary;
  const contentSnippet =
    rssEpisode['content:encodedSnippet'] ||
    rssEpisode.contentSnippet ||
    rssEpisode.itunes?.summary;

  const data: IListenEpisodeData = {
    ...episodeAudio,
    content,
    contentSnippet,
    pubDate,
    ...(subtitle && { subtitle })
  };

  return data;
};

export default parseListenEpisodeData;
