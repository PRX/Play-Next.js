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

export const extractPodcastTranscript = (data) => {
  const podcastTranscript = data['podcast:transcript']?.map(({ $ }) => ({
    ...$
  }));
  return podcastTranscript;
};

export const decoratePodcast = (feed): IRss => {
  const feedItems: IRssItem[] = feed.items.map((item) => {
    const itemVal = extractPodcastValue(item);
    const itemTranscript = extractPodcastTranscript(item);
    const hasPodcastProps = !!itemVal || !!itemTranscript?.length;

    return {
      ...item,
      ...(hasPodcastProps && {
        podcast: {
          ...(itemVal && { value: itemVal }),
          ...(!!itemTranscript?.length && { transcript: itemTranscript })
        }
      })
    } as IRssItem;
  });

  const feedVal = extractPodcastValue(feed);
  const rssData: IRss = {
    ...feed,
    ...(feedVal && { podcast: { value: feedVal } }),
    items: feedItems
  };

  delete rssData['podcast:value'];

  return rssData;
};
