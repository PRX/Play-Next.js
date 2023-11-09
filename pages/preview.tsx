/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import type { GetServerSideProps } from 'next';
import type { IRss } from '@interfaces/data';
import type { IPageError } from '@interfaces/error';
import type { IPreviewPageProps } from '@interfaces/page';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Error from 'next/error';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Embed from '@components/Embed/Embed';
import generateEmbedUrl from '@lib/generate/string/generateEmbedUrl';
import generateEmbedHtml, {
  generateEmbedStyles,
  getEmbedHeight
} from '@lib/generate/html/generateEmbedHtml';

const PreviewPage = ({ config, rssData, error }: IPreviewPageProps) => {
  const [newConfig, setNewConfig] = useState(config);
  const data = parseEmbedData(newConfig, rssData);
  const embedData = {
    ...data,
    ...(newConfig.showPlaylist &&
      newConfig.showPlaylist !== 'all' &&
      newConfig.showPlaylist > 1 &&
      data.playlist && {
        playlist: data.playlist.slice(0, newConfig.showPlaylist)
      })
  };

  function handlePostMessage(e: MessageEvent) {
    if (!/\.prx\.(org|tech|test)$/.test(e.origin)) return;

    setNewConfig((prevConfig) => ({
      ...prevConfig,
      ...(e.data || {})
    }));
  }

  useEffect(() => {
    const postMessageData = {
      embedUrl: generateEmbedUrl(newConfig),
      embedHtml: generateEmbedHtml(newConfig),
      embedHeight: getEmbedHeight(newConfig),
      embedStyles: generateEmbedStyles(newConfig)
    };

    window.parent.postMessage(postMessageData, '*');
  }, [newConfig]);

  useEffect(() => {
    window.addEventListener('message', handlePostMessage);

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  if (error) {
    return <Error statusCode={error.statusCode} title={error.message} />;
  }

  return (
    <>
      <Head>
        <title>PRX Play - Embeddable Player</title>
      </Head>
      <Embed config={newConfig} data={embedData} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  IPreviewPageProps
> = async ({ query, res }) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParamsToConfig(query);

  // 2. If RSS feed URL is provided...
  let rssData: IRss;
  let error: IPageError;
  try {
    // ...try to fetch the feed...
    rssData = config.feedUrl ? await fetchRssFeed(config.feedUrl) : null;
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

  return {
    props: {
      config,
      rssData,
      ...(error && { error })
    }
  };
};

export default PreviewPage;
