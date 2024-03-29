/**
 * Parse the speaker name from a VTT text value.
 * @param text VTT cue to get speaker name from.
 * @returns Speaker name or null.
 */
const parseVttSpeaker = (text: string) =>
  text?.match(/^(?:<v\s+([^>]+)>)/)?.[1] || null;

export default parseVttSpeaker;
