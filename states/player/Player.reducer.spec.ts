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

    describe('`currentTrack` actions', () => {
      test('should set `currentTrack`', () => {
        const result = playerStateReducer(
          {
            ...playerInitialState
          },
          {
            type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK,
            payload: {
              url: '//foo.com/bar.mp3'
            }
          }
        );

        expect(result.currentTrack).toHaveProperty('url');
        expect(result.currentTrack.url).toBe('//foo.com/bar.mp3');
      });
    });
  });
});
