/**
 * Defines RSS `podcast:*` namespace interfaces and types.
 */

export interface IRssPodcastValueRecipient {
  type: string;
  address: string;
  split: number;
  name?: string;
  customKey?: string;
  customValue?: string;
  fee?: boolean;
}

export interface IRssPodcastFollowLink {
  /**
   * Follow link URL.
   */
  href: string;

  /**
   * Text label for link.
   */
  text?: string;

  /**
   * Name of service the link is from.
   * Not part of the `podcast:follow` standard. Data parsers can add this
   * property when a service map is expected to be used in a view.
   */
  service?: string;
}

export interface IRssPodcastFollowData {
  version: string;
  links: IRssPodcastFollowLink[];
}

export interface IRssPodcastFollow {
  url: string;
  data?: IRssPodcastFollowData;
}

export interface IRssPodcastValue {
  type: string;
  method: string;
  suggested?: number;
  valueRecipients: IRssPodcastValueRecipient[];
}

export interface IRssPodcastTranscript {
  type: string;
  url: string;
}

export interface IRssPodcast {
  [key: string]: any;
  follow?: IRssPodcastFollow;
  value?: IRssPodcastValue;
  transcript?: IRssPodcastTranscript[];
}

export interface IRssPodcastTranscriptJsonSegment {
  speaker?: string;
  startTime: number;
  endTime: number;
  body: string;
}

export interface IRssPodcastTranscriptJson {
  version: string;
  segments: IRssPodcastTranscriptJsonSegment[];
}
