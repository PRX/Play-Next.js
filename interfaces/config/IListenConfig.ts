/**
 * Defines listen config interfaces and types.
 */

import { ParsedUrlQuery } from 'querystring';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! If these change ALL EXISTING EMBEDS WILL BREAK !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * Parameter object keys expected from requests.
 */
export interface IListenParams extends ParsedUrlQuery {
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
   * Provide a custom accent color.
   */
  ac?: string | string[];

  /**
   * Choose color theme.
   */
  th?: string | string[];
}

/**
 * Embed config object.
 */
export interface IListenConfig {
  feedUrl?: string;
  episodeGuid?: string;
  subscribeUrl?: string;
  showPlaylist?: number | 'all';
  playlistSeason?: number;
  playlistCategory?: string;
  accentColor?: string[];
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Map of embed parameter keys to embed config property keys.
 */
export const ListenParamKeysMap: Map<keyof IListenParams, keyof IListenConfig> =
  new Map();
ListenParamKeysMap.set('uf', 'feedUrl');
ListenParamKeysMap.set('ge', 'episodeGuid');
ListenParamKeysMap.set('us', 'subscribeUrl');
ListenParamKeysMap.set('sp', 'showPlaylist');
ListenParamKeysMap.set('se', 'playlistSeason');
ListenParamKeysMap.set('ct', 'playlistCategory');
ListenParamKeysMap.set('ac', 'accentColor');
ListenParamKeysMap.set('th', 'theme');

/**
 * Map of embed config property keys to embed parameter keys.
 */
export const ListenConfigKeysMap: Map<
  keyof IListenConfig,
  keyof IListenParams
> = new Map();
ListenConfigKeysMap.set('feedUrl', 'uf');
ListenConfigKeysMap.set('episodeGuid', 'ge');
ListenConfigKeysMap.set('subscribeUrl', 'us');
ListenConfigKeysMap.set('showPlaylist', 'sp');
ListenConfigKeysMap.set('playlistSeason', 'se');
ListenConfigKeysMap.set('playlistCategory', 'ct');
ListenConfigKeysMap.set('accentColor', 'ac');
ListenConfigKeysMap.set('theme', 'th');
