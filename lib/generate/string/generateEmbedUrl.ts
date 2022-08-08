/**
 * @file generateEmbedUrl.ts
 *
 * Generate embed URL from embed config options.
 */

import type { IEmbedConfig } from '@interfaces/config';
import parseEmbedConfigToParams from '@lib/parse/config/parseEmbedConfigToParams';

const generateEmbedUrl = (config: IEmbedConfig) => {
  const embedUrlHost = typeof window !== 'undefined' && window.location.origin;
  const urlSearchPrams = Object.entries(
    parseEmbedConfigToParams(config)
  ).reduce(
    (a, [k, v]) => [
      ...a,
      ...(Array.isArray(v) ? v.map((cv) => [k, cv]) : [[k, v]])
    ],
    [] as string[][]
  );
  const embedUrlParams = new URLSearchParams(urlSearchPrams);

  embedUrlParams.sort();

  return `${embedUrlHost}/e?${embedUrlParams}`;
};

export default generateEmbedUrl;
