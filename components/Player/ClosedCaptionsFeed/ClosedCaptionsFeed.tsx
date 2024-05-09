/**
 * @file FollowMenu.tsx
 * Provides chat style message feed for closed captions.
 */

import type React from 'react';
import type { CSSProperties, KeyboardEventHandler } from 'react';
import type { IAudioData } from '@interfaces/data';
import type {
  IRssPodcastTranscriptJson,
  IRssPodcastTranscriptJsonSegment
} from '@interfaces/data/IRssPodcast';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import ThemeVars from '@components/ThemeVars';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import generateSpeakerColor from '@lib/generate/string/generateSpeakerColor';
import getVttCueSpeaker from '@lib/parse/dom/getVttCueSpeaker';
import PlayCircleIcon from '@svg/icons/PlayCircle.svg';
import VerticalAlignCenterIcon from '@svg/icons/VerticalAlignCenter.svg';
import styles from './ClosedCaptionsFeed.module.scss';

export interface IClosedCaptionsProps {
  speakerColors?: string[];
}

type CuePosition = 'left' | 'right';

type CaptionCueProps = {
  cue: VTTCue;
  segments?: IRssPodcastTranscriptJsonSegment[];
  inCurrentCaption?: boolean;
  isComplete?: boolean;
};

type CaptionProps = {
  cues: VTTCue[];
  segments?: IRssPodcastTranscriptJsonSegment[];
  speaker?: string;
  color?: string;
  position?: 'left' | 'right';
  isCurrent?: boolean;
  isComplete?: boolean;
};

type SegmentProps = {
  data: IRssPodcastTranscriptJsonSegment;
  inCurrentCue: boolean;
};

type ClosedCaptionsContextProps = {
  // eslint-disable-next-line no-unused-vars
  setScrollTarget?(element: HTMLElement, cue: VTTCue): void;
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

const ClosedCaptionsContext = createContext<ClosedCaptionsContextProps>({
  setScrollTarget: () => {}
});

const getCurrentCue = (textTrack: TextTrack) =>
  [...(textTrack?.activeCues || [])].at(0) as VTTCue;

const getNextCue = (textTrack: TextTrack) => {
  const currentCue = getCurrentCue(textTrack);
  const cues = [...textTrack.cues] as VTTCue[];
  const currentCueIndex = cues.findIndex(
    (cue) => currentCue && cue.id === currentCue.id
  );

  return currentCueIndex > -1 ? cues.at(currentCueIndex + 1) : null;
};

const binaryFindCaption = (captions: CaptionProps[], cue: VTTCue) => {
  if (!captions?.length || !cue) return null;

  let low = 0;
  let high = captions.length - 1;
  let mid: number;

  while (high >= low) {
    mid = low + Math.floor((high - low) / 2);
    const caption = captions.at(mid);

    // If the cue is in the current caption, we are done.
    if (caption.cues.includes(cue)) {
      return caption;
    }

    // If cue start time is before the caption's first cue start time,
    // caption can only be in the left subarray.
    if (cue.startTime < caption.cues.at(0).startTime) {
      high = mid - 1;
    } else {
      // Other wise the caption will be 1n the right subarray.
      low = mid + 1;
    }
  }

  // Cue not found in any captions.
  return null;
};

const Segment = ({ data, inCurrentCue }: SegmentProps) => {
  const { audioElm } = useContext(PlayerContext);
  const { body } = data;
  const [spoken, setSpoken] = useState(false);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    const handleUpdate = () => {
      setSpoken(() => data.startTime <= audioElm.currentTime);
    };

    if (inCurrentCue) {
      audioElm.addEventListener('timeupdate', handleUpdate);
    } else {
      audioElm.removeEventListener('timeupdate', handleUpdate);
    }

    handleUpdate();

    return () => {
      audioElm.removeEventListener('timeupdate', handleUpdate);
    };
  }, [audioElm, audioElm.currentTime, data.startTime, inCurrentCue]);

  return (
    <span className={styles.segment} {...(spoken && { 'data-spoken': '' })}>
      {body}
    </span>
  );
};

