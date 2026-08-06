import type {
  IListenMediaData,
  IListenMediaSource,
  IRssItem
} from '@interfaces/data';
import convertStringToBoolean from '@lib/convert/string/convertStringToBoolean';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';
import generateAudioUrl from '@lib/generate/string/generateAudioUrl';

/**
 * Parse RSS item into listen media data object.
 * @param rssItem RSS item to be parsed.
 * @returns Listen media data object.
 */
const parseListenMediaData = ({
  guid,
  link,
  title,
  itunes,
  enclosure,
  categories,
  podcast
}: IRssItem): IListenMediaData => {
  const enclosureSource: IListenMediaSource = enclosure && {
    type: enclosure.type,
    url: generateAudioUrl(enclosure.url),
    length: enclosure.length
  };
  const alternateEnclosures: IListenMediaSource[] =
    podcast?.alternateEnclosure?.map((ae) => ({
      type: ae.type,
      url: generateAudioUrl(ae.sources[0].uri),
      length: ae.length
    })) || [];
  const sources: IListenMediaSource[] = [
    ...alternateEnclosures,
    ...(enclosureSource ? [enclosureSource] : [])
  ];
  const audioSourceIndex = sources.findIndex(({ type: t }) =>
    /^audio\//i.test(t)
  );
  const videoSourceIndex = sources.findIndex(({ type: t }) =>
    /^video\/|^application\/x-mpegURL$/i.test(t)
  );
  const hasVideo = videoSourceIndex > -1;

  return {
    guid,
    ...(link && { link }),
    ...(enclosureSource && {
      type: enclosureSource.type,
      url: enclosureSource.url,
      fileSize: enclosureSource.length
    }),
    sources,
    audioSourceIndex,
    videoSourceIndex,
    hasVideo,
    ...(categories && {
      categories: categories.map((v) => v.replace(/^\s+|\s+$/g, ''))
    }),
    title,
    ...(itunes && {
      ...(itunes.subtitle && { subtitle: itunes.subtitle }),
      ...(itunes.image && { imageUrl: itunes.image }),
      ...(itunes.duration && { duration: itunes.duration }),
      ...(itunes.season && { season: convertStringToInteger(itunes.season) }),
      ...(itunes.explicit && {
        explicit: convertStringToBoolean(itunes.explicit)
      })
    }),
    ...(podcast?.transcript && {
      transcripts: podcast.transcript
    })
  };
};

export default parseListenMediaData;
