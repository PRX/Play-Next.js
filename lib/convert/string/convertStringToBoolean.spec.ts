import convertStringToBoolean from './convertStringToBoolean';

describe('lib/convert/string', () => {
  describe('convertStringToBoolean', () => {
    test("should convert 'false' to false.", () => {
      const result = convertStringToBoolean('false');

      expect(result).toBe(false);
    });

    test("should convert '0' to false.", () => {
      const result = convertStringToBoolean('0');

      expect(result).toBe(false);
    });

    test("should convert 'null' to false.", () => {
      const result = convertStringToBoolean('null');

      expect(result).toBe(false);
    });

    test("should convert 'undefined' to false.", () => {
      const result = convertStringToBoolean('undefined');

      expect(result).toBe(false);
    });

    test("should convert '' to false.", () => {
      const result = convertStringToBoolean('');

      expect(result).toBe(false);
    });

    test("should convert '1' to true.", () => {
      const result = convertStringToBoolean('1');

      expect(result).toBe(true);
    });

    test("should convert 'true' to true.", () => {
      const result = convertStringToBoolean('true');

      expect(result).toBe(true);
    });
  });
});
