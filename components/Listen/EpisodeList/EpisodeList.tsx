/**
 * @file EpisodeList.tsx
 * Component to list episodes on listen page.
 */

import type React from 'react';
import type { IListenEpisodeData } from '@interfaces/data';
import { useContext, useMemo, useState } from 'react';
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
  const [reversed, setReversed] = useState(false);
  const episodesDurationsInt = tracks?.map(({ duration }) =>
    convertDurationStringToIntegerArray(duration)
  );
  const episodesDurationSums = sumDurationParts(episodesDurationsInt);
  const episodesDurationString = formatDurationParts(episodesDurationSums);

  const handleSortClick = () => {
    const reversedTracks = [...tracks].reverse();

    setReversed(!reversed);
    setTracks(reversedTracks);
  };

  const renderEpisodes = useMemo(
    () => (
      <>
        {(tracks as IListenEpisodeData[]).map((track, index) => (
          <EpisodeCard
            episode={track}
            index={index}
            onEpisodeClick={onEpisodeClick}
            key={track.guid}
            title="test"
          />
        ))}
      </>
    ),
    [onEpisodeClick, tracks]
  );

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
              <SwapVertIcon aria-label="Swap Episode Order" />
            </span>
            {tracks?.length === 1 ? '1 Episode' : `${tracks.length} Episodes`}
          </button>
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
