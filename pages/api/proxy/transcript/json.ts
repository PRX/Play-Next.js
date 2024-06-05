/**
 * Proxy for JSON transcript file URL's for use in audio track element in Player component.
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
  TranscriptTypeConversion
} from '@interfaces/data';
import type { IRssProxyError } from '@interfaces/error';
import convertSrtToVtt from '@lib/convert/string/convertSrtToVtt';
import convertVttToJson from '@lib/convert/string/convertVttToJson';
import roundToN from '@lib/math/number/roundToN';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { error: IRssProxyError }>
) {
  const { u, cb } = req.query;
  const transcriptUrl = Array.isArray(u) ? u[0] : u;
  const cacheBuster = Array.isArray(cb) ? cb[0] : cb;

  try {
    const fetchUrl = new URL(transcriptUrl);

    if (cacheBuster) {
      fetchUrl.searchParams.set('cb', cacheBuster);
    }

    const transcriptResponse = await fetch(fetchUrl.toString());

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
    const data = conversions
      .find(({ check }) => check(contentType, transcriptAsText))
      ?.convert(transcriptAsText);
    const processed = data?.segments && {
      ...data,
      segments: data.segments.map(({ startTime, endTime, ...rest }) => ({
        ...rest,
        // Times need to be rounded to match VTT standard to ensure they can be
        // correctly compared when rendering segments grouped by VTT cue range.
        startTime: roundToN(startTime, 3),
        endTime: roundToN(endTime, 3)
      }))
    };

    const jsonResponseBody = JSON.stringify(processed || null);

    res
      .status(200)
      .setHeader('Content-Type', 'text/json')
      .send(jsonResponseBody);
  } catch (error) {
    res.status(400).json({
      error: {
        ...error,
        message: `Bad URL Provided. Reason: ${error.message}`
      }
    });
  }
}
