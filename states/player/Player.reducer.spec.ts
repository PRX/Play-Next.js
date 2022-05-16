import { IProgressState } from '@interfaces/states/player';
import { PlayerActionTypes } from './Player.actions';
import { playerInitialState, playerStateReducer } from './Player.reducer';

describe('states/player', () => {
  describe('playerStateReducer', () => {
    test('should return current state for unknown actions', () => {
      const result = playerStateReducer(playerInitialState, {
        /* @ts-ignore */
        type: 'UNKNOWN_ACTION'
      });

      expect(result).toBe(playerInitialState);
    });

    describe('`playing` actions', () => {
      test('should set `playing` to true', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_PLAY
          }
        );

        expect(result.playing).toBe(true);
      });

      test('should set `playing` to false', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState,
            playing: true
          },
          {
            type: PlayerActionTypes.PLAYER_PAUSE
          }
        );

        expect(result.playing).toBe(false);
      });

      test('should toggle `playing`', () => {
        const result1 = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING
          }
        );
        const result2 = playerStateReducer(
          {
            ...result1
          },
          {
            type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING
          }
        );

        expect(result1.playing).toBe(true);
        expect(result2.playing).toBe(false);
      });
    });

    describe('`muted` actions', () => {
      test('should set `muted` to true', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_MUTE
          }
        );

        expect(result.muted).toBe(true);
      });

      test('should set `muted` to false', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState,
            muted: true
          },
          {
            type: PlayerActionTypes.PLAYER_UNMUTE
          }
        );

        expect(result.muted).toBe(false);
      });

      test('should toggle `muted`', () => {
        const result1 = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
          }
        );
        const result2 = playerStateReducer(
          {
            ...result1
          },
          {
            type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
          }
        );

        expect(result1.muted).toBe(true);
        expect(result2.muted).toBe(false);
      });
    });

    describe('`volume` actions', () => {
      test('should set `volume`', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
            payload: 0.25
          }
        );

        expect(result.volume).toBe(0.25);
      });
    });

    describe('`progress` actions', () => {
      test('should set `played`, `playedSeconds`, `loaded`, and `loadedSeconds', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
            payload: {
              played: 0.42,
              playedSeconds: 84,
              loaded: 1,
              loadedSeconds: 200
            } as IProgressState
          }
        );

        expect(result.played).toBe(0.42);
        expect(result.playedSeconds).toBe(84);
        expect(result.loaded).toBe(1);
        expect(result.loadedSeconds).toBe(200);
      });
    });

    describe('`seeking` actions', () => {
      test('should set `seeking`', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_SEEKING,
            payload: 0.25
          }
        );

        expect(result.seeking).toBe(0.25);
      });

      test('should set `played` to `seeking` value', () => {
        const result1 = playerStateReducer(
          {
            ...playerInitialState,
            played: 0.75
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_SEEKING,
            payload: 0.25
          }
        );
        const result2 = playerStateReducer(
          {
            ...result1
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SEEKING,
            payload: 0.25
          }
        );

        expect(result1.played).toBe(0.75);
        expect(result1.seeking).toBe(0.25);
        expect(result2.played).toBe(0.25);
        expect(result2.seeking).toBeNull();
      });
    });

    describe('`duration` actions', () => {
      test('should set `duration` and stop playing', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState,
            playing: true
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_DURATION,
            payload: 500
          }
        );

        expect(result.duration).toBe(500);
        expect(result.playing).toBe(false);
      });
    });
  });
});
