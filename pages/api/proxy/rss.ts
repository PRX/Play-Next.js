// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Parser.Output<Parser.Item> | { error: string }>
) {
  const { u: feedUrl } = req.query;
  const feed = await fetchRssFeed(feedUrl as string);

  res.status(200).json(feed);
}
