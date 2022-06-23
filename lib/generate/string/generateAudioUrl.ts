/**
 * @file generateAudioUrl.ts
 *
 * Generate audio URL from passed URL. Append `_from` param when not
 * already included.
 */

const generateAudioUrl = (audioUrl: string) => {
  const url = new URL(audioUrl);

  if (!url.searchParams.get('_from')) {
    url.searchParams.set('_from', 'play.prx.org');
  }

  return url.toString();
};

export default generateAudioUrl;
