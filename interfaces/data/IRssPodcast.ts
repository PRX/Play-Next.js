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
