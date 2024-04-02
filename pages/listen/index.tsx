/**
 * @file listen/index.tsx
 * Landing page for podcast using RSS data.
 */

import type { GetServerSideProps } from 'next';
import type { IRss } from '@interfaces/data';
import type { IListenPageProps, IPageProps } from '@interfaces/page';
import Error from 'next/error';
import parseListenParamsToConfig from '@lib/parse/config/parseListenParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import fetchAudioTranscriptData from '@lib/fetch/transcript/fetchAudioTranscriptData';
import parseListenData from '@lib/parse/data/parseListenData';
import Listen from '@components/Listen';
import Player from '@components/Player';
import { IPageError } from '@interfaces/error';

const ListenPage = ({ data, config, error }: IListenPageProps) => {
  const { episodeGuid } = config;
  const { episodes } = data;
  const episodeIndex =
    episodeGuid && episodes?.findIndex(({ guid }) => guid === episodeGuid);

  if (error) {
    return <Error statusCode={error.statusCode} title={error.message} />;
  }

  return (
    <Player audio={episodes} startIndex={episodeIndex}>
      <Listen data={data} config={config} />
    </Player>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({
  query,
  res
}) => {
  // 1. Convert query params into embed config.
  const config = parseListenParamsToConfig(query);
  const { episodeGuid } = config;

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

  // 4. Fetch requested episodes transcript and convert to JSON.
  // const episodeIndex =
  //   episodeGuid && data.episodes.findIndex(({ guid }) => episodeGuid === guid);
  // const episode = data.episodes[episodeIndex];
  // const transcriptData = await fetchAudioTranscriptData(episode);

  // if (transcriptData) {
  //   return {
  //     props: {
  //       config,
  //       data: {
  //         ...data,
  //         episodes: data.episodes.map((e, index) =>
  //           index !== episodeIndex ? e : { ...e, transcriptData }
  //         )
  //       },
  //       ...(error && { error })
  //     }
  //   };
  // }

  return {
    props: { config, data, ...(error && { error }) }
  };
};

export default ListenPage;
