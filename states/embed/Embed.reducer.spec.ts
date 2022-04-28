import { IAudioData } from '@interfaces/data';
import { EmbedActionTypes } from './Embed.actions';
import { embedStateReducer, embedInitialState } from './Embed.reducer';

describe('states/player', () => {
  describe('embedStateReducer', () => {
    test('should return current state for unknown actions', () => {
      const result = embedStateReducer(embedInitialState, {
        /* @ts-ignore */
        type: 'UNKNOWN_ACTION'
      });

      expect(result).toBe(embedInitialState);
    });

    describe('`currentTrack` actions', () => {
      test('should set `volume`', () => {
        const audio: IAudioData = {
          guid: 'BAR',
          link: '//foo.com/bar',
          url: '//foo.com/bar.mp3',
          title: 'BAR'
        };
        const result = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_CURRENT_TRACK_UPDATE,
            payload: audio
          }
        );

        expect(result.currentTrack).toBe(audio);
      });
    });

    describe('`track` actions', () => {
      test('should append audio to `tracks`', () => {
        const tracks: IAudioData[] = [
          {
            guid: 'BAR',
            link: '//foo.com/bar',
            url: '//foo.com/bar.mp3',
            title: 'Bar'
          },
          {
            guid: 'BAZ',
            link: '//foo.com/baz',
            url: '//foo.com/baz.mp3',
            title: 'Baz'
          }
        ];
        const audioThree: IAudioData = {
          guid: 'THREE',
          link: '//foo.com/three',
          url: '//foo.com/three.mp3',
          title: 'Three'
        };
        const result1 = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_APPEND_TRACKS,
            payload: tracks
          }
        );
        const result2 = embedStateReducer(
          {
            ...result1
          },
          {
            type: EmbedActionTypes.EMBED_APPEND_TRACKS,
            payload: [audioThree]
          }
        );

        expect(result1.tracks.length).toBe(2);
        expect(result2.tracks.length).toBe(3);
        expect(result2.tracks[2]).toBe(audioThree);
      });
    });

    describe('`shareShown` actions', () => {
      test('should set `shareShown` to true', () => {
        const result = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_SHOW_SHARE_DIALOG
          }
        );

        expect(result.shareShown).toBe(true);
      });

      test('should set `shareShown` to false', () => {
        const result = embedStateReducer(
          {
            ...embedInitialState,
            shareShown: true
          },
          {
            type: EmbedActionTypes.EMBED_HIDE_SHARE_DIALOG
          }
        );

        expect(result.shareShown).toBe(false);
      });

      test('should toggle `shareShown`', () => {
        const result1 = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_TOGGLE_SHARE_DIALOG_SHOWN
          }
        );
        const result2 = embedStateReducer(
          {
            ...result1
          },
          {
            type: EmbedActionTypes.EMBED_TOGGLE_SHARE_DIALOG_SHOWN
          }
        );

        expect(result1.shareShown).toBe(true);
        expect(result2.shareShown).toBe(false);
      });
    });

    describe('`followShown` actions', () => {
      test('should set `followShown` to true', () => {
        const result = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_SHOW_FOLLOW_DIALOG
          }
        );

        expect(result.followShown).toBe(true);
      });

      test('should set `followShown` to false', () => {
        const result = embedStateReducer(
          {
            ...embedInitialState,
            followShown: true
          },
          {
            type: EmbedActionTypes.EMBED_HIDE_FOLLOW_DIALOG
          }
        );

        expect(result.followShown).toBe(false);
      });

      test('should toggle `followShown`', () => {
        const result1 = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_TOGGLE_FOLLOW_DIALOG_SHOWN
          }
        );
        const result2 = embedStateReducer(
          {
            ...result1
          },
          {
            type: EmbedActionTypes.EMBED_TOGGLE_FOLLOW_DIALOG_SHOWN
          }
        );

        expect(result1.followShown).toBe(true);
        expect(result2.followShown).toBe(false);
      });
    });

    describe('`supportShown` actions', () => {
      test('should set `supportShown` to true', () => {
        const result = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_SHOW_SUPPORT_DIALOG
          }
        );

        expect(result.supportShown).toBe(true);
      });

      test('should set `supportShown` to false', () => {
        const result = embedStateReducer(
          {
            ...embedInitialState,
            supportShown: true
          },
          {
            type: EmbedActionTypes.EMBED_HIDE_SUPPORT_DIALOG
          }
        );

        expect(result.supportShown).toBe(false);
      });

      test('should toggle `supportShown`', () => {
        const result1 = embedStateReducer(
          {
            ...embedInitialState
          },
          {
            type: EmbedActionTypes.EMBED_TOGGLE_SUPPORT_DIALOG_SHOWN
          }
        );
        const result2 = embedStateReducer(
          {
            ...result1
          },
          {
            type: EmbedActionTypes.EMBED_TOGGLE_SUPPORT_DIALOG_SHOWN
          }
        );

        expect(result1.supportShown).toBe(true);
        expect(result2.supportShown).toBe(false);
      });
    });
  });
});
