/**
 * @file generateEmbedHtml.ts
 *
 * Generate embed HTML markup from embed config options.
 */

import type { IEmbedConfig } from '@interfaces/embed';
import generateEmbedUrl from '@lib/generate/string/generateEmbedUrl';

const generateEmbedHtml = (config: IEmbedConfig) => {
  const { showCoverArt, showPlaylist } = config;
  const src = generateEmbedUrl(config);
  let height: number | string = 200;
  let style = '';
  let wrapper = (children: string) => children;

  // Add some height for playlists.
  if (showPlaylist) {
    height += 400;
  }

  // Add some height for cover art and responsive styling.
  if (showCoverArt) {
    height = '100%';
    style = 'position: absolute; inset: 0;';
    wrapper = (children: string) =>
      `<div style="position: relative; height: 0; width: 100%; padding-top: calc(100% + ${
        showPlaylist ? 600 : 200
      }px);">${children}</div>`;
  }

  return wrapper(
    `<iframe allow="monetization" frameborder="0" height="${height}" scrolling="no" src="${src}"${
      style && ` style="${style}"`
    } width="100%"></iframe>`
  );
};

export default generateEmbedHtml;
