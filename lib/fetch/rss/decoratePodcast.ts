import {
  IRssPodcastFollow,
  IRssPodcastValue,
  IRssPodcastValueRecipient
} from '@interfaces/data/IRssPodcast';
import type { IRss, IRssItem } from '@interfaces/data';

export const extractPodcastFollow = (data): IRssPodcastFollow =>
  data['podcast:follow']?.$;

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
  const feedPodcastFollow = extractPodcastFollow(feed);
  const hasPodcastProps = !!feedVal || !!feedPodcastFollow;
  const rssData: IRss = {
    ...feed,
    ...(hasPodcastProps && {
      podcast: {
        ...(feedPodcastFollow && { follow: feedPodcastFollow }),
        ...(feedVal && { value: feedVal })
      }
    }),
    items: feedItems
  };

  delete rssData['podcast:value'];

  return rssData;
};
