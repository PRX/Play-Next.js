import { PlayerActionTypes } from './Player.actions';
import {
  playerProgressInitialState,
  playerProgressStateReducer
} from './PlayerProgress.reducer';

describe('states/player', () => {
  describe('playerProgressStateReducer', () => {
    test('should return current state for unknown actions', () => {
      const result = playerProgressStateReducer(playerProgressInitialState, {
        /* @ts-ignore */
        type: 'UNKNOWN_ACTION'
      });

      expect(result).toBe(playerProgressInitialState);
    });

    describe('`progress` actions', () => {
      test('should set `played`, `playedSeconds`, `loaded`, and `loadedSeconds`', () => {
        const result = playerProgressStateReducer(
          {
            ...playerProgressInitialState,
            duration: 200
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
            payload: {
              played: 0.42,
              playedSeconds: 84,
              loaded: 1,
              loadedSeconds: 200
            }
          }
        );

        expect(result.played).toBe(0.42);
        expect(result.playedSeconds).toBe(84);
        expect(result.loaded).toBe(1);
        expect(result.loadedSeconds).toBe(200);
      });

      test('should set `played`', () => {
        const result = playerProgressStateReducer(
          {
            ...playerProgressInitialState,
            duration: 200,
            playedSeconds: 84
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
            payload: {
              playedSeconds: 0
            }
          }
        );

        expect(result.played).toBe(0);
      });
    });

    describe('`scrubPosition` actions', () => {
      test('should set `scrubPosition`', () => {
        const result = playerProgressStateReducer(
          {
            ...playerProgressInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_SCRUB_POSITION,
            payload: 0.25
          }
        );

        expect(result.scrubPosition).toBe(0.25);
      });

      test('should set `played` to `scrubPosition` value', () => {
        const result1 = playerProgressStateReducer(
          {
            ...playerProgressInitialState,
            played: 0.75
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_SCRUB_POSITION,
            payload: 0.25
          }
        );
        const result2 = playerProgressStateReducer(
          {
            ...result1
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION,
            payload: 0.25
          }
        );

        expect(result1.played).toBe(0.75);
        expect(result1.scrubPosition).toBe(0.25);
        expect(result2.played).toBe(0.25);
        expect(result2.scrubPosition).toBeNull();
      });
    });

    describe('`duration` actions', () => {
      test('should set `duration`', () => {
        const result = playerProgressStateReducer(
          {
            ...playerProgressInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_DURATION,
            payload: 500
          }
        );

        expect(result.duration).toBe(500);
      });
    });
  });
});
