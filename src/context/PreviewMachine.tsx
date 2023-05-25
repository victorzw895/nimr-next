import { createMachine, assign } from "xstate";
import { createActorContext } from '@xstate/react';
import { Anime } from '@/types/Anime';

export const previewMachine = createMachine(
  {
    id: "preview",
    initial: "previewOff",
    schema: {
      context: {} as { selectedAnime: Anime | null },
      events: {} as { type: 'NEXT_ANIME'; anime: Anime } | { type: 'TOGGLE_ANIME'; anime: Anime | null } | { type: 'TOGGLE_RANKED'; anime: Anime } | { type: 'TOGGLE_WATCHLIST'; anime: Anime },
    },
    context: {
      selectedAnime: null
    },
    states: {
      previewOff: {
        on: {
          TOGGLE_ANIME: {
            target: "previewOn",
            actions: "togglePreview",
          },
        },
      },
      previewOn: {
        on: {
          NEXT_ANIME: {
            actions: "selectAnime",
          },
          TOGGLE_RANKED: {
            actions: "selectAnime",
          },
          TOGGLE_WATCHLIST: {
            actions: "selectAnime",
          },
          TOGGLE_ANIME: 
          [
            {
              cond: 'sameAnime',
              actions: "togglePreview",
              target: "previewOff",
            },
            {
              cond: 'nextAnime',
              actions: "selectAnime",
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      sameAnime: (context, event) => context.selectedAnime === event.anime,
      nextAnime: (context, event) => context.selectedAnime !== event.anime,
    },
    actions: {
      togglePreview: assign({
        selectedAnime: (context, event) => context.selectedAnime ? null : event.anime
      }),
      selectAnime: assign({
        selectedAnime: (_, event) => event.anime
      })
    },
  }
);

const { useActor, Provider } = createActorContext(previewMachine);

export {
  useActor,
  Provider as PreviewProvider
}