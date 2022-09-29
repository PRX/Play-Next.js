import { IListenConfig } from '@interfaces/config';
import { IListenData } from '@interfaces/data';
import { IPageProps } from './IPageProps';

export interface IListenPageProps extends IPageProps {
  config: IListenConfig;
  data: IListenData;
}
