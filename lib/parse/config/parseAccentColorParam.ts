/**
 *
 * @param param Querystring param value.
 * @returns Array of HEX CSS color strings. Can contain syntax for color location in gradient colors.
 */
const parseAccentColorParam = (param: string | string[]): string[] => {
  const colors = (Array.isArray(param) ? param : [param])
    .map((ac) =>
      /^(?:[a-f0-9]{2}[a-f0-9]{2}[a-f0-9]{2}(?:[a-f0-9]{2})?|[a-f0-9]{3})(?:\s1?\d?\d%)?$/i.test(
        ac
      )
        ? `#${ac}`
        : null
    )
    .filter((ac) => !!ac);

  return colors.length ? colors : null;
};

export default parseAccentColorParam;
