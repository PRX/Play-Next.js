import { IRssPodcastTranscriptJson } from '@interfaces/data/IRssPodcast';
import convertSecondsToDuration, {
  ConvertSecondsToDurationOptions
} from './convertSecondsToDuration';

/**
 * Convert JSON transcript to WebVTT transcript.
 *
 * Patterns to account for:
 * - Segment pre word
 *   - Can include 0 second segment for space between words. Should be filtered out to make merging of all patterns consistent.
 *   - Punctuation included in 0 seconds segments. Line character limits should be lax to prevent lines from starting with punctuation.
 * - Multiple segments with same or overlapping times. (This should not occur with per word pattern.)
 *   - If same speaker:
 *     - Merge segments into same cue with new line.
 *     - Observe line limits with lax with line character limits and start new cues as needed.
 *     - Use earliest start time and latest end time of colliding segments.
 *   - If new speaker:
 *     - Start new cue.
 *     - Adjust start time to be end time of previous cue.
 *
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
      .reduce((a, currentSegment, index, all) => {
        if (!a.length) return [currentSegment];

        const aClone = [...a];
        const previousSegment = aClone.pop();
        const nextSegment = all.at(index + 1);
        const startsWithPunctuation = /^(?:\.|,|\?)/.test(currentSegment.body);
        const speakerChanged =
          previousSegment.speaker !== currentSegment.speaker;
        const previousSegmentOverlaps =
          previousSegment.endTime > currentSegment.startTime;
        const nextSegmentOverlaps =
          nextSegment && nextSegment.startTime < currentSegment.endTime;

        // Merge overlapping segments.
        if (previousSegmentOverlaps && !speakerChanged) {
          return [
            ...aClone,
            {
              ...previousSegment,
              endTime: currentSegment.endTime,
              body: [previousSegment.body, currentSegment.body].join('\n')
            }
          ];
        }

        /**
         * Append current segment for future merges when:
         * - Speaker changes
         * - Body exceeds character limit
         * - Next segment starts before the current segment ends
         */
        if (
          speakerChanged ||
          (previousSegment.body.length >= cueBodyCharacterLimit &&
            !startsWithPunctuation) ||
          nextSegmentOverlaps
        ) {
          return [
            ...a,
            {
              ...currentSegment,
              startTime: Math.max(
                currentSegment.startTime,
                previousSegment.endTime
              )
            }
          ];
        }

        const lines = previousSegment.body.split('\n');
        let lastLine = lines.pop();
        if (
          lastLine.length > cueBodyLineCharacterLimit &&
          !startsWithPunctuation
        ) {
          lines.push(lastLine);
          lastLine = '';
        }

        lines.push(
          `${lastLine}${startsWithPunctuation ? '' : ' '}${currentSegment.body}`
        );
        previousSegment.body = lines.join('\n');

        previousSegment.endTime = currentSegment.endTime;

        return [...aClone, previousSegment];
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
