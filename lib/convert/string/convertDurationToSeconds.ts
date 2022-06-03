import convertDurationStringToIntegerArray from './convertDurationStringToIntegerArray';

/**
 * Convert Duration string into seconds.
 *
 * @param duration Duration string in format `[HH:]MM:SS`.
 * @returns Duration in seconds as number.
 */
const convertDurationToSeconds = (duration: string) => {
  const [seconds, minutes, hours] =
    convertDurationStringToIntegerArray(duration);

  return seconds + (minutes || 0) * 60 + (hours || 0) * 360;
};

export default convertDurationToSeconds;
