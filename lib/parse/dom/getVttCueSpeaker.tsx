import parseVttSpeaker from '../string/parseVttSpeaker';

/**
 * Parse the speaker name from a VTTCue object.
 * @param cue VTT cue to get speaker name from.
 * @returns Speaker name or null.
 */
const getVttCueSpeaker = (cue: VTTCue) => parseVttSpeaker(cue?.text);

export default getVttCueSpeaker;
