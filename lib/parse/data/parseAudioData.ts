import type { IAudioData, IRssItem } from '@interfaces/data';
import convertStringToBoolean from '@lib/convert/string/convertStringToBoolean';
import convertStringToInteger from '@lib/convert/string/convertStringToInteger';

const parseAudioData = ({
  guid,
  link,
  title,
  itunes,
  enclosure,
  categories
}: IRssItem): IAudioData => ({
  guid,
  ...(link && { link }),
  ...(enclosure && { url: enclosure.url }),
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
  })
});

export default parseAudioData;
