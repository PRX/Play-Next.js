/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { GetServerSideProps } from 'next';
import { IEmbedData } from '@interfaces/data';
import parseEmbedParams from '@lib/parse/config/parseEmbedParams';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Player from '@components/Player';
import PlayButton from '@components/Player/PlayButton';

export interface IEmbedPageProps {
  data: IEmbedData;
}

const EmbedPage = ({ data }: IEmbedPageProps) => {
  const { audio } = data;
  const { title } = audio || {};

  return (
    audio && (
      <>
        <h1>{title}</h1>
        <Player data={audio}>
          <PlayButton />
        </Player>
      </>
    )
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParams(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  return {
    props: { data }
  };
};

export default EmbedPage;
