/**
 * Defines Series data interfaces and types.
 */

export interface ISeriesData {
  bgImageUrl: string;
  imageUrl: string;
  title: string;
  summary: string;
  episodes: {
    guid: string;
    title: string;
    teaser: string;
    pubDate: string;
  }[];
}
