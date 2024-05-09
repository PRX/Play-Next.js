/**
 * Proxy for render ready transcript data for use in audio track element in Player component.
 *
 * See Podcast Namespace Transcript documentation: https://github.com/Podcastindex-org/podcast-namespace/blob/main/transcripts/transcripts.md
 *
 * Response Type: JSON
 * Supported Conversions: SRT, VTT
 *
 * TODO: Add conversion for HTML transcripts. May be able to do HTML > JSON (HTML parsed) > JSON (transcript) using `html-to-json-parser`.
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  IRssPodcastTranscriptJson,
  IRssPodcastTranscriptJsonSegment,
  SpeakerSegmentsBlock,
  TranscriptTypeConversion
} from '@interfaces/data';
import type { IRssProxyError } from '@interfaces/error';
import convertSrtToVtt from '@lib/convert/string/convertSrtToVtt';
import convertVttToJson from '@lib/convert/string/convertVttToJson';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { error: IRssProxyError }>
) {
  const { u } = req.query;
  const transcriptUrl = Array.isArray(u) ? u[0] : u;

  try {
    const transcriptResponse = await fetch(transcriptUrl);

    if (!transcriptResponse?.ok) {
      throw new Error(
        `URL provided return status "${transcriptResponse.statusText}"`
      );
    }

    const transcriptAsText = await transcriptResponse.text();
    const contentType =
      transcriptResponse.headers.get('Content-Type') || 'text/plain';
    const conversions: TranscriptTypeConversion<IRssPodcastTranscriptJson>[] = [
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/json/i.test(ct) || t.startsWith('{'),
        convert: (t: string) => JSON.parse(t)
      },
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/vtt/i.test(ct) || t.startsWith('WEBVTT'),
        convert: (t: string) => convertVttToJson(t)
      },
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/srt/i.test(ct) || t.includes('-->'),
        convert: (t: string) => convertVttToJson(convertSrtToVtt(t))
      }
    ];
    const jsonResponseBody = conversions
      .find(({ check }) => check(contentType, transcriptAsText))
      ?.convert(transcriptAsText);
    const hasMultipleSpeakers =
      jsonResponseBody?.segments.filter(({ speaker }) => !!speaker).length > 1;
    const speakerSegmentsBlocks = jsonResponseBody?.segments
      .reduce((a, segment) => {
        const aClone = [...a];
        const previousSegment = aClone.pop();
        const isSpace = segment.body.trim().length === 0;

        if (
          !previousSegment ||
          isSpace ||
          segment.startTime > previousSegment.endTime
        ) {
          return [...a, segment];
        }

        const updatedSegment = {
          ...previousSegment,
          body: previousSegment.body + segment.body
        };

        return [...aClone, updatedSegment];
      }, [] as IRssPodcastTranscriptJsonSegment[])
      .reduce((a, segment) => {
        const aClone = [...a];
        const previousBlock = aClone.pop();
        const lastSegment = previousBlock?.segments.at(
          previousBlock.segments.length - 1
        );
        const speakerChanged = previousBlock?.speaker !== segment.speaker;
        const sentenceEnded = /[.?!]$/.test(lastSegment?.body || '');
        const breakSegment =
          (hasMultipleSpeakers && speakerChanged) ||
          (!hasMultipleSpeakers && sentenceEnded);

        if (breakSegment) {
          return [
            ...a,
            {
              speaker: segment.speaker,
              segments: [segment]
            }
          ];
        }

        return [
          ...aClone,
          {
            ...previousBlock,
            segments: [...(previousBlock?.segments || []), segment]
          }
        ];
      }, [] as SpeakerSegmentsBlock[]);

    res
      .status(200)
      .setHeader('Content-Type', 'text/json')
      .send(JSON.stringify(speakerSegmentsBlocks || null));
  } catch (error) {
    res.status(400).json({
      error: {
        ...error,
        message: `Bad URL Provided. Reason: ${error.message}`
      }
    });
  }
}
