import IEmbedConfig, {
  IEmbedParams,
  EmbedParamKeysMap
} from '@interfaces/embed/IEmbedConfig';

/**
 * Parse query parameters into player config object.
 *
 * @param params Requested query parameters object.
 * @returns PlayerConfig
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
              [prop]:
                ['0', 'false', 'null', 'undefined'].indexOf(v) > -1
                  ? false
                  : !!v
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
