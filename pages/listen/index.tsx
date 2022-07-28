/**
 * @file [episodeId].tsx
 * Landing page to listen to individual episode.
 */

import type { GetServerSideProps } from 'next';
import type { IListenPageProps } from '@interfaces/page';
import parseListenParamsToConfig from '@lib/parse/config/parseListenParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseListenData from '@lib/parse/data/parseListenData';
import Listen from '@components/Listen';

const ListenPage = ({ data, config }: IListenPageProps) => (
  <Listen data={data} config={config} />
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseListenParamsToConfig(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed data.
  const data = parseListenData(config, rssData);

  return {
    props: { config, data }
  };
};

export default ListenPage;
