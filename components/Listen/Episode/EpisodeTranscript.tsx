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
import {
  createContext,
  forwardRef,
  KeyboardEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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

type TranscriptContextProps = {
  // eslint-disable-next-line no-unused-vars
  setScrollTarget?(elm: HTMLElement): void;
  // eslint-disable-next-line no-unused-vars
  scrollToCurrentBlock?(smooth?: boolean): void;
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
const TranscriptContext = createContext<TranscriptContextProps>({});

const Segment = forwardRef<HTMLSpanElement, SegmentProps>(
  ({ data, isSpoken, inCurrentBlock }, ref) => {
    const { seekTo } = useContext(PlayerContext);
    const { body, startTime } = data;
    // const [isSpoken, setIsSpoken] = useState(startTime <= audioElm?.currentTime);
    const hasWords = /\b\w+\b/.test(body);
    const isSpace = body.trim().length === 0;
    const isPunctuation = /^[.,?;:]$/.test(body.trim());

    function handleClick() {
      seekTo(startTime);
    }

    const handleKeyDown: KeyboardEventHandler<HTMLSpanElement> = (e) => {
      if (['ENTER', ' '].includes(e.key.toUpperCase())) {
        e.stopPropagation();
        e.preventDefault();

        seekTo(startTime);
      }
    };

    const rootProps = {
      className: clsx(styles.segment, {
        [styles.punctuation]: isPunctuation,
        [styles.space]: isSpace
      }),
      'data-start': startTime,
      ...(inCurrentBlock && isSpoken && !isSpace && { 'data-spoken': true }),
      ...(hasWords && { onClick: handleClick }),
      ref
    };

    if (!hasWords) {
      return <span {...rootProps}>{body}</span>;
    }

    return (
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rootProps}
      >
        {body}
      </span>
    );
  }
);

const SpeakerBlock = ({ segments, speaker }: SpeakerBlockProps) => {
  const { setScrollTarget, scrollToCurrentBlock } =
    useContext(TranscriptContext);
  const firstSegment = segments.at(0);
  const lastSegment = segments.at(segments.length - 1);
  const { startTime } = firstSegment;
  const { endTime } = lastSegment;
  const { audioElm } = useContext(PlayerContext);
  const [isCurrentBlock, setIsCurrentBlock] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>();
  const rootProps = {
    className: clsx(styles.speakerBlock),
    ...(isCurrentBlock && {
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

  useEffect(() => {
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

      if (isCurrentBlock && scrollToCurrentBlock) {
        scrollToCurrentBlock();
      }
    };

    audioElm?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioElm?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [
    audioElm,
    endTime,
    isCurrentBlock,
    scrollToCurrentBlock,
    segments,
    startTime
  ]);

  return (
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
                {...(currentSegmentIndex === index && { ref: setScrollTarget })}
              />
            );
          }),
        [
          currentSegmentIndex,
          hasEnded,
          isCurrentBlock,
          segments,
          setScrollTarget
        ]
      )}
    </div>
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
  const [showJumpButton, setShowJumpButton] = useState(false);
  const scrollAreaRef = useRef<Element>();
  const currentSegmentRef = useRef<HTMLElement>();

  const checkCurrentCaptionOffScreen = () => {
    if (!scrollAreaRef.current) return false;

    const currentBlockRect = currentSegmentRef.current?.getBoundingClientRect();
    const scrollingElement = scrollAreaRef.current;
    const scrollAreaRect = scrollingElement.getBoundingClientRect();
    const offScreen =
      (!!currentBlockRect && currentBlockRect?.top > scrollAreaRect.bottom) ||
      currentBlockRect?.bottom < scrollAreaRect.top;

    return offScreen;
  };

  const scrollToCurrentBlock = useCallback(
    (smooth?: boolean) => {
      if (showJumpButton || !scrollAreaRef.current?.scrollTop) return;

      currentSegmentRef.current?.scrollIntoView({
        block: 'center',
        behavior: smooth || !checkCurrentCaptionOffScreen() ? 'smooth' : 'auto'
      });
    },
    [showJumpButton]
  );

  const handleScroll = useCallback(() => {
    const show = showJumpButton || checkCurrentCaptionOffScreen();

    setShowJumpButton(show);
  }, [showJumpButton]);

  const setScrollTarget = useCallback(
    (elm: HTMLElement) => {
      currentSegmentRef.current = elm || currentSegmentRef.current;

      scrollAreaRef.current?.removeEventListener('scroll', handleScroll);

      scrollAreaRef.current = getScrollParent(currentSegmentRef.current);

      scrollAreaRef.current?.addEventListener('scroll', handleScroll);
    },
    [handleScroll]
  );

  const contextValues: TranscriptContextProps = useMemo(
    () => ({
      setScrollTarget,
      scrollToCurrentBlock
    }),
    [scrollToCurrentBlock, setScrollTarget]
  );

  const handleJumpBtnClick = () => {
    setShowJumpButton(false);
    scrollToCurrentBlock();
  };

  useEffect(() => {
    const newIsCurrentTrack = episode.guid === currentTrack.guid;
    setIsCurrentTrack(newIsCurrentTrack);
  }, [currentTrack, episode.guid]);

  useEffect(
    () => () => {
      scrollAreaRef.current?.removeEventListener('scroll', handleScroll);
    },
    [handleScroll]
  );

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
    <TranscriptContext.Provider value={contextValues}>
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
                  <span className={styles.speakerHeadingSpeaker}>
                    {speaker}
                  </span>
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
        {showJumpButton && (
          <button
            type="button"
            className={styles.jumpButton}
            onClick={handleJumpBtnClick}
          >
            <VerticalAlignCenterIcon />
            Scroll to current caption
          </button>
        )}
      </div>
    </TranscriptContext.Provider>
  );
};

export default EpisodeTranscript;
