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
  Fragment,
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
  index: number;
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
  currentCue?: VTTCue;
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

const binaryFindCueIndex = (cueList: TextTrackCueList, cue: VTTCue) => {
  if (!cueList?.length || !cue) return null;

  const cues = [...cueList] as VTTCue[];

  let low = 0;
  let high = cueList.length - 1;
  let mid: number;

  while (high >= low) {
    mid = low + Math.floor((high - low) / 2);
    const current = cues.at(mid);
    const { id, startTime } = current;

    // If the cue is in the current caption, we are done.
    if (cue.id === id) {
      return mid;
    }

    // If cue start time is before the caption's first cue start time,
    // caption can only be in the left subarray.
    if (cue.startTime < startTime) {
      high = mid - 1;
    } else {
      // Other wise the caption will be 1n the right subarray.
      low = mid + 1;
    }
  }

  // Cue not found in any captions.
  return null;
};

const binaryFindCueByTime = (
  cueList: TextTrackCueList,
  currentTime: number
) => {
  if (!cueList?.length || (!currentTime && currentTime !== 0)) return null;

  const cues = [...cueList] as VTTCue[];

  let low = 0;
  let high = cueList.length - 1;
  let mid: number;

  while (high >= low) {
    mid = low + Math.floor((high - low) / 2);
    const current = cues.at(mid);
    const { startTime, endTime } = current;

    // If the cue is in the current caption, we are done.
    if (currentTime >= startTime && currentTime <= endTime) {
      return current;
    }

    // If cue start time is before the caption's first cue start time,
    // caption can only be in the left subarray.
    if (currentTime < startTime) {
      high = mid - 1;
    } else {
      // Other wise the caption will be 1n the right subarray.
      low = mid + 1;
    }
  }

  // Cue not found in any captions.
  return null;
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

const getLastPastCue = (textTrack: TextTrack, currentTime: number) => {
  const cues = [...(textTrack?.cues || [])] as VTTCue[];
  const lastPastCue = cues.findLast((cue) => currentTime > cue.endTime);

  return lastPastCue || null;
};

const getCurrentCue = (textTrack: TextTrack, currentTime: number) => {
  const currentCue = binaryFindCueByTime(textTrack?.cues, currentTime);

  if (currentCue) return currentCue;

  return getLastPastCue(textTrack, currentTime);
};

const getNextCue = (cue: VTTCue) => {
  if (!cue) return null;

  const { track } = cue;
  const cues = [...track.cues] as VTTCue[];
  const cueIndex = binaryFindCueIndex(track.cues, cue);

  return cueIndex > -1 ? cues.at(cueIndex + 1) : null;
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

const CaptionCue = ({
  cue,
  segments,
  inCurrentCaption,
  index
}: CaptionCueProps) => {
  const { seekTo, play, state, audioElm } = useContext(PlayerContext);
  const { setScrollTarget, currentCue } = useContext(ClosedCaptionsContext);
  const { id, text, startTime, endTime } = cue;
  const [isCurrent, setIsCurrent] = useState(id === currentCue?.id);
  const [isComplete, setIsComplete] = useState(audioElm.currentTime > endTime);
  const cueSegments = useMemo(
    () =>
      segments
        ?.filter(
          ({ startTime: st, endTime: et }) => st >= startTime && et <= endTime
        )
        .reduce((a, currentSegment, i) => {
          const aClone = [...a];
          const previousSegment = aClone.pop();

          if (
            !previousSegment ||
            currentSegment.startTime > previousSegment.endTime
          ) {
            return [...a, currentSegment];
          }

          const updatedSegment = {
            ...previousSegment,
            body: `${previousSegment.body}${
              /^[.,?!]/i.test(currentSegment.body) && i !== 0 ? '' : ' '
            }${currentSegment.body}`
          };

          return [...aClone, updatedSegment];
        }, [] as IRssPodcastTranscriptJsonSegment[]),
    [segments, startTime, endTime]
  );
  const segmentsText = useMemo(
    () =>
      cueSegments?.reduce(
        (a, { body }, i) =>
          `${a}${!body.startsWith(' ') && i > 0 ? ` ${body}` : body}`,
        ''
      ),
    [cueSegments]
  );
  const hasSegments = !!cueSegments?.length;
  const hasText = hasSegments || !!text.trim().length;
  const rootProps = {
    className: clsx(styles.captionCue),
    'data-cue-id': id,
    ...(isCurrent && {
      'data-current': ''
    }),
    ...(isComplete && {
      'data-complete': ''
    }),
    ...(isCurrent && {
      ref: (elm: HTMLElement) => setScrollTarget(elm, cue)
    })
  };

  const insertSpace = (t: string) =>
    index > 0 && !/^[.?! ]/.test(t) ? ' ' : null;

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
    setIsComplete(currentCue?.startTime > endTime);
  }, [currentCue?.startTime, endTime]);

  useEffect(() => {
    setIsCurrent(currentCue?.id === id);
    setIsComplete(audioElm.currentTime > endTime);
  }, [audioElm.currentTime, currentCue?.id, endTime, id]);

  useEffect(() => {
    function handleCueExit() {
      setIsCurrent(false);
      setIsComplete(audioElm.currentTime > endTime);
    }

    if (inCurrentCaption) {
      cue.addEventListener('exit', handleCueExit);
    } else {
      cue.removeEventListener('exit', handleCueExit);
    }

    return () => {
      cue.removeEventListener('exit', handleCueExit);
    };
  }, [audioElm.currentTime, cue, endTime, inCurrentCaption]);

  if (!hasText) return null;

  if (!hasSegments) {
    const sanitizedText = text.replace(/^<[^>]+>/i, '').trimStart();
    const outputText = `${
      /^[.,?!]/i.test(sanitizedText) ? '' : ' '
    }${sanitizedText}`;
    return (
      <>
        {insertSpace(outputText)}
        <span
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...rootProps}
        >
          {outputText}
        </span>
      </>
    );
  }

  if (!inCurrentCaption) {
    return (
      <>
        {insertSpace(segmentsText)}
        <span
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...rootProps}
        >
          {segmentsText}
        </span>
      </>
    );
  }

  return (
    <>
      {insertSpace(cueSegments.at(0).body)}
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rootProps}
      >
        {cueSegments.map((s) => (
          <Fragment key={`segment:${s.startTime}`}>
            {insertSpace(s.body)}
            <Segment data={s} inCurrentCue={isCurrent} />
          </Fragment>
        ))}
      </span>
    </>
  );
};

