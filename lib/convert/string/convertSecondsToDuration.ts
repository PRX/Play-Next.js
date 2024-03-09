export type ConvertSecondsToDurationOptions = {
  forceHours: boolean;
  padHours: boolean;
  showMilliseconds: boolean;
  fractionDelimiter: '.' | ',';
  fractionDigits: number;
};

/**
 * Convert seconds to duration string, `[HH:]MM:SS`.
 *
 * @param totalSeconds Seconds as number.
 * @returns Formatted duration string.
 */
const convertSecondsToDuration = (
  inputSeconds: number | string,
  options?: Partial<ConvertSecondsToDurationOptions>
) => {
  const {
    forceHours,
    padHours,
    showMilliseconds,
    fractionDigits,
    fractionDelimiter = '.'
  } = options || {};
  let duration = '00:00';

  if (typeof inputSeconds === 'string' && inputSeconds.indexOf(':') > -1) {
    return inputSeconds;
  }

  const totalSeconds =
    typeof inputSeconds === 'string'
      ? parseInt(inputSeconds, 10)
      : inputSeconds;

  if (typeof totalSeconds === 'number' && totalSeconds > 0) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds) % 60;
    duration = [
      ...(hours || forceHours
        ? [!hours || padHours ? String(hours).padStart(2, '0') : hours]
        : []),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');

    if (showMilliseconds) {
      const secondsFloat = totalSeconds % 60;
      const decimalOffset = 10 ** (fractionDigits || 0);
      const decimals =
        Math.round((secondsFloat - seconds) * decimalOffset) / decimalOffset;
      const decimalDigits = fractionDigits
        ? String(decimals).slice(2).padEnd(fractionDigits, '0')
        : String(secondsFloat).slice(2);

      duration = `${duration}${fractionDelimiter}${decimalDigits}`;
    }
  }

  return duration;
};

export default convertSecondsToDuration;
