/**
 * Defines listen page data interfaces and types.
 */

import { IListenEpisodeData } from './IListenEpisodeData';
import { IRssPodcastFollowLink } from './IRssPodcast';

export interface IListenData {
  /**
   * URL of image to use in the background of the player.
   */
  bgImageUrl: string;

  /**
   * Title of the podcast.
   */
  title: string;

  /**
   * Author name.
   */
  author: string;

  /**
   * Owner information.
   */
  owner?: {
    name?: string;
    email?: string;
  };

  /**
   * Copyright string.
   */
  copyright: string;

  /**
   * HTML content describing the podcast.
   */
  content: string;

  /**
   * URL to for the podcast website. Use for podcast info share links.
   */
  link?: string;

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
   * Web monetization payment pointer to add to page meta tags.
   */
  paymentPointer?: string;

  /**
   * Array of episode data for rendering playlist and episode info content.
   */
  episodes: IListenEpisodeData[];
}
