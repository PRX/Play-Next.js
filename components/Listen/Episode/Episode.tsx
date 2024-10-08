/**
 * @file Episode.tsx
 * Component for viewing an episode on listen page.
 */

import type React from 'react';
import type {
  IListenEpisodeData,
  SpeakerSegmentsBlock
} from '@interfaces/data';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { filesize } from 'filesize';
import Link from 'next/link';
import HtmlContent from '@components/HtmlContent';
import IconButton from '@components/IconButton';
import listenStyles from '@components/Listen/Listen.module.scss';
import Marquee from '@components/Marquee';
import PrxImage from '@components/PrxImage';
import ShareMenu from '@components/ShareMenu';
import ThemeVars from '@components/ThemeVars';
import PlayerContext from '@contexts/PlayerContext';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import fetchAudioTranscriptData from '@lib/fetch/transcript/fetchAudioTranscriptData';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import ArrowLeftIcon from '@svg/icons/ArrowLeft.svg';
import DownloadIcon from '@svg/icons/FileDownload.svg';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import PlayCircleIcon from '@svg/icons/PlayCircle.svg';
import PauseCircleIcon from '@svg/icons/PauseCircle.svg';
import styles from './Episode.module.scss';
import EpisodeTranscript from './EpisodeTranscript';

export interface IEpisodeProps {
  data: IListenEpisodeData;
  onClose(): void;
}

const episodeViews = ['description', 'transcript'] as const;
export type EpisodeView = (typeof episodeViews)[number];

const Episode = ({ data, onClose }: IEpisodeProps) => {
  const [view, setView] = useState<EpisodeView>('description');
  const {
    imageUrl: defaultThumbUrl,
    state,
    playTrack,
    pause
  } = useContext(PlayerContext);
  const { tracks, currentTrackIndex, playing } = state;
  const {
    guid,
    title,
    url,
    fileSize,
    imageUrl,
    duration,
    explicit,
    pubDate,
    content,
    link,
    transcripts
  } = data || {};
  const index = useMemo(
    () => tracks.findIndex((track) => track.guid === guid),
    [guid, tracks]
  );
  const [transcript, setTranscript] = useState<
    SpeakerSegmentsBlock[] | null | false
  >(null);
  const isCurrentTrack = index === currentTrackIndex;
  const hasTranscripts = !!transcripts?.length;
  const transcriptLoading = hasTranscripts && transcript === null;
  const showTranscript = hasTranscripts && transcript !== false;
  const showViewNav = showTranscript;
  const thumbSrc = imageUrl || defaultThumbUrl;
  const thumbSizes = [
    `(min-width: ${listenStyles.breakpointFull}) ${styles['--episode-thumbnail-size']}`,
    `${styles['--episode-thumbnail-size--mobile']}`
  ].join(',');
  const pubDateFormatted = useMemo(
    () =>
      pubDate &&
      new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(
        new Date(pubDate)
      ),
    [pubDate]
  );
  const episodesDurationsInt = convertDurationStringToIntegerArray(duration);
  const episodesDurationSums = sumDurationParts([episodesDurationsInt]);
  const episodesDurationString = formatDurationParts(episodesDurationSums);
  const [shareShown, setShareShown] = useState(false);
  const downloadTitle = `Download Episode (${filesize(fileSize || 0)})`;

  const handlePlayButtonClick = useCallback(() => {
    playTrack(index);
  }, [index, playTrack]);

  const handlePauseButtonClick = useCallback(() => {
    pause();
  }, [pause]);

  const handleEpisodeBackClick = () => {
    onClose();
  };

  const handleShareButtonClick = () => {
    setShareShown(true);
  };
  const handleShareCloseClick = () => {
    setShareShown(false);
  };

  useEffect(() => {
    if (transcripts?.length) {
      (async () => {
        const response = await fetchAudioTranscriptData(data);

        setView('description');
        setTranscript(response || false);
      })();
    }
  }, [data, transcripts]);

  if (!data) return null;

  return (
    <>
      <ThemeVars theme="Episode" cssProps={styles} />
      <div className={styles.root} data-episode-view={view}>
        <div className={clsx(styles.nav, { [styles.isExplicit]: explicit })}>
          <IconButton onClick={handleEpisodeBackClick} title="Back To Playlist">
            <ArrowLeftIcon />
          </IconButton>
          {explicit && (
            <span className={styles.explicit}>
              <ExplicitIcon className={styles.explicit} aria-label="Explicit" />
            </span>
          )}
          <Marquee>
            <h2 className={styles.title}>{title}</h2>
          </Marquee>
        </div>
        <div className={styles.main}>
          <div className={styles.thumbnail}>
            <PrxImage
              src={thumbSrc}
              alt={`Thumbnail for "${title}".`}
              fill
              sizes={thumbSizes}
            />
          </div>
          <div className={styles.header}>
            <div className={styles.headerMain}>
              <span className={styles.controls}>
                {playing && isCurrentTrack ? (
                  <IconButton
                    className={styles.pause}
                    onClick={handlePauseButtonClick}
                    title="Pause Episode"
                  >
                    <PauseCircleIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    className={styles.play}
                    onClick={handlePlayButtonClick}
                    title="Play Episode"
                  >
                    <PlayCircleIcon />
                  </IconButton>
                )}
              </span>

              <span className={styles.info}>
                <span className={styles.infoWrapper}>
                  <span className={styles.pubDate}>{pubDateFormatted}</span>
                  <span className={styles.duration}>
                    {episodesDurationString}
                  </span>
                </span>
              </span>
            </div>
            <div className={styles.menu}>
              <IconButton href={url} title={downloadTitle} download>
                <DownloadIcon aria-hidden />
              </IconButton>

              <ShareMenu
                className={clsx(styles.menuButton, styles.shareButton)}
                onOpen={handleShareButtonClick}
                onClose={handleShareCloseClick}
                isOpen={shareShown}
                portalId="episode-modals"
                url={link}
                twitterTitle={title}
                emailSubject={title}
                emailBody="Check out this episode!"
              />
            </div>
            {showViewNav && (
              <nav className={styles.viewNav}>
                {episodeViews.map((viewName) => (
                  <Link
                    className={styles.viewNavButton}
                    href={`#${viewName}`}
                    onClick={() => {
                      setView(viewName);
                    }}
                    data-current={view === viewName}
                    key={viewName}
                  >
                    {viewName}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <div className={styles.content}>
            <div id="description" className={styles.description}>
              <HtmlContent html={content} />
            </div>

            {showTranscript && (
              <div id="transcript" className={styles.transcript}>
                <h2 className={styles.heading}>Transcript</h2>
                <EpisodeTranscript
                  data={transcript}
                  episode={data}
                  loading={transcriptLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Episode;
