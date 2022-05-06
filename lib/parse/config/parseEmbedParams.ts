import {
  IEmbedConfig,
  IEmbedParams,
  EmbedParamKeysMap
} from '@interfaces/embed/IEmbedConfig';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';

/**
 * Parse query parameters into player config object.
 *
 * @param params Requested query parameters object.
 * @returns Embed Config object
 */
const parseEmbedParams = (params: IEmbedParams): IEmbedConfig => {
  const config: IEmbedConfig = Object.entries(params).reduce(
    (a, c: [keyof IEmbedParams, string]) => {
      const [k, v] = c;
      const prop = EmbedParamKeysMap.get(k);

      if (prop) {
        switch (prop) {
          case 'showPlaylist':
            return {
              ...a,
              [prop]: v === 'all' ? v : convertStringToInteger(v)
            };

          case 'playlistSeason':
            return {
              ...a,
              [prop]: convertStringToInteger(v)
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
    {} as IEmbedConfig
  );

  return config;
};

export default parseEmbedParams;
