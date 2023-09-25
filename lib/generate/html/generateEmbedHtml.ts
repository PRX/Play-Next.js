/**
 * @file generateEmbedHtml.ts
 *
 * Generate embed HTML markup from embed config options.
 */

import type { IEmbedConfig } from '@interfaces/config';
import generateEmbedUrl from '@lib/generate/string/generateEmbedUrl';

export const getEmbedHeight = (config: IEmbedConfig) => {
  const { showPlaylist } = config;
  let height = 200;

  // Add some height for playlists.
  // Playlist header is 56px + 1px bottom border.
  // Playlist episode row height is 60px border.
  if (showPlaylist === 'all' || showPlaylist > 5) {
    // Cap height at 5.5 episode rows and header.
    height += 57 + 324;
  } else if (showPlaylist > 1) {
    // Set height ti number of episode rows plus header.
    height += 57 + showPlaylist * 61;
  }

  return height;
};

export const generateEmbedStyles = (config: IEmbedConfig) => {
  const { showCoverArt, maxWidth } = config;
  const height = getEmbedHeight(config);

  if (showCoverArt) {
    return {
      wrapper: `position: relative; height: 0; width: 100%; min-width: 300px;${
        maxWidth
          ? ` padding-top: clamp(${300 + height}px, calc(100% + ${height}px), ${
              maxWidth + height
            }px); margin-inline: auto; max-width: ${maxWidth}px;`
          : ` padding-top: calc(100% + ${height}px);`
      }`,
      iframe: 'position: absolute; inset: 0;'
    };
  }

  return {
    wrapper: '',
    iframe: maxWidth
      ? `display: block; margin-inline: auto; min-width: 300px; max-width: ${maxWidth}px;`
      : 'min-width: 300px;'
  };
};

const generateEmbedHtml = (config: IEmbedConfig) => {
  const { showCoverArt } = config;
  const src = generateEmbedUrl(config);
  const height = getEmbedHeight(config);
  const styles = generateEmbedStyles(config);

  // Add some height for cover art and responsive styling.
  if (showCoverArt) {
    return `<div style="${styles.wrapper}"><iframe allow="monetization" frameborder="0" height="100%" scrolling="no" src="${src}" style="${styles.iframe}" width="100%"></iframe></div>`;
  }

  return `<iframe allow="monetization" frameborder="0" height="${height}" scrolling="no" src="${src}"${
    styles.iframe && ` style="${styles.iframe}"`
  } width="100%"></iframe>`;
};

export default generateEmbedHtml;
