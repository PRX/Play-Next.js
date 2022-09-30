/**
 * @file generateAudioUrl.ts
 *
 * Generate audio URL from passed URL. Append `_from` param when not
 * already included.
 */

const generateAudioUrl = (audioUrl: string) => {
  const audioUrlWithProtocol = /^\/\//.test(audioUrl)
    ? `https:${audioUrl}`
    : audioUrl;
  const url = new URL(audioUrlWithProtocol);

  if (!url.searchParams.get('_from')) {
    url.searchParams.set('_from', 'play.prx.org');
  }

  return url.toString();
};

export default generateAudioUrl;
