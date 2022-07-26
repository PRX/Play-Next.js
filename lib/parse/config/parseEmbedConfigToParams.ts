import type { IEmbedConfig, IEmbedParams } from '@interfaces/embed';
import { EmbedConfigKeysMap } from '@interfaces/embed';

/**
 * Parse embed config object into query parameters object.
 *
 * @param config Embed config object.
 * @returns Embed params object.
 */
const parseEmbedConfigToParams = (config: IEmbedConfig): IEmbedParams => {
  const params: IEmbedParams = Object.entries(config).reduce(
    (a, c: [keyof IEmbedConfig, any]) => {
      const [k, v] = c;
      const prop = EmbedConfigKeysMap.get(k);

      if (prop && v) {
        switch (k) {
          case 'showCoverArt':
            return {
              ...a,
              [prop]: 1
            };

          case 'accentColor':
            return {
              ...a,
              [prop]: v.map((ac: string) => ac.replace(/^#/, '')) // Remove '#' prefix.
            };

          default:
            return {
              ...a,
              [prop]: v
            };
        }
      }

      return a;
    },
    {} as IEmbedParams
  );

  return params;
};

export default parseEmbedConfigToParams;
