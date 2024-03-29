/**
 * @file Transcript.ts
 * Define types for transcript data and conversions.
 */

export type TranscriptTypeConversion<ConvertToType = string> = {
  // eslint-disable-next-line no-unused-vars
  check(ct: string, t: string): boolean;
  // eslint-disable-next-line no-unused-vars
  convert(t: string): ConvertToType;
};