const Caption = ({
  cues,
  speaker,
  color,
  position,
  segments,
  isCurrent
}: CaptionProps) => {
  const { audioElm } = useContext(PlayerContext);
  const { currentCue } = useContext(ClosedCaptionsContext);
  const { startTime } = cues.at(0);
  const { endTime } = cues.at(-1);
  const [isComplete, setIsComplete] = useState(audioElm.currentTime > endTime);
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
    ...(color && {
      style: {
        ...(color && { '--cc-speaker--color': color })
      } as CSSProperties
    })
  };
  const bodyProps = {
    ...(mousePosition && {
      style: {
        ...(mousePosition && {
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`
        })
      } as CSSProperties
    })
  };
  const bodyRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setIsComplete(currentCue?.startTime > endTime);
  }, [currentCue?.startTime, endTime]);

  useEffect(() => {
    const bodyElm = bodyRef.current;

    function handleMouseMove(e: MouseEvent) {
      setMousePosition({ x: e.offsetX, y: e.offsetY });
    }

    function handleAudioTimeUpdate() {
      setIsComplete(audioElm.currentTime > endTime);
    }

    bodyElm?.addEventListener('mousemove', handleMouseMove);

    if (isCurrent) {
      audioElm.addEventListener('timeupdate', handleAudioTimeUpdate);
    } else {
      audioElm.removeEventListener('timeupdate', handleAudioTimeUpdate);
    }

    return () => {
      bodyElm?.removeEventListener('mousemove', handleMouseMove);
      audioElm.removeEventListener('timeupdate', handleAudioTimeUpdate);
    };
  }, [audioElm, endTime, isCurrent]);

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
      <div className={styles.captionBody} {...bodyProps} ref={bodyRef}>
        <div className={styles.bodyHighlight} />
        {cues.map((cue, index) => (
          <CaptionCue
            cue={cue}
            segments={segments}
            inCurrentCaption={isCurrent}
            isComplete={audioElm.currentTime > cue.endTime}
            key={`caption_cue:${cue.id}`}
            index={index}
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
  const { tracks, currentTrackIndex, currentTime } = state;
  const currentTrack = tracks[currentTrackIndex] || ({} as IAudioData);

  const [currentTextTrack, setCurrentTextTrack] = useState(
    audioElm?.textTracks?.[0]
  );
  const [currentCue, setCurrentCue] = useState(
    getCurrentCue(currentTextTrack, audioElm.currentTime)
  );
  const currentVttCues = useMemo(
    () => [...(currentTextTrack?.cues || [])] as VTTCue[],
    [currentTextTrack?.cues]
  );

  const scrollAreaRef = useRef<HTMLDivElement>();
  const currentCaptionRef = useRef<HTMLElement>();
  const setScrollAreaRef = (elm: HTMLDivElement) => {
    if (!elm) return;

    // FIX: Firefox remembers scroll position of overflow elements.
    // SEE: https://bugzilla.mozilla.org/show_bug.cgi?id=706792
    // When first setting the scroll area, reset scrollTop of element.
    if (!scrollAreaRef.current) {
      // eslint-disable-next-line no-param-reassign
      elm.scrollTop = 0;
    }

    scrollAreaRef.current = elm;
  };

  const [transcriptData, setTranscriptData] =
    useState<IRssPodcastTranscriptJson>();
  const { segments } = transcriptData || {};
  const [showJumpButton, setShowJumpButton] = useState(false);
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

  const checkCurrentCaptionOffScreen = () => {
    if (!scrollAreaRef.current) return null;

    const currentBlockRect = currentCaptionRef.current?.getBoundingClientRect();
    const scrollingElement = scrollAreaRef.current;
    const scrollAreaRect = scrollingElement.getBoundingClientRect();
    const offScreen =
      (!!currentBlockRect && currentBlockRect?.top > scrollAreaRect.bottom) ||
      currentBlockRect?.bottom < scrollAreaRect.top;

    return offScreen;
  };

  const scrollToCurrentBlock = useCallback(
    (resetJumpButton?: boolean) => {
      if (showJumpButton && !resetJumpButton) return;

      const isCaptionOffScreen = checkCurrentCaptionOffScreen();
      const doSmoothScroll = !isCaptionOffScreen && isCaptionOffScreen !== null;

      currentCaptionRef.current?.scrollIntoView({
        block: 'center',
        behavior: doSmoothScroll ? 'smooth' : 'auto'
      });

      if (resetJumpButton) {
        setShowJumpButton(false);
      }
    },
    [showJumpButton]
  );

  const setScrollTarget = useCallback(
    (element: HTMLElement) => {
      const doScroll = !!element && element !== currentCaptionRef.current;

      if (doScroll) {
        currentCaptionRef.current = element;
        scrollToCurrentBlock();
      }
    },
    [scrollToCurrentBlock]
  );

  const contextValues: ClosedCaptionsContextProps = useMemo(
    () => ({
      setScrollTarget,
      currentCue
    }),
    [currentCue, setScrollTarget]
  );

  const handleJumpBtnClick = () => {
    scrollToCurrentBlock(true);
  };

  const updateCurrentCue = useCallback(
    (playheadTime?: number) => {
      if (!playheadTime && playheadTime !== 0) return;

      const newCue = getCurrentCue(currentTextTrack, playheadTime);
      let previousCue: VTTCue;

      if (!newCue) return;

      setCurrentCue((prev) => {
        previousCue = prev;
        return newCue || prev;
      });

      if (previousCue?.id === newCue.id) return;

      const nextExpectedCue = getNextCue(previousCue);
      const isNextExpectedCue = !!(
        nextExpectedCue && newCue.id === nextExpectedCue?.id
      );

      if (!isNextExpectedCue && showJumpButton) {
        setShowJumpButton(false);
      }
    },
    [currentTextTrack, showJumpButton]
  );

  const handleAudioTimeUpdate = useCallback(() => {
    updateCurrentCue(audioElm.currentTime);
  }, [audioElm.currentTime, updateCurrentCue]);

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

  useEffect(() => {
    updateCurrentCue(currentTime);
  }, [currentTime, updateCurrentCue]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    const textTracks = audioElm?.textTracks;

    textTracks.addEventListener('addtrack', handleAddTrack);
    textTracks.addEventListener('removetrack', handleRemoveTrack);

    audioElm.addEventListener('timeupdate', handleAudioTimeUpdate);

    return () => {
      textTracks.removeEventListener('addtrack', handleAddTrack);
      textTracks.removeEventListener('removetrack', handleRemoveTrack);
      audioElm.removeEventListener('timeupdate', handleAudioTimeUpdate);
    };
  }, [
    audioElm,
    currentTextTrack,
    handleAddTrack,
    handleAudioTimeUpdate,
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

    function handleScroll() {
      const show = showJumpButton || checkCurrentCaptionOffScreen();

      if (show !== showJumpButton) {
        setShowJumpButton(show);
      }
    }

    scrollAreaElement?.addEventListener('scroll', handleScroll);

    if (!audioElm.currentTime) {
      scrollAreaRef.current?.scrollTo({ top: 0 });
    }

    return () => {
      scrollAreaElement?.removeEventListener('scroll', handleScroll);
    };
  }, [audioElm.currentTime, showJumpButton]);

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
