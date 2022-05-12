/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { GetServerSideProps } from 'next';
import { IEmbedData } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseEmbedParams from '@lib/parse/config/parseEmbedParams';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Player from '@components/Player';
import PlayButton from '@components/Player/PlayButton';

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showshowCoverArt } = config;
  const { audio } = data;
  const { title, imageimageUrl } = audio || {};

  return (
    audio && (
      <Player data={audio}>
        {showshowCoverArt && (
          <div className="cover">
            <img src={imageimageUrl} alt="foo" />
          </div>
        )}
        <PlayButton />
      </Player>
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
