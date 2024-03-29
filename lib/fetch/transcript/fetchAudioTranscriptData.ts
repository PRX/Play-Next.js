import { IAudioData, TranscriptTypeConversion } from '@interfaces/data';
import { IRssPodcastTranscriptJson } from '@interfaces/data/IRssPodcast';
import convertSrtToVtt from '@lib/convert/string/convertSrtToVtt';
import convertVttToJson from '@lib/convert/string/convertVttToJson';

const fetchAudioTranscriptData = async (episode: IAudioData) => {
  if (!episode?.transcripts) return null;

  const { transcripts } = episode;
  const transcript = transcripts?.find(
    (t) => !!['json', 'vtt', 'srt'].find((n) => t.type.includes(n))
  );
  const { url } = transcript || {};
  const fetchUrl =
    typeof window === 'undefined'
      ? url
      : (transcript.type.includes('json') && url) ||
        `/api/proxy/transcript/json?u=${url}`;

  const transcriptResponse = fetchUrl && (await fetch(fetchUrl));

  const transcriptAsText =
    transcriptResponse && (await transcriptResponse.text());
  const contentType =
    transcriptResponse.headers.get('Content-Type') || 'text/plain';
  const conversions: TranscriptTypeConversion<IRssPodcastTranscriptJson>[] = [
    {
      check: (ct: string, t: string) =>
        /(?:application|text)\/json/i.test(ct) || t.startsWith('{'),
      convert: (t: string) => JSON.parse(t)
    },
    {
      check: (ct: string, t: string) =>
        /(?:application|text)\/vtt/i.test(ct) || t.startsWith('WEBVTT'),
      convert: (t: string) => convertVttToJson(t)
    },
    {
      check: (ct: string, t: string) =>
        /(?:application|text)\/srt/i.test(ct) || t.includes('-->'),
      convert: (t: string) => convertVttToJson(convertSrtToVtt(t))
    }
  ];
  const transcriptData = conversions
    .find(({ check }) => check(contentType, transcriptAsText))
    ?.convert(transcriptAsText);

  return transcriptData;
};

export default fetchAudioTranscriptData;
