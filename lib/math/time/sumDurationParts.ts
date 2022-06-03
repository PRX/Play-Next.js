/**
 * Sum parts of a duration array.
 *
 * @param durations Array of duration arrays, with parts expected in ascending order.
 * @returns Returns number array, with parts summed.
 */

const sumDurationParts = (durations: number[][]) =>
  (durations || []).reduce(
    (a, [s, m, h]) => {
      const sumSeconds = a[0] + s;
      const seconds = sumSeconds % 60;
      const minutesFromSeconds =
        sumSeconds >= 60 ? (sumSeconds - seconds) / 60 : 0;
      const sumMinutes = a[1] + (m || 0) + minutesFromSeconds;
      const minutes = sumMinutes % 60;
      const hoursFromMinutes =
        sumMinutes >= 60 ? (sumMinutes - minutes) / 60 : 0;
      const sumHours = a[2] + (h || 0);
      const hours = sumHours + hoursFromMinutes;

      return [seconds, minutes, hours];
    },
    [0, 0, 0]
  );

export default sumDurationParts;
