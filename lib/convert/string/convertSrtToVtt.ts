/**
 * Convert SRT transcript to WebVTT transcript.
 * @param srt SRT transcript string.
 * @returns WebVTT transcript string.
 */
const convertSrtToVtt = (srt: string) => {
  const cueDelimiter = '\n\n';
  const cueLineDelimiter = '\n';
  const cues = srt
    .replace(/\r+|^\s+|\s+$/g, '')
    .replace(/\n{3,}/g, cueDelimiter)
    .split(cueDelimiter);
  const result = [
    'WEBVTT',
    ...cues.map((cue, index) => {
      const lines = cue.split(cueLineDelimiter);
      const hasLabel = !lines[0].includes('-->');
      const label = hasLabel ? lines[0] : index + 1;
      const times = lines[hasLabel ? 1 : 0].replaceAll(',', '.');
      const text = lines
        .slice(hasLabel ? 2 : 1)
        .join(cueLineDelimiter)
        .replace(/^([\w\s]+):\s+/, '<v $1>');

      return [label, times, text].join(cueLineDelimiter);
    })
  ];

  return result.join(cueDelimiter);
};

export default convertSrtToVtt;
