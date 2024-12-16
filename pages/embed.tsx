/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import type { GetServerSideProps } from 'next';
import type { IRss } from '@interfaces/data';
import type { IPageError } from '@interfaces/error';
import type { IEmbedPageProps, IPageProps } from '@interfaces/page';
import Head from 'next/head';
import NextError from 'next/error';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssProxy from '@lib/fetch/rss/fetchRssProxy';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Embed from '@components/Embed/Embed';
import ReqError from '@lib/error/ReqError';

const EmbedPage = ({ config, data, error }: IEmbedPageProps) => {
  if (error) {
    return <NextError statusCode={error.statusCode} title={error.message} />;
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
  req,
  res
}) => {
  // console.info({ req }, 'Embed Request');

  // 1. Convert query params into embed config.
  const config = parseEmbedParamsToConfig(query);

  // 2. If RSS feed URL is provided...
  let rssData: IRss;
  let error: IPageError;
  try {
    // ...try to fetch the feed using RSS proxy API...
    rssData = config.feedUrl && (await fetchRssProxy(config.feedUrl));
  } catch (e) {
    switch (e.name) {
      case 'RssProxyError':
        // ...and handle any RssProxyError as a 400.
        res.statusCode = 400;
        res.setHeader(
          'Cache-Control',
          'no-cache, no-store, max-age=0, must-revalidate'
        );
        error = {
          statusCode: 400,
          message: 'Bad Feed URL Provided'
        };
        break;
      default:
        // ...otherwise throw the caught error so we can get 5XX alarms for anything else.
        throw new ReqError(e, req);
    }
  }

  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  // eslint-disable-next-line no-console
  console.info({ req, res }, 'Embed');

  return {
    props: { config, data, ...(error && { error }) }
  };
};

export default EmbedPage;
