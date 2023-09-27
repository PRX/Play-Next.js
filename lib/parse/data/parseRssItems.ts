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
  if (!rssData || !rssData.items?.length) return undefined;

  const { link, image, itunes } = rssData;
  const { url: rssImageUrl } = image || {};
  const { image: rssItunesImage, type: rssItunesType } = itunes || {};
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
  let resultItems: IRssItem[];

  if (showPlaylist) {
    resultItems = [
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
        // Prepend target episode if it was filtered out.
        (items: IRssItem[]) => {
          // No target episode, so just return items as they are.
          if (!episode) return items;
          // Get the index of the episode in the filtered items.
          const episodeIndex = items.findIndex(
            (item) => item.guid === episode.guid
          );

          if (episodeIndex > -1) {
            // episode is in items.
            // Make episode to first item.
            return [
              episode,
              ...items.filter((item) => item.guid !== episode.guid)
            ];
          }

          // episode was filtered out. Prepend it to items.
          return [episode, ...items];
        },
        // Sort Serial feed items.
        (items: IRssItem[]) =>
          rssItunesType === 'serial'
            ? [...items].sort((a, b) => {
                const {
                  season: aSeason = '1',
                  episode: aEpisode,
                  episodeType: aEpisodeType
                } = a.itunes;
                const {
                  season: bSeason = '1',
                  episode: bEpisode,
                  episodeType: bEpisodeType
                } = b.itunes;

                if (aSeason === bSeason) {
                  if (aEpisodeType === 'trailer') return -1;
                  if (bEpisodeType === 'trailer') return 1;
                  return parseInt(aEpisode, 10) - parseInt(bEpisode, 10);
                }

                return parseInt(aSeason, 10) - parseInt(bSeason, 10);
              })
            : items,
        // Cap number of items to configured length.
        (items: IRssItem[]) =>
          showPlaylist === 'all' ? items : items.slice(0, showPlaylist)
      ].reduce((a, f) => f(a), rssItems)
    ];
  } else if (episodeGuid && episode) {
    // This is a regular embed for a specific episode, but it was found.
    resultItems = [episode];
  } else if (episodeGuid && !episode) {
    // This is a regular embed for a specific episode, but it was not found.
    return undefined;
  }

  // If we have no items at this point, just use the first one.
  if (!resultItems?.length) {
    resultItems = rssItems[0] && [rssItems[0]];
  }

  // Return resulting items as audio data or `undefined`.
  return resultItems?.map(
    (item) =>
      ({
        // Provide some default props inherited from feed.
        link,
        ...(imageUrl && { imageUrl }),
        // Parse item into audio data, using passed parser if provided.
        ...(itemParser || parseAudioData)(item)
      } as IAudioData)
  );
};

export default parseRssItems;
