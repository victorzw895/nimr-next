import { createMachine } from "xstate";
import { createActorContext } from '@xstate/react';

// states
// previewOff
// previewOn

// events
// SELECT_ANIME
// NEXT_ANIME
//

export const previewMachine = createMachine(
  {
    id: "preview",
    initial: "previewOff",
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
            actions: "nextAnime",
          },
          TOGGLE_RANKED: {
            actions: "nextAnime",
          },
          TOGGLE_ANIME: {
            target: "previewOff",
            actions: "togglePreview",
          },
        },
      },
    },
  },
  {
    actions: {
      nextAnime: (context, event) => {
        console.log(context, event);
      },
      togglePreview: (context, event) => {
        console.log(context, event);
        if (context.selectedAnime) {
          context.selectedAnime = null
        }
        else {
          context.selectedAnime = event.anime
        }
      }
    },
  }
);

const { useActor, Provider } = createActorContext(previewMachine);

export {
  useActor,
  Provider as PreviewProvider
}