/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import type { GetServerSideProps } from 'next';
import type { IRss } from '@interfaces/data';
import type { IPageError } from '@interfaces/error';
import type { IEmbedPageProps, IPageProps } from '@interfaces/page';
import Head from 'next/head';
import Error from 'next/error';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Embed from '@components/Embed/Embed';

const EmbedPage = ({ config, data, error }: IEmbedPageProps) => {
  if (error) {
    return <Error statusCode={error.statusCode} title={error.message} />;
  }

  return (
    <>
      <Head>
        <title>PRX Play - Embeddable Player</title>
      </Head>
      <Embed config={config} data={data} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({
  query,
  res
}) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParamsToConfig(query);

  // 2. If RSS feed URL is provided...
  let rssData: IRss;
  let error: IPageError;
  try {
    // ...try to fetch the feed...
    rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  } catch (e) {
    switch (e.name) {
      case 'RssProxyError':
        // ...and handle any RssProxyError as a 400.
        res.statusCode = 400;
        error = {
          statusCode: 400,
          message: 'Bad Feed URL Provided'
        };
        break;
      default:
        // ...otherwise throw the caught error so we can get 5XX alarms for anything else.
        throw e;
    }
  }

  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  return {
    props: { config, data, ...(error && { error }) }
  };
};

export default EmbedPage;
