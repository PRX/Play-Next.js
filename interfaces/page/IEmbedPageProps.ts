import { IEmbedConfig } from '@interfaces/config';
import { IEmbedData } from '@interfaces/data';
import { IPageProps } from './IPageProps';

export interface IEmbedPageProps extends IPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}
