/**
 * Convert string value into integer.
 * @param str String to convert.
 * @returns Returns integer, or `0` when string is not a number.
 */
const convertStringToInteger = (str: string) => parseInt(str, 10) || 0;

export default convertStringToInteger;
