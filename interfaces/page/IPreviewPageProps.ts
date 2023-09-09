import { IEmbedConfig } from '@interfaces/config';
import { IRss } from '@interfaces/data';
import { IPageProps } from './IPageProps';

export interface IPreviewPageProps extends IPageProps {
  config: IEmbedConfig;
  rssData: IRss;
}
