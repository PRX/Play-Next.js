/**
 * Convert string value into boolean.
 * @param str String to convert.
 * @returns '0', 'false', 'null', 'undefined', or '' as false, all else as true.
 */
const convertStringToBoolean = (str: string): boolean =>
  ['0', 'false', 'null', 'undefined'].indexOf(str) > -1 ? false : !!str;

export default convertStringToBoolean;
