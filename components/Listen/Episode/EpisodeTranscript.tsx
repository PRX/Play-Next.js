/**
 * @file EpisodeTranscript.tsx
 * Render episode transcript.
 */

import type React from 'react';
import type {
  IAudioData,
  IListenEpisodeData,
  IRssPodcastTranscriptJsonSegment,
  SpeakerSegmentsBlock
} from '@interfaces/data';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import IconButton from '@components/IconButton';
import PlayerContext from '@contexts/PlayerContext';
import Skeleton from '@components/Skeleton';
import ThemeVars from '@components/ThemeVars';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import getScrollParent from '@lib/parse/dom/getScrollParent';
import PlayCircleIcon from '@svg/icons/PlayCircle.svg';
import VerticalAlignCenterIcon from '@svg/icons/VerticalAlignCenter.svg';
import styles from './EpisodeTranscript.module.scss';

export interface IEpisodeTranscriptProps {
  className?: string;
  data: SpeakerSegmentsBlock[];
  episode: IListenEpisodeData;
  loading?: boolean;
}

type SpeakerBlockProps = SpeakerSegmentsBlock;

type SegmentProps = {
  data: IRssPodcastTranscriptJsonSegment;
  isSpoken: boolean;
  inCurrentBlock: boolean;
};

type PlayBlockBtnProps = {
  startTime: number;
};

const PlayBlockBtn = ({ startTime }: PlayBlockBtnProps) => {
  const { seekTo, play, state } = useContext(PlayerContext);

  const handleClick = () => {
    seekTo(startTime);

    if (!state.playing) {
      play();
    }
  };

  return (
    <IconButton onClick={handleClick}>
      <PlayCircleIcon />
    </IconButton>
  );
};

const Segment = ({ data, isSpoken, inCurrentBlock }: SegmentProps) => {
  const { seekTo } = useContext(PlayerContext);
  const { body, startTime } = data;
  // const [isSpoken, setIsSpoken] = useState(startTime <= audioElm?.currentTime);
  const hasWords = /\b\w+\b/.test(body);
  const isSpace = body.trim().length === 0;
  const isPunctuation = /^[.,?;:]$/.test(body.trim());

  function handleClick() {
    seekTo(startTime);
  }

  const rootProps = {
    className: clsx(styles.segment, {
      [styles.punctuation]: isPunctuation,
      [styles.space]: isSpace
    }),
    'data-start': startTime,
    ...(inCurrentBlock && isSpoken && !isSpace && { 'data-spoken': true }),
    ...(hasWords && { onClick: handleClick })
  };

  /**
   * Setup audio element event handlers.
   */
  // useEffect(() => {
  //   const handleUpdate = (e: Event) => {
  //     const ae = e.target as HTMLAudioElement;
  //     const newIsSpoken = startTime <= ae.currentTime + 0.1;
  //     if (newIsSpoken !== isSpoken) {
  //       setIsSpoken(newIsSpoken);
  //     }
  //   };

  //   if (inCurrentCue && hasWords) {
  //     setIsSpoken(startTime <= audioElm?.currentTime);
  //     audioElm?.addEventListener('timeupdate', handleUpdate);
  //   } else {
  //     setIsSpoken(false);
  //     audioElm?.removeEventListener('timeupdate', handleUpdate);
  //   }

  //   return () => {
  //     audioElm?.removeEventListener('timeupdate', handleUpdate);
  //   };
  // }, [audioElm, hasWords, inCurrentCue, isSpoken, startTime]);

  if (!hasWords) {
    return <span {...rootProps}>{body}</span>;
  }

  return (
    <button type="button" {...rootProps}>
      {body}
    </button>
  );
};

