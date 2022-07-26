// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IRssProxyError } from '@interfaces/error';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Parser.Output<Parser.Item> | { error: IRssProxyError }>
) {
  const { u: feedUrl } = req.query;

  try {
    const feed = await fetchRssFeed(feedUrl as string);
    res.status(200).json(feed);
  } catch (error) {
    res.status(400).json({
      error: {
        ...error,
        message: `Bad URL Provided. Reason: ${error.message}`
      }
    });
  }
}
