/**
 * Check if a mime type string is for video.
 *
 * @param mimeType Mime type string to check.
 * @returns boolean
 */
const isVideoMimeType = (mimeType: string) =>
  /^video|^application\/x-mpegURL$/i.test(`${mimeType}`);

export default isVideoMimeType;
