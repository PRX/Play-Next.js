import convertDurationStringToIntegerArray from './convertDurationStringToIntegerArray';

describe('lib/convert/string', () => {
  describe('convertDurationStringToIntegerArray', () => {
    test('should convert parts to integers, and reverse order.', () => {
      const result1 = convertDurationStringToIntegerArray('42');
      const result2 = convertDurationStringToIntegerArray('05:45');
      const result3 = convertDurationStringToIntegerArray('12:00:16');

      expect(result1.length).toBe(1);
      expect(result1).toStrictEqual([42]);

      expect(result2.length).toBe(2);
      expect(result2).toStrictEqual([45, 5]);

      expect(result3.length).toBe(3);
      expect(result3).toStrictEqual([16, 0, 12]);
    });

    test('should return zero when passed undefined.', () => {
      const result1 = convertDurationStringToIntegerArray(undefined);

      expect(result1.length).toBe(1);
      expect(result1).toStrictEqual([0]);
    });
  });
});
