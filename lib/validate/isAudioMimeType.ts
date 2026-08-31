/**
 * Check if a mime type string is for audio.
 *
 * @param mimeType Mime type string to check.
 * @returns boolean
 */
const isAudioMimeType = (mimeType: string) => /^audio/i.test(`${mimeType}`);

export default isAudioMimeType;
