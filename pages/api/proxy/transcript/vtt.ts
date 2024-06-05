/**
 * Proxy for VTT transcript file URL's for use in audio track element in Player component.
 *
 * See Podcast Namespace Transcript documentation: https://github.com/Podcastindex-org/podcast-namespace/blob/main/transcripts/transcripts.md
 *
 * Response Type: WebVTT
 * Supported Conversions: SRT, JSON
 *
 * TODO: Add conversion for HTML transcripts. May be able to do HTML > JSON > VTT using `html-to-json-parser`.
 */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import type { TranscriptTypeConversion } from '@interfaces/data';
import type { IRssProxyError } from '@interfaces/error';
import convertJsonToVtt from '@lib/convert/string/convertJsonToVtt';
import convertSrtToVtt from '@lib/convert/string/convertSrtToVtt';

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
    const conversions: TranscriptTypeConversion[] = [
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/vtt/i.test(ct) || t.startsWith('WEBVTT'),
        convert: (t: string) => t
      },
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/srt/i.test(ct) || t.includes('-->'),
        convert: (t: string) => convertSrtToVtt(t)
      },
      {
        check: (ct: string, t: string) =>
          /(?:application|text)\/json/i.test(ct) || t.startsWith('{'),
        convert: (t: string) => convertJsonToVtt(t)
      }
    ];
    const vttResponseBody = conversions
      .find(({ check }) => check(contentType, transcriptAsText))
      ?.convert(transcriptAsText);

    res
      .status(200)
      .setHeader('Content-Type', 'text/vtt')
      .send(vttResponseBody || 'WEBVTT');
  } catch (error) {
    res.status(400).json({
      error: {
        ...error,
        message: `Bad URL Provided. Reason: ${error.message}`
      }
    });
  }
}
