/**
 * @file generateEmbedHtml.ts
 *
 * Generate embed HTML markup from embed config options.
 */

import type { IEmbedConfig } from '@interfaces/config';
import generateEmbedUrl from '@lib/generate/string/generateEmbedUrl';
import isVideoMimeType from '@lib/validate/isVideoMimeType';

export const getEmbedHeight = (config: IEmbedConfig) => {
  const { mediaType, showPlaylist } = config;
  const isVideoEmbed = isVideoMimeType(mediaType);
  let height = 200; // Height of audio player UI;

  if (isVideoEmbed) {
    // Video embeds will not have audio player UI.
    height = 0;
  }

  // Add some height for playlists.
  // Playlist header is 56px + 1px bottom border.
  // Playlist episode row height is 60px border.
  if (showPlaylist === 'all' || showPlaylist > 5) {
    // Cap height at 5.5 episode rows and header.
    height += 57 + 324;
  } else if (showPlaylist > 1) {
    // Set height to number of episode rows plus header.
    height += 57 + showPlaylist * 61;
  }

  return height;
};

export const generateEmbedStyles = (config: IEmbedConfig) => {
  const { mediaType, showCoverArt, maxWidth } = config;
  const isVideoEmbed = isVideoMimeType(mediaType);
  const height = getEmbedHeight(config);

  if (isVideoEmbed) {
    const paddingTop = height > 0 ? `calc(56.25% + ${height}px)` : '56.25%';
    return {
      wrapper: `position: relative; height: 0; width: 100%; min-width: 300px;${
        maxWidth
          ? ` max-width: ${maxWidth}px; padding-top: clamp(${
              Math.round(300 * 0.5625) + height
            }px, ${paddingTop}, ${
              Math.round(maxWidth * 0.5625) + height
            }px); margin-inline: auto;`
          : ` padding-top: ${paddingTop};`
      }`,
      iframe: 'position: absolute; inset: 0;'
    };
  }

  if (showCoverArt) {
    return {
      wrapper: `position: relative; height: 0; width: 100%; min-width: 300px;${
        maxWidth
          ? ` max-width: ${maxWidth}px; padding-top: clamp(${
              300 + height
            }px, calc(100% + ${height}px), ${
              maxWidth + height
            }px); margin-inline: auto;`
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
  const src = generateEmbedUrl(config);
  const height = getEmbedHeight(config);
  const styles = generateEmbedStyles(config);

  // Add wrapper div when wrapper styles are generated.
  if (styles.wrapper?.trim().length) {
    return `<div style="${styles.wrapper}"><iframe title="PRX Embed Player" allow="monetization" frameborder="0" height="100%" scrolling="no" src="${src}" style="${styles.iframe}" width="100%"></iframe></div>`;
  }

  return `<iframe title="PRX Embed Player" allow="monetization" frameborder="0" height="${height}" scrolling="no" src="${src}"${
    styles.iframe && ` style="${styles.iframe}"`
  } width="100%"></iframe>`;
};

export default generateEmbedHtml;
