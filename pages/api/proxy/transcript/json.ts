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
import type { TranscriptTypeConversion } from '@interfaces/data';
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
    const conversions: TranscriptTypeConversion[] = [
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/json/i.test(ct) || t.startsWith('{'),
        convert: (t: string) => t
      },
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/vtt/i.test(ct) || t.startsWith('WEBVTT'),
        convert: (t: string) => JSON.stringify(convertVttToJson(t))
      },
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/srt/i.test(ct) || t.includes('-->'),
        convert: (t: string) =>
          JSON.stringify(convertVttToJson(convertSrtToVtt(t)))
      }
    ];
    const jsonResponseBody = conversions
      .find(({ check }) => check(contentType, transcriptAsText))
      ?.convert(transcriptAsText);

    res
      .status(200)
      .setHeader('Content-Type', 'text/json')
      .send(jsonResponseBody || 'null');
  } catch (error) {
    res.status(400).json({
      error: {
        ...error,
        message: `Bad URL Provided. Reason: ${error.message}`
      }
    });
  }
}
