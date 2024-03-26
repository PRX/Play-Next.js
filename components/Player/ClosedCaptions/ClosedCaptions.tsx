/**
 * @file ClosedCaptions.tsx
 * Provides closed captions display with minimal controls and progress bar.
 */

import type React from 'react';
import type { CSSProperties } from 'react';
import type { IAudioData } from '@interfaces/data';
import type {
  IRssPodcastTranscriptJson,
  IRssPodcastTranscriptJsonSegment
} from '@interfaces/data/IRssPodcast';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import generateSpeakerColor from '@lib/generate/string/generateSpeakerColor';
import getVttCueSpeaker from '@lib/parse/dom/getVttCueSpeaker';
import PlayButton from '../PlayButton';
import PlayerProgress from '../PlayerProgress';
import ReplayButton from '../ReplayButton';
import ForwardButton from '../ForwardButton';
import styles from './ClosedCaptions.module.scss';

export interface IClosedCaptionsProps {
  speakerColors?: string[];
}

const getCurrentCue = (textTrack: TextTrack) =>
  [...(textTrack?.activeCues || [])].at(0) as VTTCue;

const ClosedCaptions: React.FC<IClosedCaptionsProps> = ({ speakerColors }) => {
  const { audioElm, state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const [currentTime, setCurrentTime] = useState(audioElm?.currentTime || 0);
  const [currentCue, setCurrentCue] = useState<VTTCue>();
  const [cueEnded, setCueEnded] = useState(false);
  const [transcriptData, setTranscriptData] =
    useState<IRssPodcastTranscriptJson>();
  const currentTrack = tracks[currentTrackIndex] || ({} as IAudioData);
  const { transcripts } = currentTrack;
  const transcriptJson = transcripts?.find((t) => t.type.includes('json'));
  const captionsClassNames = clsx(styles.captions, {
    [styles.ended]: cueEnded
  });
  const [, speaker, caption] =
    currentCue?.text.replace('\n', ' ').match(/^(?:<v\s+([^>]+)>)?(.+)/) || [];
  const speakersColorMap = useRef(new Map<string, string>());

  // console.log(currentCue, cueIndex, recentCues);

  const cues = [...(currentCue?.track?.cues || [])] as VTTCue[];

  if (cues.length) {
    cues.forEach((cue) => {
      const cueSpeaker = getVttCueSpeaker(cue);
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
    });
  }

  const cueSegments = useMemo(
    () =>
      transcriptData?.segments
        .filter(
          ({ startTime, endTime, speaker: _speaker }) =>
            !!currentCue &&
            _speaker === speaker &&
            startTime >= currentCue.startTime &&
            endTime <= currentCue.endTime
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
    [transcriptData?.segments, currentCue, speaker]
  );

  const handleCueEnd = useCallback(() => {
    setCueEnded(true);
  }, []);

  const updateCurrentCue = useCallback(
    (textTrack: TextTrack) => {
      const cue = getCurrentCue(textTrack);

      // Fallback to previous cue to prevent captions not being rendered during
      // pauses in dialog (no active cues.)
      setCurrentCue((previousCue) => {
        previousCue?.removeEventListener('exit', handleCueEnd);
        cue?.addEventListener('exit', handleCueEnd);
        return cue || previousCue;
      });
    },
    [handleCueEnd]
  );

  const handleCueChange = useMemo(
    () => (e: Event) => {
      setCueEnded(false);
      updateCurrentCue(e.target as TextTrack);
    },
    [updateCurrentCue]
  );

  const handleAddTrack = useMemo(
    () => (e: TrackEvent) => {
      updateCurrentCue(e.track);
      // eslint-disable-next-line no-param-reassign
      e.track.mode = 'showing';
      e.track.addEventListener('cuechange', handleCueChange);
    },
    [handleCueChange, updateCurrentCue]
  );

  const handleRemoveTrack = useMemo(
    () => () => {
      // Clear current cue when tracks are about to change.
      setCurrentCue(null);
      setCueEnded(false);
    },
    []
  );

  const handleUpdate = useCallback(() => {
    setCurrentTime(audioElm?.currentTime);
    setCueEnded(currentCue?.endTime < audioElm?.currentTime);
  }, [audioElm?.currentTime, currentCue?.endTime]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    const textTracks = audioElm?.textTracks;

    textTracks.addEventListener('addtrack', handleAddTrack);
    textTracks.addEventListener('removetrack', handleRemoveTrack);

    [...(textTracks || [])].forEach((track) => {
      if (track.kind === 'captions') {
        track.addEventListener('cuechange', handleCueChange);
        updateCurrentCue(track);
      }
    });

    audioElm?.addEventListener('timeupdate', handleUpdate);

    return () => {
      audioElm?.removeEventListener('timeupdate', handleUpdate);

      [...(audioElm?.textTracks || [])].forEach((track) => {
        if (track.kind === 'captions') {
          track.removeEventListener('cuechange', handleCueChange);
        }
      });
    };
  }, [
    audioElm,
    handleAddTrack,
    handleCueChange,
    handleRemoveTrack,
    handleUpdate,
    updateCurrentCue
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

  if (!transcripts) return null;

  return (
    <div
      className={styles.root}
      style={
        {
          '--cc-speaker--color': speakersColorMap.current.get(speaker)
        } as CSSProperties
      }
    >
      <div className={captionsClassNames} aria-hidden>
        {currentCue && (
          <>
            {speaker && <cite className={styles.speaker}>{speaker}</cite>}
            <p className={styles.caption} key={currentCue.id}>
              {(!cueSegments || cueSegments.length <= 1) && caption}
              {cueSegments?.length > 1 &&
                cueSegments?.map(({ startTime, body }, index) => (
                  <span
                    className={clsx(styles.segment, {
                      [styles.spoken]: startTime <= currentTime
                    })}
                    key={`${body}:${startTime}`}
                  >
                    {body.length > 1 && !!index && ' '}
                    {body}
                  </span>
                ))}
            </p>
          </>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.controls}>
          <ReplayButton />
          <PlayButton />
          <ForwardButton />
        </div>
        <PlayerProgress />
      </div>
    </div>
  );
};

export default ClosedCaptions;
