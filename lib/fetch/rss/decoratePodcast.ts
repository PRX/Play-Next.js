import {
  IRssPodcastValue,
  IRssPodcastValueRecipient
} from '@interfaces/data/IRssPodcast';
import type { IRss, IRssItem } from '@interfaces/data';

export const extractPodcastValue = (data): IRssPodcastValue => {
  const podcastValueWmIlp = (data['podcast:value'] as any[])?.find(
    ({ $: { type, method } }) => type === 'webmonetization' && method === 'ILP'
  );

  if (!podcastValueWmIlp) return undefined;

  const recipients: IRssPodcastValueRecipient[] = podcastValueWmIlp[
    'podcast:valueRecipient'
  ]?.map((recipient) => ({
    ...recipient.$
  }));

  const podcastValue: IRssPodcastValue = {
    ...podcastValueWmIlp.$,
    ...(recipients?.length > 0 && { valueRecipients: recipients })
  };

  return podcastValue;
};

export const decoratePodcast = (feed): IRss => {
  const feedItems: IRssItem[] = feed.items.map((item) => {
    const itemVal = extractPodcastValue(item);
    return {
      ...item,
      ...(itemVal && { podcast: { value: itemVal } })
    } as IRssItem;
  });

  const feedVal = extractPodcastValue(feed);
  const rssData: IRss = {
    ...feed,
    ...{ items: feedItems },
    ...(feedVal && { podcast: { value: feedVal } })
  };

  delete rssData['podcast:value'];

  return rssData;
};
