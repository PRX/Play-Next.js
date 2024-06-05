function roundToN(num: number, places: number) {
  // eslint-disable-next-line
  return +(Math.round(+(num + `e+${places}`)) + `e-${places}`);
}

export default roundToN;
