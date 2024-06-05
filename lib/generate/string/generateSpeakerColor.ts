/**
 * @file generateSpeakerColor.ts
 *
 * Generate a color for a closed caption speaker.
 */

/**
 *
 * @param speakerNumber 0-based number derived from order of appearance
 *                      in transcript.
 * @param presetColors Array of preset colors to pick from. Will be used over
 *                     calculated colors. Selected using speaker number. When
 *                     speaker number is out of range of presets, generated
 *                     color will be returned.
 * @param baseHue Hue to start calculating generated colors from.
 * @param hueShiftAmount Amount to shift hue when calculating generated colors.
 *                       To avoid duplicate colors, use a number that is not a
 *                       factor of 360.
 * @returns HSL string unique to speaker number.
 */
const generateSpeakerColor = (
  speakerNumber: number,
  presetColors?: string[],
  baseHue: number = 0,
  hueShiftAmount: number = 13
) => {
  const presetColor = presetColors?.[speakerNumber];
  const hue =
    baseHue +
    hueShiftAmount * Math.max(speakerNumber - (presetColors?.length || 0), 0);
  // Color should be pure saturated colors. Let CSS apply `color-mix` to adjust
  // color for contrast.
  const color = `hsl(${hue} 100% 50%)`;

  return presetColor || color;
};

export default generateSpeakerColor;
