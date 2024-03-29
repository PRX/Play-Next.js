import { IRssPodcastTranscriptJson } from '@interfaces/data/IRssPodcast';
import convertVttToJson from './convertVttToJson';

describe('lib/convert/string', () => {
  describe('convertVttToJson', () => {
    const mockVtt = `WEBVTT

1
00:01:23.456 --> 00:01:32.100
<v Darth Vader>No, I am your father.

2
00:01:32.456 --> 00:01:34.321
<v Luke Skywalker>No! That's impossible.`;

    const mockJsonResult: IRssPodcastTranscriptJson = {
      version: '1.0.0',
      segments: [
        {
          speaker: 'Darth Vader',
          startTime: 83.456,
          endTime: 92.1,
          body: 'No, I am your father.'
        },
        {
          speaker: 'Luke Skywalker',
          startTime: 92.456,
          endTime: 94.321,
          body: "No! That's impossible."
        }
      ]
    };

    test('should convert WebVTT to JSON.', () => {
      const result = convertVttToJson(mockVtt);

      expect(result).toStrictEqual<IRssPodcastTranscriptJson>(mockJsonResult);
    });

    test('should return null on parsing error.', () => {
      const result = convertVttToJson('Not a WebVTT string.');

      expect(result).toBeNull();
    });
  });
});
