import { IEmbedConfig } from '@interfaces/config';
import { IPageError } from '@interfaces/error';

export interface IPageProps {
  config: IEmbedConfig;
  error?: IPageError;
}
