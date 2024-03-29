/**
 * @file EpisodeTranscript.tsx
 * Render episode transcript.
 */

import type React from 'react';
import type { IAudioData, IListenEpisodeData } from '@interfaces/data';
import type {
  IRssPodcastTranscriptJson,
  IRssPodcastTranscriptJsonSegment
} from '@interfaces/data/IRssPodcast';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import IconButton from '@components/IconButton';
import PlayerContext from '@contexts/PlayerContext';
import ThemeVars from '@components/ThemeVars';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import PlayCircleIcon from '@svg/icons/PlayCircle.svg';
import styles from './EpisodeTranscript.module.scss';

export interface IEpisodeTranscriptProps {
  className?: string;
  data: IRssPodcastTranscriptJson;
  episode: IListenEpisodeData;
}

type SpeakerBlockProps = {
  segments: IRssPodcastTranscriptJsonSegment[];
  speaker?: string;
};

type SegmentProps = {
  data: IRssPodcastTranscriptJsonSegment;
  isSpoken: boolean;
  inCurrentBlock: boolean;
};

type PlayBlockBtnProps = {
  startTime: number;
};

const PlayBlockBtn = ({ startTime }: PlayBlockBtnProps) => {
  const { seekTo, play } = useContext(PlayerContext);

  const handleClick = () => {
    play();
    seekTo(startTime);
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
  };

  useEffect(() => {
    function handleTimeUpdate(e: Event) {
      const ae = e.target as HTMLAudioElement;
      const newIsCurrentBlock =
        startTime <= ae.currentTime + 0.2 && endTime >= ae.currentTime - 0.2;
      const newHasEnded = endTime < ae.currentTime + 0.1;
      const newCurrentSegmentIndex = segments?.findLastIndex(
        (segment) => segment.startTime <= ae.currentTime
      );

      setCurrentSegmentIndex(newCurrentSegmentIndex);
      setIsCurrentBlock(newIsCurrentBlock);
      setHasEnded(newHasEnded);
    }

    audioElm?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioElm?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioElm, endTime, segments, startTime]);

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
                isSpoken={index <= currentSegmentIndex}
                inCurrentBlock={isCurrentBlock}
              />
            );
          }),
        [currentSegmentIndex, isCurrentBlock, segments]
      )}
    </div>
  );
};

const EpisodeTranscript: React.FC<IEpisodeTranscriptProps> = ({
  className,
  data,
  episode
}) => {
  const { state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const currentTrack = useMemo(
    () => tracks[currentTrackIndex] || ({} as IAudioData),
    [currentTrackIndex, tracks]
  );
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);

  const { segments } = data;
  const hasMultipleSpeakers =
    segments.filter(({ speaker }) => !!speaker).length > 1;
  const speakerBlocks = useMemo(
    () =>
      segments
        ?.reduce((a, segment) => {
          const aClone = [...a];
          const previousSegment = aClone.pop();
          const isSpace = segment.body.trim().length === 0;

          if (
            !previousSegment ||
            isSpace ||
            segment.startTime > previousSegment.endTime
          ) {
            return [...a, segment];
          }

          const updatedSegment = {
            ...previousSegment,
            body: previousSegment.body + segment.body
          };

          return [...aClone, updatedSegment];
        }, [] as IRssPodcastTranscriptJsonSegment[])
        .reduce((a, segment) => {
          const aClone = [...a];
          const previousBlock = aClone.pop();
          const lastSegment = previousBlock?.segments.at(
            previousBlock.segments.length - 1
          );
          const speakerChanged = previousBlock?.speaker !== segment.speaker;
          const sentenceEnded = /[.?]$/.test(lastSegment?.body || '');
          const breakSegment =
            (hasMultipleSpeakers && speakerChanged) ||
            (!hasMultipleSpeakers && sentenceEnded);

          if (breakSegment) {
            return [
              ...a,
              {
                speaker: segment.speaker,
                segments: [segment]
              }
            ];
          }

          return [
            ...aClone,
            {
              ...previousBlock,
              segments: [...(previousBlock?.segments || []), segment]
            }
          ];
        }, [] as SpeakerBlockProps[]),
    [hasMultipleSpeakers, segments]
  );

  const scrollAreaRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const newIsCurrentTrack = episode.guid === currentTrack.guid;
    setIsCurrentTrack(newIsCurrentTrack);
  }, [currentTrack, episode.guid]);

  if (!speakerBlocks?.length) return null;

  return (
    <div ref={scrollAreaRef} className={clsx(className, styles.root)}>
      <ThemeVars theme="ClosedCaptionsFeed" cssProps={styles} />
      <h2 className={styles.heading}>Transcript</h2>
      {speakerBlocks.map((speakerBlockProps, index) => {
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
