import type {
  IEmbedConfig,
  IEmbedParams
} from '@interfaces/embed/IEmbedConfig';
import { EmbedParamKeysMap } from '@interfaces/embed/IEmbedConfig';
import convertStringToBoolean from '@lib/convert/string/convertStringToBoolean';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';

/**
 * Parse query parameters into player config object.
 *
 * @param params Requested query parameters object.
 * @returns Embed Config object
 */
const parseEmbedParamsToConfig = (params: IEmbedParams): IEmbedConfig => {
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

          case 'showCoverArt':
            return {
              ...a,
              [prop]: convertStringToBoolean(v)
            };

          case 'accentColor':
            return {
              ...a,
              [prop]: (Array.isArray(v) ? (v as string[]) : [v])
                .map((ac) =>
                  /^[a-f0-9]{2}[a-f0-9]{2}[a-f0-9]{2}(?:[a-f0-9]{2})?(?:\s1?\d?\d%)?$/i.test(
                    ac
                  )
                    ? `#${ac}`
                    : null
                )
                .filter((ac) => !!ac)
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

export default parseEmbedParamsToConfig;
