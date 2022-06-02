/**
 * Format duration parts array into a string.
 *
 * @param durations Array of duration parts, with parts expected in ascending order.
 * @returns Returns string in format `[HHhr][ MMmin][ SSsec]`, including no more that two parts.
 */

const formatDurationParts = ([seconds, minutes, hours]: number[]) =>
  [
    // When we have hours, format as `HHhr MMmin`, rounding minutes up.
    ...(hours
      ? [
          `${hours}hr`,
          ...(minutes ? [`${minutes + (seconds > 30 ? 1 : 0)}min`] : [])
        ]
      : // When missing hours, format as `MMmin`.
        [...(minutes ? [`${minutes}min`] : [])]),
    // Format seconds when missing hours and we have seconds as `SSsec`.
    ...(!hours && seconds ? [`${seconds}sec`] : [])
  ].join(' ');

export default formatDurationParts;
