import type { IAudioData, IRssItem } from '@interfaces/data';
import convertStringToBoolean from '@lib/convert/string/convertStringToBoolean';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';
import generateAudioUrl from '@lib/generate/string/generateAudioUrl';

/**
 * Parse RSS item into audio data object.
 * @param rssItem RSS item to be parsed.
 * @returns Audio data object.
 */
const parseAudioData = ({
  guid,
  link,
  title,
  itunes,
  enclosure,
  categories,
  podcast
}: IRssItem): IAudioData => ({
  guid,
  ...(link && { link }),
  ...(enclosure && {
    url: generateAudioUrl(enclosure.url),
    fileSize: enclosure.length
  }),
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
});

export default parseAudioData;
