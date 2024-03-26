/**
 * Parse the speaker name from a VTT cue text value.
 * @param cue VTT cue to get speaker name from.
 * @returns Speaker name or null.
 */
const getVttCueSpeaker = (cue: VTTCue) =>
  cue?.text.match(/^(?:<v\s+([^>]+)>)/)?.[1] || null;

export default getVttCueSpeaker;
