import type { IMediaData, IEmbedData, IRss } from '@interfaces/data';
import type { IEmbedConfig } from '@interfaces/config';
import generateAudioUrl from '@lib/generate/string/generateAudioUrl';
import getServiceFromUrl from '@lib/parse/string/getServiceFromUrl';
import parseRssItems from './parseRssItems';

/**
 * Parse RSS data object into embed data object for use on embed page.
 * @param config Embed config object.
 * @param rssData RSS data object.
 * @returns Embed data object.
 */
const parseEmbedData = (config: IEmbedConfig, rssData?: IRss): IEmbedData => {
  const {
    feedUrl,
    subscribeUrl,
    imageUrl: configBgImageUrl,
    title: configTitle,
    subtitle: configSubtitle,
    audioUrl: configAudioUrl,
    audioUrlPreview: configAudioUrlPreview,
    episodeGuid: configEpisodeGuid,
    episodeImageUrl: configImageUrl,
    mediaType,
    showPlaylist
  } = config;
  const {
    title: rssTitle,
    link: rssShareUrl,
    image: rssImage,
    podcast,
    itunes
  } = rssData || {};
  const { url: rssImageUrl } = rssImage || {};
  const { image: rssItunesImage, owner: rssItunesOwner } = itunes || {};
  const { value: podcastValue, follow: podcastFollow } = podcast || {};
  const { data: podcastFollowData } = podcastFollow || {};
  const podcastValueRecipient =
    podcastValue &&
    podcastValue.type === 'webmonetization' &&
    podcastValue.valueRecipients?.[0];
  const paymentPointer =
    podcastValueRecipient?.address ||
    (process.env.NODE_ENV !== 'production' && process.env.PAYMENT_POINTER);
  const mediaItems = parseRssItems(rssData, config)?.map(
    (item) =>
      ({
        ...item,
        // Use feed title as audio items' subtitle.
        subtitle: rssTitle
      } as IMediaData)
  );
  const initialMediaIndex =
    mediaItems &&
    (configEpisodeGuid
      ? Math.max(
          0,
          mediaItems.findIndex((item) => item.guid === configEpisodeGuid)
        )
      : 0);
  const media: IMediaData = {
    // Establish defaults from feed props.
    ...((rssImageUrl || rssItunesImage) && {
      imageUrl: rssItunesImage || rssImageUrl
    }),

    // Override with feed items props.
    ...(mediaItems && {
      ...mediaItems[initialMediaIndex]
    }),

    // Override with values from config.
    ...(configTitle && { title: configTitle }),
    ...(configSubtitle && { subtitle: configSubtitle }),

    ...(configAudioUrl &&
      ((cau, mt) => {
        const u = new URL(cau);
        const fn = u.pathname.split('/').pop();
        const ext = fn.split('.')[1] || 'mp3';
        const type =
          mt ||
          (['mp3'].includes(ext) && 'audio/mpeg') ||
          (['oga'].includes(ext) && 'audio/ogg') ||
          (['m4a'].includes(ext) && 'audio/mp4') ||
          (['opus', 'flac'].includes(ext) && `audio/${ext}`) ||
          (['ogv', 'ogg'].includes(ext) && 'video/ogg') ||
          (['mov'].includes(ext) && 'video/quicktime') ||
          (['avi'].includes(ext) && 'video/x-msvideo') ||
          (['wmv'].includes(ext) && 'video/x-ms-wmv') ||
          (['m3u8'].includes(ext) && 'application/x-mpegURL') ||
          (['mp4', 'webm'].includes(ext) && `video/${ext}`);
        const hasAudioSourceAt = /^audio/i.test(type) && 0;
        const hasVideoSourceAt =
          /^video|^application\/x-mpegURL$/i.test(type) && 0;
        return {
          sources: [{ type, url: generateAudioUrl(cau), length: 0 }],
          hasAudioSourceAt,
          hasVideoSourceAt
        };
      })(configAudioUrl, mediaType)),

    ...(configAudioUrlPreview && {
      previewUrl: generateAudioUrl(configAudioUrlPreview)
    }),
    ...(configImageUrl && { imageUrl: configImageUrl })
  };
  const mediaHasProps =
    Object.keys(media).length > 0 && !!media.sources?.length;
  const playlist = !!showPlaylist && mediaItems;
  const bgImageUrl =
    configBgImageUrl || rssItunesImage || rssImageUrl || media.imageUrl;
  const followLinks = [
    ...(podcastFollowData?.links
      ? podcastFollowData.links.map((l) => ({
          ...l,
          service: getServiceFromUrl(l.href) || null
        }))
      : []),
    ...(subscribeUrl || feedUrl
      ? [{ href: subscribeUrl || feedUrl, text: 'RSS Feed', service: 'rss' }]
      : [])
  ];
  const shareUrl = showPlaylist ? rssShareUrl : media.link || rssShareUrl;

  const data: IEmbedData = {
    ...(bgImageUrl && { bgImageUrl }),
    ...(mediaHasProps && { media }),
    ...(playlist && playlist.length > 1 && { playlist }),
    ...(rssTitle && { rssTitle }),
    ...(shareUrl && { shareUrl }),
    ...(rssItunesOwner && { owner: rssItunesOwner }),
    followLinks,
    ...(paymentPointer && { paymentPointer })
  };

  return data;
};

export default parseEmbedData;
