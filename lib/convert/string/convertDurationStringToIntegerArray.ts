import convertStringToInteger from './convertStringToInteger';

/**
 * Convert duration string value into integer array, then reverse it so parts
 * are in ascending order, eg. [seconds, minutes [, hours, ...]].
 *
 * @param duration String to convert in format `[HH:]MM:SS`.
 * @returns Returns number array, with parts reversed.
 */
const convertDurationStringToIntegerArray = (duration: string) =>
  (duration
    ?.split(':') // Split sting on colons to get duration parts.
    .map((v) => convertStringToInteger(v)) // Parse each part into integers.
    .reduce((a, c) => [c, ...a], []) as number[]) || [0]; // Reverse order of parts. ie. [seconds, minutes [, hours]]. // Return zero seconds when passed duration is undefined.

export default convertDurationStringToIntegerArray;
