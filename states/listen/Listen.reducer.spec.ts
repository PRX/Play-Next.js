import { ListenActionTypes } from './Listen.actions';
import { listenStateReducer, listenInitialState } from './Listen.reducer';

describe('states/listen', () => {
  describe('listenStateReducer', () => {
    test('should return current state for unknown actions', () => {
      const result = listenStateReducer(listenInitialState, {
        /* @ts-ignore */
        type: 'UNKNOWN_ACTION'
      });

      expect(result).toBe(listenInitialState);
    });

    describe('`view` and `episodeGuid` actions', () => {
      test('should change `view` to "episode" and set `episodeGuid`', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_VIEW_EPISODE,
            payload: 'GUID:2'
          }
        );

        expect(result.view).toBe('episode');
        expect(result.episodeGuid).toBe('GUID:2');
      });

      test('should change `view` to "podcast" and set `episodeGuid` to null', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_VIEW_PODCAST
          }
        );

        expect(result.view).toBe('podcast');
        expect(result.episodeGuid).toBeNull();
      });
    });

    describe('`podcastShareShown` actions', () => {
      test('should set `podcastShareShown` to true', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_SHOW_SHARE_DIALOG
          }
        );

        expect(result.podcastShareShown).toBe(true);
      });

      test('should set `podcastShareShown` to false', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState,
            podcastShareShown: true
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_HIDE_SHARE_DIALOG
          }
        );

        expect(result.podcastShareShown).toBe(false);
      });

      test('should toggle `podcastShareShown`', () => {
        const result1 = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_TOGGLE_SHARE_DIALOG_SHOWN
          }
        );
        const result2 = listenStateReducer(
          {
            ...result1
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_TOGGLE_SHARE_DIALOG_SHOWN
          }
        );

        expect(result1.podcastShareShown).toBe(true);
        expect(result2.podcastShareShown).toBe(false);
      });
    });

    describe('`podcastFollowShown` actions', () => {
      test('should set `podcastFollowShown` to true', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_SHOW_FOLLOW_DIALOG
          }
        );

        expect(result.podcastFollowShown).toBe(true);
      });

      test('should set `podcastFollowShown` to false', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState,
            podcastFollowShown: true
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_HIDE_FOLLOW_DIALOG
          }
        );

        expect(result.podcastFollowShown).toBe(false);
      });

      test('should toggle `podcastFollowShown`', () => {
        const result1 = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_TOGGLE_FOLLOW_DIALOG_SHOWN
          }
        );
        const result2 = listenStateReducer(
          {
            ...result1
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_TOGGLE_FOLLOW_DIALOG_SHOWN
          }
        );

        expect(result1.podcastFollowShown).toBe(true);
        expect(result2.podcastFollowShown).toBe(false);
      });
    });

    describe('`podcastSupportShown` actions', () => {
      test('should set `podcastSupportShown` to true', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_SHOW_SUPPORT_DIALOG
          }
        );

        expect(result.podcastSupportShown).toBe(true);
      });

      test('should set `podcastSupportShown` to false', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState,
            podcastSupportShown: true
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_HIDE_SUPPORT_DIALOG
          }
        );

        expect(result.podcastSupportShown).toBe(false);
      });

      test('should toggle `podcastSupportShown`', () => {
        const result1 = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_TOGGLE_SUPPORT_DIALOG_SHOWN
          }
        );
        const result2 = listenStateReducer(
          {
            ...result1
          },
          {
            type: ListenActionTypes.LISTEN_PODCAST_TOGGLE_SUPPORT_DIALOG_SHOWN
          }
        );

        expect(result1.podcastSupportShown).toBe(true);
        expect(result2.podcastSupportShown).toBe(false);
      });
    });

    describe('`episodeShareShown` actions', () => {
      test('should set `episodeShareShown` to true', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_EPISODE_SHOW_SHARE_DIALOG
          }
        );

        expect(result.episodeShareShown).toBe(true);
      });

      test('should set `episodeShareShown` to false', () => {
        const result = listenStateReducer(
          {
            ...listenInitialState,
            episodeShareShown: true
          },
          {
            type: ListenActionTypes.LISTEN_EPISODE_HIDE_SHARE_DIALOG
          }
        );

        expect(result.episodeShareShown).toBe(false);
      });

      test('should toggle `episodeShareShown`', () => {
        const result1 = listenStateReducer(
          {
            ...listenInitialState
          },
          {
            type: ListenActionTypes.LISTEN_EPISODE_TOGGLE_SHARE_DIALOG_SHOWN
          }
        );
        const result2 = listenStateReducer(
          {
            ...result1
          },
          {
            type: ListenActionTypes.LISTEN_EPISODE_TOGGLE_SHARE_DIALOG_SHOWN
          }
        );

        expect(result1.episodeShareShown).toBe(true);
        expect(result2.episodeShareShown).toBe(false);
      });
    });
  });
});
