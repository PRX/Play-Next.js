import convertJsonToVtt from './convertJsonToVtt';

describe('lib/convert/string', () => {
  describe('convertJsonToVtt', () => {
    const mockJson = {
      version: '1.0.0',
      segments: [
        {
          speaker: 'Darth Vader',
          startTime: 0.5,
          endTime: 0.75,
          body: 'I'
        },
        {
          speaker: 'Darth Vader',
          startTime: 1,
          endTime: 1.25,
          body: 'am'
        },
        {
          speaker: 'Darth Vader',
          startTime: 1.5,
          endTime: 2.0,
          body: 'your'
        },
        {
          speaker: 'Darth Vader',
          startTime: 2.25,
          endTime: 2.5,
          body: 'father.'
        },
        {
          speaker: 'Luke',
          startTime: 2.75,
          endTime: 3.0,
          body: 'Nooooo'
        }
      ]
    };

    const mockVttResult = `WEBVTT

1
00:00:00.500 --> 00:00:02.500
<v Darth Vader>I am your father.

2
00:00:02.750 --> 00:00:03.000
<v Luke>Nooooo`;

    test('should convert JSON to VTT.', () => {
      const result = convertJsonToVtt(mockJson);

      expect(result).toEqual(mockVttResult);
    });
  });
});
