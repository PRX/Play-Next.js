/**
 * @file listen/index.tsx
 * Landing page for podcast using RSS data.
 */

import type { GetServerSideProps } from 'next';
import type { IListenEpisodeData, IRss } from '@interfaces/data';
import type { IListenPageProps, IPageProps } from '@interfaces/page';
import Head from 'next/head';
import Error from 'next/error';
import parseListenParamsToConfig from '@lib/parse/config/parseListenParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseListenData from '@lib/parse/data/parseListenData';
import Listen from '@components/Listen';
import Player from '@components/Player';
import { IPageError } from '@interfaces/error';

const ListenPage = ({ data, config, error }: IListenPageProps) => {
  const { episodeGuid } = config;
  const {
    title: rssTitle,
    link: rssLink,
    content: rssContent,
    bgImageUrl: rssImage,
    episodes
  } = data;
  const episodeIndex =
    episodeGuid && episodes?.findIndex(({ guid }) => guid === episodeGuid);
  const episode = episodes[episodeIndex];
  const {
    title: episodeTitle,
    link: episodeLink,
    contentSnippet: episodeContent,
    imageUrl: episodeImage
  } = episode || ({} as IListenEpisodeData);
  const title = !episode ? rssTitle : `${rssTitle} | ${episodeTitle}`;
  const link = !episode ? rssLink : episodeLink;
  const description = (!episode ? rssContent : episodeContent)?.replace(
    /<[^>]+>/g,
    ''
  );
  const imageUrl = !episode ? rssImage : episodeImage;

  if (error) {
    return <Error statusCode={error.statusCode} title={error.message} />;
  }

  return (
    <>
      <Head>
        <title>
          {title}
          {episode && ` - ${episode.title}`}
        </title>
        <link rel="canonical" href={link} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={link} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={link} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="twitter:description" content={description} />
          </>
        )}
        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta name="twitter:image" content={imageUrl} />
          </>
        )}
      </Head>

      <Player audio={episodes} startIndex={episodeIndex}>
        <Listen data={data} config={config} />
      </Player>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({
  query,
  res
}) => {
  // 1. Convert query params into embed config.
  const config = parseListenParamsToConfig(query);

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

  // 3. Parse config and RSS data into embed
  const data = parseListenData(config, rssData);

  return {
    props: { config, data, ...(error && { error }) }
  };
};

export default ListenPage;
