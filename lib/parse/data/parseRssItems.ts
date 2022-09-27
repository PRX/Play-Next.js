import type { IAudioData, IRss, IRssItem } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/config';
import parseAudioData from './parseAudioData';

/**
 * Parse RSS data items into audio data. Items are filtered and truncated before parsing.
 * @param rssData RSS data containing items to parse.
 * @param config Embed config to get filtering instructions from.
 * @returns Array of audio data items.
 */
const parseRssItems = (
  rssData: IRss,
  config: IEmbedConfig,
  itemParser?: Function
) => {
  if (!rssData || !rssData.items) return undefined;

  const { link, image, itunes } = rssData;
  const { url: rssImageUrl } = image || {};
  const { image: rssItunesImage } = itunes || {};
  const imageUrl = rssItunesImage || rssImageUrl;
  const { episodeGuid, showPlaylist, playlistCategory, playlistSeason } =
    config;
  const rssItems = rssData.items.map(
    (item) =>
      ({
        ...item,
        ...((rssData.itunes?.categories ||
          item.categories ||
          item.itunes?.categories) && {
          categories: [
            ...(item.categories || []),
            ...((item.itunes?.categories as string[]) || []),
            // Inherit categories from channel when item is missing categories.
            ...((!item.categories &&
              !item.itunes?.categories &&
              rssData.itunes.categories) ||
              [])
          ]
            .map((c) => c.trim())
            .reduce((a, c) => (a.indexOf(c) === -1 ? [...a, c] : a), [])
        })
      } as IRssItem)
  );
  const episode =
    episodeGuid && rssItems.find((item) => item.guid === episodeGuid);
  let resultItems: IRssItem[] = episode ? [episode] : [];

  if (showPlaylist) {
    resultItems = [
      ...resultItems,
      ...[
        // Filter audio by season.
        (items: IRssItem[]) =>
          !playlistSeason
            ? items
            : items.filter((i) => i.itunes?.season === `${playlistSeason}`),
        // Filter audio by category.
        (items: IRssItem[]) =>
          !playlistCategory
            ? items
            : items.filter((i) => {
                const category = playlistCategory.toLowerCase();
                const categories = i.categories?.map((c) => c.toLowerCase());
                return categories?.indexOf(category) > -1;
              }),
        // Cap number of items to configured length.
        (items: IRssItem[]) =>
          showPlaylist === 'all' ? items : items.slice(0, showPlaylist)
      ].reduce((a, f) => f(a), rssItems)
    ];
  }

  if (!resultItems.length && episodeGuid) {
    return undefined;
  }

  resultItems = resultItems.length ? resultItems : [rssItems[0]];

  return resultItems.map(
    (item) =>
      ({
        link,
        ...(imageUrl && { imageUrl }),
        ...(itemParser || parseAudioData)(item)
      } as IAudioData)
  );
};

export default parseRssItems;
