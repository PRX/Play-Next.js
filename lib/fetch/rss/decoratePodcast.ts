import Parser from 'rss-parser';
import {
  IRssPodcastValue,
  IRssPodcastValueRecipient
} from '@interfaces/data/IRssPodcast';
import type { IRss, IRssItem } from '@interfaces/data';

export const extractPodcastValue = (data): IRssPodcastValue => {
  const recipients: IRssPodcastValueRecipient[] = data['podcast:value']?.[
    'podcast:valueRecipient'
  ].map((recipient) => ({
    ...recipient.$
  }));

  // console.log(data['podcast:value']);
  // console.log(data['podcast:value']?.['podcast:valueRecipient']);

  const podcastValue: IRssPodcastValue = data['podcast:value'] && {
    ...data['podcast:value'].$,
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
