import type { IEmbedConfig, IEmbedParams } from '@interfaces/config';
import { EmbedParamKeysMap } from '@interfaces/config';
import convertStringToBoolean from '@lib/convert/string/convertStringToBoolean';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';
import parseAccentColorParam from './parseAccentColorParam';

/**
 * Parse query parameters into player config object.
 *
 * @param params Requested query parameters object.
 * @returns Embed Config object
 */
const parseEmbedParamsToConfig = (params: IEmbedParams): IEmbedConfig => {
  const config: IEmbedConfig = Object.entries(params).reduce((a, c) => {
    const [k, v] = c;
    const prop = EmbedParamKeysMap.get(k as keyof IEmbedParams);
    const normalizeValue = (val: string | string[]) =>
      Array.isArray(val) ? val[0] : val;

    if (prop) {
      switch (prop) {
        case 'showPlaylist':
          return {
            ...a,
            [prop]: v === 'all' ? v : convertStringToInteger(normalizeValue(v))
          };

        case 'playlistSeason':
          return {
            ...a,
            [prop]: convertStringToInteger(normalizeValue(v))
          };

        case 'showCoverArt':
          return {
            ...a,
            [prop]: convertStringToBoolean(normalizeValue(v))
          };

        case 'accentColor':
          return {
            ...a,
            [prop]: parseAccentColorParam(v)
          };

        default:
          return {
            ...a,
            [prop]: normalizeValue(v)
          };
      }
    }

    return a;
  }, {} as IEmbedConfig);

  return config;
};

export default parseEmbedParamsToConfig;
