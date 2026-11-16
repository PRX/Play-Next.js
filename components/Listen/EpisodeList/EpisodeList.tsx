/**
 * @file EpisodeList.tsx
 * Component to list episodes on listen page.
 */

import type React from 'react';
import type { IListenEpisodeData } from '@interfaces/data';
import { useCallback, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import ListenContext from '@contexts/ListenContext';
import PlayerContext from '@contexts/PlayerContext';
import SwapVertIcon from '@svg/icons/SwapVert.svg';
import ChevronLeftIcon from '@svg/icons/ChevronLeft.svg';
import ChevronRightIcon from '@svg/icons/ChevronRight.svg';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import { SortEnum } from '@interfaces/buf/pagination_pb';
import { defaultPagination, encodePaginationParam } from '@lib/buf/pagination';
import styles from './EpisodeList.module.scss';
import EpisodeCard from './EpisodeCard';

export interface IEpisodeListProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEpisodeClick(guid: string): void; // eslint-disable-line no-unused-vars
}

const EpisodeList: React.FC<IEpisodeListProps> = ({
  className,
  onEpisodeClick,
  ...props
}) => {
  const router = useRouter();
  const { data, config } = useContext(ListenContext);
  const { totalDuration, totalEpisodesCount } = data;
  const { pagination = defaultPagination } = config;
  const reversed = pagination?.sort === SortEnum.OLDEST;
  const { state } = useContext(PlayerContext);
  const { tracks } = state;
  const episodeCount = totalEpisodesCount || tracks?.length || 0;
  const episodesDurationsInt =
    totalDuration != null
      ? [
          convertDurationStringToIntegerArray(
            convertSecondsToDuration(totalDuration)
          )
        ]
      : tracks?.map(({ duration }) =>
          convertDurationStringToIntegerArray(duration)
        );
  const episodesDurationSums = sumDurationParts(episodesDurationsInt);
  const episodesDurationString = formatDurationParts(episodesDurationSums);
  const pages = pagination ? Math.ceil(episodeCount / pagination.pageSize) : 1;

  const handleSortClick = useCallback(() => {
    const newPagination = {
      ...pagination,
      pageIndex: 0,
      sort:
        pagination?.sort === SortEnum.NEWEST ? SortEnum.OLDEST : SortEnum.NEWEST
    };
    const pg = encodePaginationParam(newPagination);

    router.push({
      query: {
        ...router.query,
        pg
      }
    });
  }, [pagination, router]);

  const handlePageClick = useCallback(
    (newPageIndex: number) => {
      const newPagination = {
        ...pagination,
        pageIndex: Math.max(0, Math.min(newPageIndex, pages))
      };
      const pg = encodePaginationParam(newPagination);

      router.push({
        query: {
          ...router.query,
          pg
        }
      });
    },
    [pagination, pages, router]
  );

  const renderEpisodes = useMemo(
    () =>
      (tracks as IListenEpisodeData[])?.map((track, index) => (
        <EpisodeCard
          episode={track}
          index={index}
          onEpisodeClick={onEpisodeClick}
          key={track.guid}
        />
      )),
    [onEpisodeClick, tracks]
  );

  return (
    tracks && (
      <div {...props} className={clsx(styles.root, className)}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.button}
            onClick={handleSortClick}
          >
            <span
              className={clsx(styles.buttonIcon, {
                [styles.up]: reversed,
                [styles.down]: !reversed
              })}
            >
              <SwapVertIcon aria-label="Swap Episode Order" />
            </span>
            {episodeCount === 1 ? '1 Episode' : `${episodeCount} Episodes`}
          </button>
          {pages > 1 && (
            <span className={styles.pagination}>
              <button
                type="button"
                className={clsx(styles.button, styles.buttonIcon)}
                onClick={() => handlePageClick(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex <= 0}
              >
                <ChevronLeftIcon aria-label="Previous page" />
              </button>
              <span className={styles.pageInfo}>
                {pagination.pageIndex + 1}
                <span className={styles.pages}> / {pages}</span>
              </span>
              <button
                type="button"
                className={clsx(styles.button, styles.buttonIcon)}
                onClick={() => handlePageClick(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex >= pages - 1}
              >
                <ChevronRightIcon aria-label="Next page" />
              </button>
            </span>
          )}
          <span>{episodesDurationString}</span>
        </header>
        <div className={styles.episodeList}>
          <div className={styles.tracks}>{renderEpisodes}</div>
        </div>
      </div>
    )
  );
};

export default EpisodeList;
