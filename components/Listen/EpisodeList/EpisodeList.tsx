/**
 * @file EpisodeList.tsx
 * Component to list episodes on listen page.
 */

import type React from 'react';
import type { IListenEpisodeData } from '@interfaces/data';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import PlayerContext from '@contexts/PlayerContext';
import ThemeVars from '@components/ThemeVars';
import SwapVertIcon from '@svg/icons/SwapVert.svg';
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
  const { state, setTracks } = useContext(PlayerContext);
  const { tracks } = state;
  const rootRef = useRef(null);
  const [episodeListStyles, setEpisodeListStyles] = useState({});
  const [reversed, setReversed] = useState(false);
  const episodesDurationsInt = tracks?.map(({ duration }) =>
    convertDurationStringToIntegerArray(duration)
  );
  const episodesDurationSums = sumDurationParts(episodesDurationsInt);
  const episodesDurationString = formatDurationParts(episodesDurationSums);

  const updateEpisodeListStyles = useCallback(() => {
    const rect = rootRef.current.getBoundingClientRect();
    setEpisodeListStyles({
      '--episodeList-top': `${rect.top}px`,
      '--episodeList-height': `${rect.height}px`
    });
  }, []);

  const handleSortClick = () => {
    const reversedTracks = [...tracks].reverse();

    setReversed(!reversed);
    setTracks(reversedTracks);
  };

  const handleResize = useCallback(() => {
    updateEpisodeListStyles();
  }, [updateEpisodeListStyles]);

  const renderEpisodes = useMemo(
    () => (
      <>
        {(tracks as IListenEpisodeData[]).map((track, index) => (
          <EpisodeCard
            episode={track}
            index={index}
            onEpisodeClick={onEpisodeClick}
            key={track.guid}
          />
        ))}
      </>
    ),
    [onEpisodeClick, tracks]
  );

  useEffect(() => {
    updateEpisodeListStyles();

    setTimeout(() => {
      updateEpisodeListStyles();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, updateEpisodeListStyles]);

  return (
    tracks && (
      <div {...props} className={clsx(styles.root, className)}>
        <ThemeVars theme="EpisodeList" cssProps={styles} />
        <header className={styles.header}>
          <button
            type="button"
            className={styles.button}
            onClick={handleSortClick}
          >
            <span
              className={clsx(styles.buttonIcon, {
                [styles.up]: !reversed,
                [styles.down]: reversed
              })}
            >
              <SwapVertIcon aria-label="Swap episode order" />
            </span>
            {tracks?.length === 1 ? '1 Episode' : `${tracks.length} Episodes`}
          </button>
          <span>{episodesDurationString}</span>
        </header>
        <div
          ref={rootRef}
          className={styles.episodeList}
          style={episodeListStyles}
        >
          <div className={styles.tracks}>{renderEpisodes}</div>
        </div>
      </div>
    )
  );
};

export default EpisodeList;
