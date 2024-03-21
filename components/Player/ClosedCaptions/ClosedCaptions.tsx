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
import PlayButton from '../PlayButton';
import PlayerProgress from '../PlayerProgress';
import ReplayButton from '../ReplayButton';
import ForwardButton from '../ForwardButton';
import styles from './ClosedCaptions.module.scss';

export interface IClosedCaptionsProps {
  speakerColors?: string[];
}

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
  const speakers = useRef(new Set<string>());

  if (speaker) {
    speakers.current.add(speaker);
  }

  const speakerNumber = [...speakers.current].indexOf(speaker);
  const speakerColor =
    speakerNumber > -1
      ? speakerColors?.[speakerNumber] ||
        `hsl(${35 + 81 * speakerNumber}, 100%, 50%)`
      : null;

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

  const handleCueEnd = () => {
    setCueEnded(true);
  };

  const handleCueChange = useMemo(
    () => () => {
      const textTrack = [...(audioElm?.textTracks || [])].find(
        (track) => track.mode === 'showing'
      );

      [...(textTrack.activeCues || [])].forEach((c: VTTCue) => {
        // console.log(c.text, c);

        currentCue?.removeEventListener('exit', handleCueEnd);
        c.addEventListener('exit', handleCueEnd);

        setCueEnded(false);
        setCurrentCue(c);
      });
    },
    [audioElm?.textTracks, currentCue]
  );

  const handleUpdate = useCallback(() => {
    setCurrentTime(audioElm?.currentTime);
  }, [audioElm?.currentTime]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    audioElm?.addEventListener('timeupdate', handleUpdate);

    [...(audioElm?.textTracks || [])].forEach((track) => {
      if (track.kind === 'captions') {
        track.addEventListener('cuechange', handleCueChange);
      }
    });

    return () => {
      audioElm?.removeEventListener('timeupdate', handleUpdate);

      [...(audioElm?.textTracks || [])].forEach((track) => {
        if (track.kind === 'captions') {
          track.removeEventListener('cuechange', handleCueChange);
        }
      });
    };
  }, [audioElm, handleCueChange, handleUpdate]);

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
      style={{ '--cc-speaker--color': speakerColor } as CSSProperties}
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
