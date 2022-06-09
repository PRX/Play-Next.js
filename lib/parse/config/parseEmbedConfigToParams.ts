import {
  IEmbedConfig,
  IEmbedParams,
  EmbedConfigKeysMap
} from '@interfaces/embed/IEmbedConfig';

/**
 * Parse embed config object into query parameters object.
 *
 * @param config Embed config object.
 * @returns Embed params object.
 */
const parseEmbedConfigToParams = (config: IEmbedConfig): IEmbedParams => {
  const params: IEmbedParams = Object.entries(config).reduce(
    (a, c: [keyof IEmbedConfig, string]) => {
      const [k, v] = c;
      const prop = EmbedConfigKeysMap.get(k);

      if (prop && v) {
        switch (typeof v) {
          case 'boolean':
            return {
              ...a,
              [prop]: 1
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