const SpeakerBlock = ({ segments, speaker }: SpeakerBlockProps) => {
  const currentBlockRef = useRef<HTMLDivElement>();
  const scrollElementRef = useRef<Element>();
  const firstSegment = segments.at(0);
  const lastSegment = segments.at(segments.length - 1);
  const { startTime } = firstSegment;
  const { endTime } = lastSegment;
  const { audioElm } = useContext(PlayerContext);
  const [isCurrentBlock, setIsCurrentBlock] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>();
  const [showJumpButton, setShowJumpButton] = useState(false);
  const rootProps = {
    className: clsx(styles.speakerBlock),
    ...(isCurrentBlock && {
      ref: currentBlockRef,
      'data-current': ''
    }),
    ...(hasEnded && {
      'data-ended': ''
    })
  } as Partial<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  >;

  const checkCurrentBlockOffScreen = () => {
    const currentBlockRect = currentBlockRef.current?.getBoundingClientRect();
    const scrollingElement = scrollElementRef.current;
    const scrollAreaRect = scrollingElement.getBoundingClientRect();
    const offScreen =
      (!!currentBlockRect && currentBlockRect?.top > scrollAreaRect.bottom) ||
      currentBlockRect?.bottom < scrollAreaRect.top;

    return offScreen;
  };

  const scrollToCurrentBlock = (smooth?: boolean) => {
    const lastSpokenElm = currentBlockRef.current?.querySelector(
      '[data-spoken]:not(:has(~ [data-spoken]))'
    );

    lastSpokenElm?.scrollIntoView({
      block: 'center',
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  const handleJumpBtnClick = () => {
    scrollToCurrentBlock();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (checkCurrentBlockOffScreen()) {
        setShowJumpButton(true);
      } else {
        setShowJumpButton(false);
      }
    };

    const handleTimeUpdate = (e: Event) => {
      const ae = e.target as HTMLAudioElement;
      const newIsCurrentBlock =
        startTime <= ae.currentTime && endTime >= ae.currentTime;
      const newHasEnded = endTime < ae.currentTime;
      const newCurrentSegmentIndex = segments?.findLastIndex(
        (segment) => segment.startTime <= ae.currentTime + 0.1
      );

      setCurrentSegmentIndex(newCurrentSegmentIndex);
      setIsCurrentBlock(newIsCurrentBlock);
      setHasEnded(newHasEnded);

      if (isCurrentBlock && currentBlockRef.current) {
        if (!checkCurrentBlockOffScreen()) {
          scrollToCurrentBlock(true);
        } else {
          setShowJumpButton(true);
        }
      }
    };

    scrollElementRef.current =
      scrollElementRef.current ||
      (currentBlockRef.current && getScrollParent(currentBlockRef.current));

    audioElm?.addEventListener('timeupdate', handleTimeUpdate);
    scrollElementRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      audioElm?.removeEventListener('timeupdate', handleTimeUpdate);
      scrollElementRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [audioElm, endTime, isCurrentBlock, segments, startTime]);

  return (
    <>
      {showJumpButton && isCurrentBlock && (
        <button
          type="button"
          className={styles.jumpButton}
          onClick={handleJumpBtnClick}
        >
          <VerticalAlignCenterIcon />
          Scroll to current caption
        </button>
      )}
      <div {...rootProps}>
        <h3 className={styles.speakerHeading}>
          {speaker && (
            <span className={styles.speakerHeadingSpeaker}>{speaker}</span>
          )}
          <span className={styles.speakerHeadingTime}>
            {convertSecondsToDuration(startTime)}
            <PlayBlockBtn startTime={startTime} />
          </span>
        </h3>
        {useMemo(
          () =>
            segments.map((segment, index) => {
              const key = `${segment.body}:${segment.startTime}:${index}`;
              return (
                <Segment
                  data={segment}
                  key={key}
                  isSpoken={hasEnded || index <= currentSegmentIndex}
                  inCurrentBlock={isCurrentBlock}
                />
              );
            }),
          [currentSegmentIndex, hasEnded, isCurrentBlock, segments]
        )}
      </div>
    </>
  );
};

const EpisodeTranscript = ({
  className,
  data,
  episode,
  loading
}: IEpisodeTranscriptProps) => {
  const { state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const currentTrack = useMemo(
    () => tracks[currentTrackIndex] || ({} as IAudioData),
    [currentTrackIndex, tracks]
  );
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);

  useEffect(() => {
    const newIsCurrentTrack = episode.guid === currentTrack.guid;
    setIsCurrentTrack(newIsCurrentTrack);
  }, [currentTrack, episode.guid]);

  if (!data?.length && !loading) return null;

  if (loading) {
    return (
      <>
        {[...new Array(10).fill(0).keys()].map((k) => (
          <div className={styles.speakerBlock} key={k}>
            <h3 className={styles.speakerHeading}>
              <Skeleton
                className={styles.speakerHeadingSpeaker}
                width="10ch"
                height="1.5rem"
              />
              <Skeleton width="4.5ch" />
            </h3>
            <Skeleton lines={3} />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={clsx(className, styles.root)}>
      <ThemeVars theme="ClosedCaptionsFeed" cssProps={styles} />
      {data.map((speakerBlockProps, index) => {
        const { speaker, segments: blockSegments } = speakerBlockProps;
        const firstSegment = blockSegments.at(0);
        const { startTime } = firstSegment;
        const key = `${speaker}:${startTime}:${index}`;

        if (!isCurrentTrack) {
          const bodyCompiled = blockSegments.reduce(
            (a, { body }) => a + body,
            ''
          );
          return (
            <div className={styles.speakerBlock} key={key}>
              <h3 className={styles.speakerHeading}>
                <span className={styles.speakerHeadingSpeaker}>{speaker}</span>
                <span className={styles.speakerHeadingTime}>
                  {convertSecondsToDuration(startTime)}
                </span>
              </h3>
              <span className={styles.body}>{bodyCompiled}</span>
            </div>
          );
        }

        if (isCurrentTrack) {
          return <SpeakerBlock {...speakerBlockProps} key={key} />;
        }

        return null;
      })}
    </div>
  );
};

export default EpisodeTranscript;
