import { IRssPodcastTranscriptJson } from '@interfaces/data/IRssPodcast';
import convertSecondsToDuration, {
  ConvertSecondsToDurationOptions
} from './convertSecondsToDuration';

/**
 * Convert JSON transcript to WebVTT transcript.
 * @param srt JSON transcript string or object.
 * @returns WebVTT transcript string.
 */
const convertJsonToVtt = (json: string | IRssPodcastTranscriptJson) => {
  const cueDelimiter = '\n\n';
  const cueLineDelimiter = '\n';
  const cueBodyLineCharacterLimit = 32;
  const cueBodyLineLimit = 2;
  const cueBodyCharacterLimit =
    cueBodyLineCharacterLimit * cueBodyLineLimit + cueBodyLineLimit - 1;
  const data: IRssPodcastTranscriptJson =
    typeof json === 'string' ? JSON.parse(json) : json;
  const { segments } = data;
  const result = [
    'WEBVTT',
    ...segments
      .filter(({ body }) => !!body?.trim().length)
      .reduce((a, s) => {
        if (!a.length) return [s];

        const aClone = [...a];
        const segment = aClone.pop();
        const startsWithPunctuation = /^(?:\.|,|\?)/.test(s.body);

        // When speaker changes or body exceeds character limit, start merging a new segment.
        if (
          segment.speaker !== s.speaker ||
          (segment.body.length >= cueBodyCharacterLimit &&
            !startsWithPunctuation)
        ) {
          return [...a, s];
        }

        const lines = segment.body.split('\n');
        let lastLine = lines.pop();
        if (
          lastLine.length > cueBodyLineCharacterLimit &&
          !startsWithPunctuation
        ) {
          lines.push(lastLine);
          lastLine = '';
        }

        lines.push(`${lastLine}${startsWithPunctuation ? '' : ' '}${s.body}`);
        segment.body = lines.join('\n');

        segment.endTime = s.endTime;

        return [...aClone, segment];
      }, [])
      .map((segment, index) => {
        const label = index + 1;
        const { startTime, endTime, body, speaker } = segment;
        const options: Partial<ConvertSecondsToDurationOptions> = {
          forceHours: true,
          padHours: true,
          showMilliseconds: true,
          fractionDigits: 3
        };
        const times = `${convertSecondsToDuration(
          startTime,
          options
        )} --> ${convertSecondsToDuration(endTime, options)}`;
        const text = `${speaker ? `<v ${speaker}>` : ''}${body}`;

        return [label, times, text].join(cueLineDelimiter);
      })
  ];

  return result.join(cueDelimiter);
};

export default convertJsonToVtt;
