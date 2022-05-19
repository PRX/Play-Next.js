import { PlayerActionTypes } from './Player.actions';
import {
  playerVolumeInitialState,
  playerVolumeStateReducer
} from './PlayerVolume.reducer';

describe('states/player', () => {
  describe('playerVolumeStateReducer', () => {
    test('should return current state for unknown actions', () => {
      const result = playerVolumeStateReducer(playerVolumeInitialState, {
        /* @ts-ignore */
        type: 'UNKNOWN_ACTION'
      });

      expect(result).toBe(playerVolumeInitialState);
    });

    describe('`muted` actions', () => {
      test('should set `muted` to true', () => {
        const result = playerVolumeStateReducer(
          {
            ...playerVolumeInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_MUTE
          }
        );

        expect(result.muted).toBe(true);
      });

      test('should set `muted` to false', () => {
        const result = playerVolumeStateReducer(
          {
            ...playerVolumeInitialState,
            muted: true
          },
          {
            type: PlayerActionTypes.PLAYER_UNMUTE
          }
        );

        expect(result.muted).toBe(false);
      });

      test('should toggle `muted`', () => {
        const result1 = playerVolumeStateReducer(
          {
            ...playerVolumeInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
          }
        );
        const result2 = playerVolumeStateReducer(
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
        const result = playerVolumeStateReducer(
          {
            ...playerVolumeInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
            payload: 0.25
          }
        );

        expect(result.volume).toBe(0.25);
      });
    });
  });
});
