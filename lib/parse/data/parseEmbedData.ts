import type { IAudioData, IEmbedData, IRssItem } from '@interfaces/data';
import type { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import type Parser from 'rss-parser';
import generateAudioUrl from '@lib/generate/string/generateAudioUrl';
import parseRssItems from './parseRssItems';

/**
 * Parse RSS data object into embed data object for use on embed page.
 * @param config Embed config object.
 * @param rssData RSS data object.
 * @returns Embed data object.
 */
const parseEmbedData = (
  config: IEmbedConfig,
  rssData?: Parser.Output<IRssItem>
): IEmbedData => {
  const {
    feedUrl,
    subscribeUrl,
    imageUrl: configBgImageUrl,
    title: configTitle,
    subtitle: configSubtitle,
    audioUrl: configAudioUrl,
    episodeGuid: configEpisodeGuid,
    episodeImageUrl: configImageUrl,
    showPlaylist
  } = config;
  const {
    title: rssTitle,
    link: rssShareUrl,
    image: rssImage,
    itunes
  } = rssData || {};
  const { url: rssImageUrl } = rssImage || {};
  const { image: rssItunesImage, owner: rssItunesOwner } = itunes || {};
  const audioItems = parseRssItems(rssData, config)?.map(
    (item) =>
      ({
        ...item,
        // Use feed title as audio items' subtitle.
        subtitle: rssTitle
      } as IAudioData)
  );
  const initialAudioIndex =
    audioItems &&
    (configEpisodeGuid
      ? Math.max(
          0,
          audioItems.findIndex((item) => item.guid === configEpisodeGuid)
        )
      : 0);
  const audio: IAudioData = {
    // Establish defaults from feed props.
    ...((rssImageUrl || rssItunesImage) && {
      imageUrl: rssImageUrl || rssItunesImage
    }),

    // Override with feed items props.
    ...(audioItems && {
      ...audioItems[initialAudioIndex]
    }),

    // Override with values from config.
    ...(configTitle && { title: configTitle }),
    ...(configSubtitle && { subtitle: configSubtitle }),
    ...(configAudioUrl && { url: generateAudioUrl(configAudioUrl) }),
    ...(configImageUrl && { imageUrl: configImageUrl })
  };
  const audioHasProps = Object.keys(audio).length > 0;
  const playlist = !!showPlaylist && audioItems;
  const bgImageUrl =
    configBgImageUrl || rssImageUrl || rssItunesImage || audio.imageUrl;
  const followUrls = {
    ...((subscribeUrl || feedUrl) && { rss: subscribeUrl || feedUrl })
  };
  const paymentPointer =
    process.env.NODE_ENV === 'development' && process.env.PAYMENT_POINTER;

  console.log(
    process.env.NODE_ENV,
    process.env.PAYMENT_POINTER,
    paymentPointer
  );

  const data: IEmbedData = {
    ...(bgImageUrl && { bgImageUrl }),
    ...(audioHasProps && { audio }),
    ...(playlist && playlist.length > 1 && { playlist }),
    ...(feedUrl && {
      rssTitle,
      shareUrl: showPlaylist ? rssShareUrl : audio.link,
      ...(rssItunesOwner && { owner: rssItunesOwner })
    }),
    followUrls,
    ...(paymentPointer && { paymentPointer })
  };

  return data;
};

export default parseEmbedData;