const CaptionCue = ({ cue, segments, inCurrentCaption }: CaptionCueProps) => {
  const { seekTo, play, state, audioElm } = useContext(PlayerContext);
  const { setScrollTarget } = useContext(ClosedCaptionsContext);
  const { id, text, startTime, endTime, track } = cue;
  const currentCue = getCurrentCue(track);
  const [isCurrent, setIsCurrent] = useState(id === currentCue?.id);
  const [isComplete, setIsComplete] = useState(audioElm.currentTime > endTime);
  const cueSegments = useMemo(
    () =>
      segments
        ?.filter(
          ({ startTime: st, endTime: et }) => st >= startTime && et <= endTime
        )
        .reduce((a, currentSegment) => {
          const aClone = [...a];
          const segment = aClone.pop();

          if (!segment || currentSegment.startTime > segment.endTime) {
            return [...a, currentSegment];
          }

          const updatedSegment = {
            ...segment,
            body: segment.body + currentSegment.body
          };

          return [...aClone, updatedSegment];
        }, [] as IRssPodcastTranscriptJsonSegment[]),
    [segments, startTime, endTime]
  );
  const hasSegments = !!cueSegments?.length;
  const hasText = hasSegments || !!text.trim().length;
  const rootProps = {
    className: clsx(styles.captionCue),
    ...(isCurrent && {
      'data-current': ''
    }),
    ...(isComplete && {
      'data-complete': ''
    }),
    ...(isCurrent && { ref: (elm: HTMLElement) => setScrollTarget(elm, cue) })
  };

  function handleClick() {
    seekTo(cue.startTime);

    if (!state.playing) {
      play();
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLSpanElement> = (e) => {
    if (['ENTER', ' '].includes(e.key.toUpperCase())) {
      e.stopPropagation();
      e.preventDefault();

      seekTo(startTime);

      if (!state.playing) {
        play();
      }
    }
  };

  useEffect(() => {
    setIsComplete(audioElm.currentTime > endTime);
  }, [audioElm.currentTime, endTime]);

  useEffect(() => {
    function handleCueEnter() {
      setIsCurrent(true);
    }

    function handleCueExit() {
      setIsCurrent(false);
    }

    if (inCurrentCaption) {
      cue.addEventListener('enter', handleCueEnter);
      cue.addEventListener('exit', handleCueExit);
    } else {
      cue.removeEventListener('enter', handleCueEnter);
      cue.removeEventListener('exit', handleCueExit);
    }

    setIsComplete(audioElm.currentTime > endTime);
    setIsCurrent(cue.id === currentCue?.id);

    return () => {
      cue.removeEventListener('enter', handleCueEnter);
      cue.removeEventListener('exit', handleCueExit);
    };
  }, [
    audioElm.currentTime,
    cue,
    currentCue?.id,
    endTime,
    inCurrentCaption,
    isCurrent
  ]);

  if (!hasText) return null;

  if (!hasSegments) {
    const sanitizedText = text.replace(/^<[^>]+>/i, '').trimStart();
    const outputText = `${
      /^[.,?!]/i.test(sanitizedText) ? '' : ' '
    }${sanitizedText}`;
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rootProps}
      >
        {outputText}
      </span>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rootProps}
    >
      {cueSegments.map((s) => (
        <Segment
          data={s}
          inCurrentCue={isCurrent}
          key={`segment:${s.startTime}`}
        />
      ))}
    </span>
  );
};

