/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { GetServerSideProps } from 'next';
import { IEmbedData } from '@interfaces/data';
import parseEmbedParams from '@lib/parse/config/parseEmbedParams';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';

const EmbedPage = (props: IEmbedData) => {
  const { audio } = props;
  const { title, url } = audio || {};

  return (
    audio && (
      <>
        <h1>{title}</h1>
        <audio controls src={url}>
          <track kind="captions" />
        </audio>
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
  const embedData = parseEmbedData(config, rssData);

  return {
    props: embedData
  };
};

export default EmbedPage;
