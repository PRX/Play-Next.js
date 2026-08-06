/**
 * Defines episode data interfaces and types.
 */

import { IListenMediaData } from './IListenMediaData';

export interface IListenEpisodeData extends IListenMediaData {
  /**
   * Subtitle for the episode for use in playlist.
   */
  subtitle: string;

  /**
   * HTML content for the episode for use in episode info.
   */
  content: string;

  /**
   * Snippet of content used for meta tags descriptions.
   */
  contentSnippet: string;

  /**
   * Date episode was published.
   */
  pubDate: string;
}
