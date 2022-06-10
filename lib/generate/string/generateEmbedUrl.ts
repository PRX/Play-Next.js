/**
 * @file generateEmbedUrl.ts
 *
 * Generate embed URL from embed config options.
 */

import type { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseEmbedConfigToParams from '@lib/parse/config/parseEmbedConfigToParams';

const generateEmbedUrl = (config: IEmbedConfig) => {
  const embedUrlHost = typeof window !== 'undefined' && window.location.origin;
  const embedUrlParams = new URLSearchParams({
    ...parseEmbedConfigToParams(config)
  });

  embedUrlParams.sort();

  return `${embedUrlHost}/e?${embedUrlParams}`;
};

export default generateEmbedUrl;