const Caption = ({
  cues,
  speaker,
  color,
  position,
  segments,
  isCurrent,
  isComplete
}: CaptionProps) => {
  const { audioElm } = useContext(PlayerContext);
  const { startTime } = cues.at(0);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  }>();
  const rootProps = {
    className: clsx(styles.caption),
    'data-position': position || 'left',
    ...(speaker && { 'data-speaker': speaker }),
    ...(isCurrent && { 'data-current': '' }),
    ...(isComplete && { 'data-complete': '' }),
    ...((color || mousePosition) && {
      style: {
        ...(color && { '--cc-speaker--color': color }),
        ...(mousePosition && {
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`
        })
      } as CSSProperties
    })
  };
  const bodyRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const bodyElm = bodyRef.current;

    function handleMouseMove(e: MouseEvent) {
      setMousePosition({ x: e.offsetX, y: e.offsetY });
    }

    bodyElm?.addEventListener('mousemove', handleMouseMove);

    return () => {
      bodyElm?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div {...rootProps}>
      <h3 className={styles.speakerHeading}>
        {speaker ? (
          <span className={styles.speakerHeadingSpeaker}>{speaker}</span>
        ) : (
          <span />
        )}
        <span className={styles.speakerHeadingTime}>
          {convertSecondsToDuration(startTime)}
          <PlayBlockBtn startTime={startTime} />
        </span>
      </h3>
      <div className={styles.captionBody} ref={bodyRef}>
        {cues.map((cue) => (
          <CaptionCue
            cue={cue}
            segments={segments}
            inCurrentCaption={isCurrent}
            isComplete={audioElm.currentTime > cue.endTime}
            key={`caption_cue:${cue.id}`}
          />
        ))}
      </div>
    </div>
  );
};

const ClosedCaptionsFeed: React.FC<IClosedCaptionsProps> = ({
  speakerColors
}) => {
  const { audioElm, state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const currentTrack = tracks[currentTrackIndex] || ({} as IAudioData);

  const [currentTextTrack, setCurrentTextTrack] = useState(
    audioElm?.textTracks?.[0]
  );
  const [currentCue, setCurrentCue] = useState(getCurrentCue(currentTextTrack));
  const currentVttCues = useMemo(
    () => [...(currentTextTrack?.cues || [])] as VTTCue[],
    [currentTextTrack?.cues]
  );

  const scrollAreaRef = useRef<HTMLDivElement>();
  const currentCaptionRef = useRef<HTMLElement>();

  const [transcriptData, setTranscriptData] =
    useState<IRssPodcastTranscriptJson>();
  const { segments } = transcriptData || {};
  const [showJumpButton, setShowJumpButton] = useState(false);
  // const cueIndex = currentVttCues?.findIndex(({ id }) => id === currentCue?.id);
  const nextExpectedCue = useRef<VTTCue>();
  const speakersColorMap = useRef(new Map<string, string>());

  const cuePositions = useMemo(() => {
    const positionsMap = new Map<string, CuePosition>();

    if (currentVttCues?.length) {
      let previousSpeaker = getVttCueSpeaker(currentVttCues[0]);
      let currentPosition: CuePosition = 'left';

      currentVttCues.forEach((cue) => {
        const cueSpeaker = getVttCueSpeaker(cue);

        if (cueSpeaker !== previousSpeaker) {
          if (!speakersColorMap.current.has(cueSpeaker)) {
            const speakerNumber = speakersColorMap.current.size;
            const speakerColor = generateSpeakerColor(
              speakerNumber,
              speakerColors,
              35,
              81
            );
            speakersColorMap.current.set(cueSpeaker, speakerColor);
          }

          previousSpeaker = cueSpeaker;
          currentPosition = currentPosition === 'left' ? 'right' : 'left';
        }

        positionsMap.set(cue.id, currentPosition);
      });
    }

    return positionsMap;
  }, [currentVttCues, speakerColors]);

  const captions = useMemo(
    () =>
      currentVttCues?.reduce<CaptionProps[]>((a, cue) => {
        const aClone = [...a];
        const previousCaption = aClone.pop();
        const previousCaptionLastCue = previousCaption?.cues.at(-1);
        const speaker = getVttCueSpeaker(cue);
        const speakerChanged = !!(
          previousCaption && speaker !== previousCaption.speaker
        );
        const tooManyCues = previousCaption?.cues.length > 3;
        const sentenceEnded = /[.?!]$/.test(
          previousCaptionLastCue?.text.trimEnd() || ''
        );
        const hasLongPause = !!(
          previousCaptionLastCue &&
          cue.startTime - previousCaptionLastCue.endTime > 1
        );

        // Start new caption when...
        if (
          !previousCaption ||
          speakerChanged ||
          (sentenceEnded && (tooManyCues || hasLongPause))
        ) {
          return [
            ...a,
            {
              cues: [cue],
              segments,
              speaker,
              color: speakersColorMap.current.get(speaker),
              position: cuePositions.get(cue.id) || 'left'
            }
          ];
        }

        // Continue adding cues to caption...
        return [
          ...aClone,
          {
            ...previousCaption,
            cues: [...(previousCaption?.cues || []), cue]
          }
        ];
      }, []),
    [cuePositions, currentVttCues, segments]
  );
  const currentCaption = binaryFindCaption(captions, currentCue);

  const { transcripts } = currentTrack;
  const transcriptJson = transcripts?.find((t) => t.type.includes('json'));

  const jumpButtonColor = speakersColorMap.current?.get(
    getVttCueSpeaker(currentCue)
  );

  const captionsClassNames = clsx(styles.captions, {
    [styles.noSpeakers]: speakersColorMap.current.size <= 1
  });

  const scrollToCurrentBlock = useCallback(
    (smooth?: boolean) => {
      if (showJumpButton) return;

      currentCaptionRef.current?.scrollIntoView({
        block: 'center',
        behavior: smooth ? 'smooth' : 'auto'
      });
    },
    [showJumpButton]
  );

  const setScrollTarget = useCallback(
    (element: HTMLElement, cue: VTTCue) => {
      const isNextExpectedCue = !!(
        nextExpectedCue && cue.id === nextExpectedCue.current?.id
      );

      currentCaptionRef.current = element || currentCaptionRef.current;

      scrollToCurrentBlock(isNextExpectedCue);

      nextExpectedCue.current =
        getNextCue(cue.track) || nextExpectedCue.current;
    },
    [scrollToCurrentBlock]
  );

  const checkCurrentCaptionOffScreen = () => {
    if (!scrollAreaRef.current) return false;

    const currentBlockRect = currentCaptionRef.current?.getBoundingClientRect();
    const scrollingElement = scrollAreaRef.current;
    const scrollAreaRect = scrollingElement.getBoundingClientRect();
    const offScreen =
      (!!currentBlockRect && currentBlockRect?.top > scrollAreaRect.bottom) ||
      currentBlockRect?.bottom < scrollAreaRect.top;

    return offScreen;
  };

  const contextValues: ClosedCaptionsContextProps = useMemo(
    () => ({
      setScrollTarget
    }),
    [setScrollTarget]
  );

  const handleJumpBtnClick = () => {
    setShowJumpButton(false);
    scrollToCurrentBlock();
  };

  const handleCueChange = useCallback((e: Event) => {
    const newCue = getCurrentCue(e.target as TextTrack);
    setCurrentCue((previousCue) => newCue || previousCue);
  }, []);

  const handleAddTrack = useCallback((e: TrackEvent) => {
    // eslint-disable-next-line no-param-reassign
    e.track.mode = 'showing';

    // Watch track till it has cues loaded.
    const textTrackHasCuesCheckInterval = setInterval(() => {
      if (e.track.cues?.length) {
        // Stop watching for cues.
        clearInterval(textTrackHasCuesCheckInterval);
        // Update state now that we have cues to render.
        setCurrentTextTrack(e.track);
      }
    }, 100);
  }, []);

  const handleRemoveTrack = useCallback(() => {
    setCurrentTextTrack(null);
  }, []);

  const handleScroll = useCallback(() => {
    const show = showJumpButton || checkCurrentCaptionOffScreen();

    setShowJumpButton(show);
  }, [showJumpButton]);

  function setScrollAreaRef(element: HTMLDivElement) {
    element?.addEventListener('scroll', handleScroll);

    scrollAreaRef.current = element;
  }

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    const textTracks = audioElm?.textTracks;

    textTracks.addEventListener('addtrack', handleAddTrack);
    textTracks.addEventListener('removetrack', handleRemoveTrack);

    currentTextTrack?.addEventListener('cuechange', handleCueChange);

    return () => {
      textTracks.removeEventListener('addtrack', handleAddTrack);
      textTracks.removeEventListener('removetrack', handleRemoveTrack);
      currentTextTrack?.removeEventListener('cuechange', handleCueChange);
    };
  }, [
    audioElm?.textTracks,
    currentTextTrack,
    handleAddTrack,
    handleCueChange,
    handleRemoveTrack
  ]);

  useEffect(() => {
    if (!transcriptJson?.url) return;

    (async () => {
      const jsonData = await fetch(
        transcriptJson.url
      ).then<IRssPodcastTranscriptJson>((resp) => resp.ok && resp.json());

      setTranscriptData(jsonData);
    })();
  }, [transcriptJson?.url]);

  useEffect(() => {
    const scrollAreaElement = scrollAreaRef.current;

    return () => {
      scrollAreaElement?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, showJumpButton]);

  if (!transcripts) return null;

  if (transcriptJson?.url && !transcriptData) return null;

  return (
    <ClosedCaptionsContext.Provider value={contextValues}>
      <div ref={setScrollAreaRef} className={styles.root}>
        <ThemeVars theme="ClosedCaptionsFeed" cssProps={styles} />
        <div className={captionsClassNames} aria-hidden>
          <div style={{ gridColumn: '1 / -1' }}>&nbsp;</div>
          {captions?.map((props) => (
            <Caption
              {...props}
              isCurrent={currentCaption?.cues.at(0).id === props.cues.at(0).id}
              isComplete={
                currentCaption?.cues.at(0).startTime > props.cues.at(-1).endTime
              }
              key={`caption:${props.cues.at(0).id}:${props.cues.at(-1).id}`}
            />
          ))}
          <div className={styles.loader}>
            <div className={styles.loaderText}>Loading captions...</div>
            <div className={styles.loaderRings}>
              {[...new Array(5).fill(0).keys()].map((k) => (
                <span className={styles.loaderRing} key={k} />
              ))}
            </div>
          </div>
        </div>
        {showJumpButton && (
          <IconButton
            type="button"
            className={styles.jumpButton}
            style={
              {
                ...(jumpButtonColor && {
                  '--jump-button--color': jumpButtonColor,
                  '--iconButton-color': jumpButtonColor
                })
              } as CSSProperties
            }
            onClick={handleJumpBtnClick}
          >
            <VerticalAlignCenterIcon />
          </IconButton>
        )}
      </div>
    </ClosedCaptionsContext.Provider>
  );
};

export default ClosedCaptionsFeed;
