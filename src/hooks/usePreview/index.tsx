import usePreviewHook from "./usePreviewContext";
import usePreviewMachine from "./usePreviewMachine";
import { usePreviewDispatch } from "@/context/PreviewContext";
import { useActorRef, useSelector } from "@/xstate-machine/PreviewMachine";
import { Anime } from '@/types/Anime';

const useXState = process.env.NEXT_PUBLIC_XSTATE;

console.info(`Preview State Management Option: ${useXState ? 'XState Machine' : 'React Context'}`)

const usePreview = useXState ? usePreviewMachine : usePreviewHook

const useSelectedAnimeHook = () => {
  const { selectedAnime, setSelectedAnime: hookSetSelectedAnime } = usePreviewDispatch();

  const setSelectedAnime = (action: string, anime: Anime) => {
    let params: any

    switch (action) {
      case 'TOGGLE_ANIME':
        params = () => {
          if (!!selectedAnime && selectedAnime.id === anime.id) return null;

          return anime;
        }
    }

    hookSetSelectedAnime(params())
  };

  return {selectedAnime, setSelectedAnime}
}

const useSelectedAnimeMachine = () => {
  const actorRef = useActorRef();
  const selectedAnime = useSelector((state) => state.context.selectedAnime);

  const setSelectedAnime = (action: string, anime: Anime) => {
    let params: any

    switch (action) {
      case 'TOGGLE_ANIME':
        params = {
          type: 'TOGGLE_ANIME',
          anime
        }
    }

    actorRef.send(params)
  };

  return {selectedAnime, setSelectedAnime}
}

export const useSelectedAnime = useXState ? useSelectedAnimeMachine : useSelectedAnimeHook;

export default usePreview;
