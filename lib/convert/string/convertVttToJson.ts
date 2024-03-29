import type { IRssPodcastTranscriptJson } from '@interfaces/data/IRssPodcast';
import parseVttSpeaker from '@lib/parse/string/parseVttSpeaker';
import WebVtt from 'node-webvtt';

type WebVttJsonCue = {
  identifier: string;
  start: number;
  end: number;
  text: string;
  styles: string;
};

type WebVttJson = {
  valid: boolean;
  cues: WebVttJsonCue[];
};

/**
 * Convert WebVTT transcript to JSON transcript.
 * @param srt WebVTT transcript string.
 * @returns JSON transcript string.
 */
const convertVttToJson = (vtt: string) => {
  try {
    const parsedVtt: WebVttJson = WebVtt.parse(vtt);
    const result: IRssPodcastTranscriptJson = {
      version: '1.0.0',
      segments: parsedVtt.cues.map(({ start, end, text }) => ({
        speaker: parseVttSpeaker(text),
        startTime: start,
        endTime: end,
        body: text.replace(/^<[^>]+>/, '')
      }))
    };

    return result;
  } catch (error) {
    // Do something with the error here.
    // Right now we are just ignoring bad input.
  }

  return null;
};

export default convertVttToJson;
