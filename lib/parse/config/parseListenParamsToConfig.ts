import type { IListenConfig, IListenParams } from '@interfaces/config';
import { EmbedParamKeysMap } from '@interfaces/config';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';
import parseAccentColorParam from './parseAccentColorParam';

/**
 * Parse query parameters into listen config object.
 *
 * @param params Requested query parameters object.
 * @returns Listen Config object
 */
const parseListenParamsToConfig = (params: IListenParams): IListenConfig => {
  const config: IListenConfig = Object.entries(params).reduce((a, c) => {
    const [k, v] = c;
    const prop = EmbedParamKeysMap.get(k as keyof IListenParams);
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
  }, {} as IListenConfig);

  return config;
};

export default parseListenParamsToConfig;
