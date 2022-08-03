/**
 * @file [episodeId].tsx
 * Landing page to listen to individual episode.
 */

import type { GetServerSideProps } from 'next';
import type { IListenEpisodeData } from '@interfaces/data';
import type { IListenPageProps } from '@interfaces/page';
import parseListenParamsToConfig from '@lib/parse/config/parseListenParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseListenData from '@lib/parse/data/parseListenData';
import Listen from '@components/Listen';
import Head from 'next/head';

const ListenPage = ({ data, config }: IListenPageProps) => {
  const { episodeGuid } = config;
  const {
    title: rssTitle,
    link: rssLink,
    content: rssContent,
    bgImageUrl: rssImage,
    episodes
  } = data;
  const episode =
    episodeGuid && episodes.find(({ guid }) => guid === episodeGuid);
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
          </>
        )}
        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta name="twitter:image" content={imageUrl} />
          </>
        )}
      </Head>
      <Listen data={data} config={config} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseListenParamsToConfig(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed
  const data = parseListenData(config, rssData);

  return {
    props: { config, data }
  };
};

export default ListenPage;
