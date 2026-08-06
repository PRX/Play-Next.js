import { IEmbedConfig } from '@interfaces/config';
import { IEmbedData } from '@interfaces/data';

export interface IEmbedProps {
  config: IEmbedConfig;
  data: IEmbedData;

  /**
   * Mode the player will be initialized with.
   */
  mode?: 'default' | 'preview';
}
