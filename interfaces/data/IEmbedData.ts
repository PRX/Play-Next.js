/**
 * Defines Embed data interfaces and types.
 */

import type { IAudioData } from './IAudioData';
import { IRssPodcastFollowLink } from './IRssPodcast';

/**
 * Embed data interface.
 */
export interface IEmbedData {
  /**
   * Mode the player will be initialized with.
   */
  mode?: 'default' | 'preview';

  /**
   * Audio data player will be initialized with.
   */
  audio: IAudioData;

  /**
   * Collection of audio data to be shown in playlist.
   */
  playlist?: IAudioData[];

  /**
   * URL of image to use in the background of the player.
   */
  bgImageUrl?: string;

  /**
   * Web monetization payment pointer to add to page meta tags.
   */
  paymentPointer?: string;

  /**
   * URL to be used in sharing links.
   */
  shareUrl?: string;

  /**
   * Owner information.
   */
  owner?: {
    name?: string;
    email?: string;
  };

  /**
   * URL's for social platforms to follow the creator on.
   */
  followLinks?: IRssPodcastFollowLink[];

  /**
   * URL's for supporting the podcast.
   */
  supportUrls?: {
    [key: string]: string;
  };

  /**
   * Title of the RSS feed.
   */
  rssTitle?: string;
}
