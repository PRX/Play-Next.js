/**
 * Parse the speaker name from a VTT text value.
 * Speaker value will be contained in an HTML style `<v>` tag, in the format:
 *   `<v Speaker Name>Cue text immediately following speaker tag.`
 * There will only be one speaker tag in a cue, and the tag will be the first
 * element of the cue text.
 *
 * See: https://github.com/Podcastindex-org/podcast-namespace/blob/main/transcripts/transcripts.md#properties-1
 *
 * @param text VTT cue to get speaker name from.
 * @returns Speaker name or null.
 */
const parseVttSpeaker = (text: string) =>
  text?.match(/^(?:<v\s+([^>]+)>)/)?.[1] || null;

export default parseVttSpeaker;
