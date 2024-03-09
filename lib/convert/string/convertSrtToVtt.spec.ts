import convertSrtToVtt from './convertSrtToVtt';

describe('lib/convert/string', () => {
  describe('convertSrtToVtt', () => {
    const mockSrt = `1
00:01:23,456 --> 00:01:32,100
Darth Vader: No, I am your father.

2
00:01:32,456 --> 00:01:34,321
Luke Skywalker: No! That's impossible.

`;

    const mockSrtNoCueLables = `00:01:23,456 --> 00:01:32,100
Darth Vader: No, I am your father.

00:01:32,456 --> 00:01:34,321
Luke Skywalker: No! That's impossible.

`;

    const mockVttResult = `WEBVTT

1
00:01:23.456 --> 00:01:32.100
<v Darth Vader>No, I am your father.

2
00:01:32.456 --> 00:01:34.321
<v Luke Skywalker>No! That's impossible.`;

    test('should convert SRT to VTT.', () => {
      const result = convertSrtToVtt(mockSrt);

      expect(result).toEqual(mockVttResult);
    });

    test("should add numeric cue labels when srt cues don't have labels", () => {
      const result = convertSrtToVtt(mockSrtNoCueLables);

      expect(result).toEqual(mockVttResult);
    });
  });
});
