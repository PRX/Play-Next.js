/**
 * Defines embed config interfaces and types.
 */

import { ParsedUrlQuery } from 'querystring';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! If these change ALL EXISTING EMBEDS WILL BREAK !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * Parameter object keys expected from requests.
 */
export interface IEmbedParams extends ParsedUrlQuery {
  /**
   * Use to override title initially shown in player.
   */
  tt?: string | string[];

  /**
   * Use to override subtitle of all audio items.
   */
  ts?: string | string[];

  /**
   * Use to override audio url of initially loaded audio.
   */
  ua?: string | string[];

  /**
   * Use to override URL of image initial shown as player background.
   */
  ui?: string | string[];

  /**
   * Use to override URL of image initial shown as thumbnail in player.
   */
  ue?: string | string[];

  /**
   * Use to provide URL for RSS feed data.
   */
  uf?: string | string[];

  /**
   * Guid of episode in feed items to use for initial audio in player.
   */
  ge?: string | string[];

  /**
   * Use to override subscription URL when it should differ
   * from data source RSS feed provided by `uf` or when `ua` is used
   * without `uf`.
   */
  us?: string | string[];

  /**
   * Target window to open subscription URL in.
   */
  gs?: string | string[];

  /**
   * Use to indicate a playlist should be shown. Set to an integer value
   * for the number of items to include in playlist, or `all` to include
   * everything in the feed. Requires RSS feed URL be provided with `uf`.
   */
  sp?: string | string[];

  /**
   * Use to filter playlist items by episode season. Requires `sp` and `uf`
   * values be provided.
   */
  se?: string | string[];

  /**
   * Use to filter playlist items by single category. Requires `sp` and `uf`
   * values be provided.
   */
  ct?: string | string[];

  /**
   * Use to feature episode image as large cover art.
   */
  ca?: string | string[];

  /**
   * Provide a custom accent color.
   */
  ac?: string | string[];

  /**
   * Choose color theme.
   */
  th?: string | string[];

  /**
   * DEPRECATED
   * Use to set call to action text.
   */
  tc?: string | string[];

  /**
   * DEPRECATED
   * Use to provide a call to action URL.
   */
  uc?: string | string[];

  /**
   * DEPRECATED
   * Target window to open call to action URL in.
   */
  gc?: string | string[];

  /**
   * DEPRECATED
   * Use to provide the ID of a RSS feed.
   */
  if?: string | string[];
}

/**
 * Embed config object.
 */
export interface IEmbedConfig {
  title?: string;
  subtitle?: string;
  ctaTitle?: string;
  audioUrl?: string;
  imageUrl?: string;
  episodeImageUrl?: string;
  feedUrl?: string;
  feedId?: string;
  episodeGuid?: string;
  ctaUrl?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  ctaTarget?: string;
  showPlaylist?: number | 'all';
  playlistSeason?: number;
  playlistCategory?: string;
  showCoverArt?: boolean;
  accentColor?: string[];
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Map of embed parameter keys to embed config property keys.
 */
export const EmbedParamKeysMap: Map<keyof IEmbedParams, keyof IEmbedConfig> =
  new Map();
EmbedParamKeysMap.set('tt', 'title');
EmbedParamKeysMap.set('ts', 'subtitle');
EmbedParamKeysMap.set('tc', 'ctaTitle');
EmbedParamKeysMap.set('ua', 'audioUrl');
EmbedParamKeysMap.set('ui', 'imageUrl');
EmbedParamKeysMap.set('ue', 'episodeImageUrl');
EmbedParamKeysMap.set('uf', 'feedUrl');
EmbedParamKeysMap.set('if', 'feedId');
EmbedParamKeysMap.set('ge', 'episodeGuid');
EmbedParamKeysMap.set('uc', 'ctaUrl');
EmbedParamKeysMap.set('us', 'subscribeUrl');
EmbedParamKeysMap.set('gs', 'subscribeTarget');
EmbedParamKeysMap.set('gc', 'ctaTarget');
EmbedParamKeysMap.set('sp', 'showPlaylist');
EmbedParamKeysMap.set('se', 'playlistSeason');
EmbedParamKeysMap.set('ct', 'playlistCategory');
EmbedParamKeysMap.set('ca', 'showCoverArt');
EmbedParamKeysMap.set('ac', 'accentColor');
EmbedParamKeysMap.set('th', 'theme');

/**
 * Map of embed config property keys to embed parameter keys.
 */
export const EmbedConfigKeysMap: Map<keyof IEmbedConfig, keyof IEmbedParams> =
  new Map();
EmbedConfigKeysMap.set('title', 'tt');
EmbedConfigKeysMap.set('subtitle', 'ts');
EmbedConfigKeysMap.set('ctaTitle', 'tc');
EmbedConfigKeysMap.set('audioUrl', 'ua');
EmbedConfigKeysMap.set('imageUrl', 'ui');
EmbedConfigKeysMap.set('episodeImageUrl', 'ue');
EmbedConfigKeysMap.set('feedUrl', 'uf');
EmbedConfigKeysMap.set('feedId', 'if');
EmbedConfigKeysMap.set('episodeGuid', 'ge');
EmbedConfigKeysMap.set('ctaUrl', 'uc');
EmbedConfigKeysMap.set('subscribeUrl', 'us');
EmbedConfigKeysMap.set('subscribeTarget', 'gs');
EmbedConfigKeysMap.set('ctaTarget', 'gc');
EmbedConfigKeysMap.set('showPlaylist', 'sp');
EmbedConfigKeysMap.set('playlistSeason', 'se');
EmbedConfigKeysMap.set('playlistCategory', 'ct');
EmbedConfigKeysMap.set('showCoverArt', 'ca');
EmbedConfigKeysMap.set('accentColor', 'ac');
EmbedConfigKeysMap.set('theme', 'th');
