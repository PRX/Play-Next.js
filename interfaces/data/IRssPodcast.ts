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
