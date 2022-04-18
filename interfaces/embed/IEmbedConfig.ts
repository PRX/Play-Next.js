/**
 * Defines embed config interfaces and types.
 */

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! If these change ALL EXISTING EMBEDS WILL BREAK !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * Parameter object keys expected from requests.
 */
export interface IEmbedParams {
  tt?: string;
  ts?: string;
  tc?: string;
  ua?: string;
  ui?: string;
  ue?: string;
  uf?: string;
  if?: string;
  ge?: string;
  uc?: string;
  us?: string;
  gs?: string;
  gc?: string;
  sp?: string;
  se?: string;
  ct?: string;
}

/**
 * Embed config object.
 */
interface IEmbedConfig extends URLSearchParams {
  title?: string;
  subtitle?: string;
  ctaTitle?: string;
  audioUrl?: string;
  imageUrl?: string;
  epImageUrl?: string;
  feedUrl?: string;
  feedId?: string;
  episodeGuid?: string;
  ctaUrl?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  ctaTarget?: string;
  showPlaylist?: boolean;
  playlistSeason?: string;
  playlistCategory?: string;
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
EmbedParamKeysMap.set('ue', 'epImageUrl');
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

export default IEmbedConfig;
