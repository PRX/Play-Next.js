/**
 * @file Playlist.tsx
 * Comment to list player's audio tracks that can be used to change currently
 * playing track.
 */

import type React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { type Pagination, SortEnum } from '@interfaces/buf/pagination_pb';
import { defaultPagination, encodePaginationParam } from '@lib/buf/pagination';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import PlayerContext from '@contexts/PlayerContext';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import SwapVertIcon from '@svg/icons/SwapVert.svg';
import ChevronLeftIcon from '@svg/icons/ChevronLeft.svg';
import ChevronRightIcon from '@svg/icons/ChevronRight.svg';
import styles from './Playlist.module.scss';

export interface IPlaylistProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  totalEpisodesCount?: number;
  totalDuration?: number;
  pagination?: Pagination;
}

const Playlist: React.FC<IPlaylistProps> = ({
  className,
  pagination = defaultPagination,
  totalEpisodesCount,
  totalDuration,
  ...props
}) => {
  const router = useRouter();
  const {
    imageUrl: defaultThumbUrl,
    state,
    playTrack
  } = useContext(PlayerContext);
  const { tracks, currentTrack } = state;
  const rootRef = useRef(null);
  const [playlistStyles, setPlaylistStyles] = useState({});
  const reversed = pagination?.sort === SortEnum.OLDEST;
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

  const updatePlaylistStyles = useCallback(() => {
    if (!rootRef.current) return;

    const rect = rootRef.current?.getBoundingClientRect();

    setPlaylistStyles({
      '--playlist-top': `${rect.top}px`,
      '--playlist-height': `${rect.height}px`
    });
  }, [rootRef]);

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

  const handleTrackClick = (index: number) => () => {
    playTrack(index);
  };

  const handleResize = useCallback(() => {
    updatePlaylistStyles();
  }, [updatePlaylistStyles]);

  useEffect(() => {
    updatePlaylistStyles();

    setTimeout(() => {
      updatePlaylistStyles();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, updatePlaylistStyles]);

  return (
    tracks && (
      <div {...props} className={clsx(styles.root, className)}>
        <ThemeVars theme="Playlist" cssProps={styles} />
        <header className={styles.header}>
          <button
            type="button"
            className={styles.button}
            onClick={handleSortClick}
            title="Swap Episode Order"
          >
            <span
              className={clsx(styles.buttonIcon, {
                [styles.up]: reversed,
                [styles.down]: !reversed
              })}
            >
              <SwapVertIcon />
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
        <div ref={rootRef} className={styles.playlist} style={playlistStyles}>
          <div className={styles.tracks}>
            {tracks.map((track, index) => {
              const { guid, title, imageUrl, duration, explicit } = track;
              const thumbSrc = imageUrl || defaultThumbUrl;
              const trackDuration =
                duration?.indexOf(':') !== -1
                  ? duration
                  : convertSecondsToDuration(parseInt(duration, 10));
              return (
                <button
                  type="button"
                  className={clsx(styles.track, {
                    [styles.isCurrentTrack]: guid === currentTrack?.guid,
                    [styles.isExplicit]: explicit
                  })}
                  key={guid}
                  onClick={handleTrackClick(index)}
                >
                  {thumbSrc ? (
                    <div className={styles.trackThumbnail}>
                      <PrxImage
                        src={thumbSrc}
                        alt={`Thumbnail for "${title}".`}
                        width={parseInt(
                          styles['--playlist-thumbnail-size'],
                          10
                        )}
                        height={parseInt(
                          styles['--playlist-thumbnail-size'],
                          10
                        )}
                      />
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className={styles.trackTitle}>{title}</span>
                  {explicit && (
                    <span className={styles.explicit}>
                      <ExplicitIcon
                        className={styles.explicit}
                        aria-label="Explicit"
                      />
                    </span>
                  )}
                  <span className={styles.trackDuration}>{trackDuration}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default Playlist;
