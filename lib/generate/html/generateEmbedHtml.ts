/**
 * @file generateEmbedHtml.ts
 *
 * Generate embed HTML markup from embed config options.
 */

import {
  IEmbedConfig,
  EmbedConfigKeysMap
} from '@interfaces/embed/IEmbedConfig';

const generateEmbedHtml = (config: IEmbedConfig) => {
  const { showCoverArt, showPlaylist } = config;
  const srcParams = Object.entries(config)
    .map((c: [keyof IEmbedConfig, any]) => {
      const [k, v] = c;
      const prop = EmbedConfigKeysMap.get(k);

      if (prop) {
        switch (typeof v) {
          case 'boolean':
            return v ? `${prop}=1` : '';

          default:
            return v ? `${prop}=${v}` : '';
        }
      }

      return '';
    })
    .filter((v) => !!v)
    .join('&');
  const src = `https://play.prx.org/e?${srcParams}`;
  let height = 200;
  let style = '';

  // Add some height for playlists.
  if (showPlaylist) {
    height += 400;
  }

  // Add some height for cover art and responsive styling.
  if (showCoverArt) {
    height += 800;
    style = `height: calc(100% + ${showPlaylist ? 600 : 200}px)`;
  }

  return `<iframe allow="monetization" frameborder="0" height="${height}" scrolling="no" src="${src}"${
    style && ` style="${style}"`
  } width="100%"></iframe>`;
};

export default generateEmbedHtml;
