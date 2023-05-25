import usePreviewHook from "./usePreviewHook";
import usePreviewMachine from "./usePreviewMachine";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import { useActor } from "@/context/PreviewMachine";
import { Anime } from '@/types/Anime';

const useXState = process.env.NEXT_PUBLIC_XSTATE

export const usePreview = useXState ? usePreviewMachine : usePreviewHook

const useSelectedAnime = () => {
  const { selectedAnime: hookSelectedAnime, setSelectedAnime: hookSetSelectedAnime } = useSelectedAnimeDispatch();
  const [ state, send ] = useActor();
  const { selectedAnime: machineSelectedAnime } = state.context

  const selectedAnime = useXState ? machineSelectedAnime : hookSelectedAnime;

  const setSelectedAnime = (action: string, anime: Anime) => {
    let machineParams: any
    let hookParams: any

    switch (action) {
      case 'TOGGLE_ANIME':
        machineParams = {
          type: 'TOGGLE_ANIME',
          anime
        }
        hookParams = () => {
          if (!!hookSelectedAnime && hookSelectedAnime.id === anime.id) return null;

          return anime;
        }
    }

    useXState ? send(machineParams) : hookSetSelectedAnime(hookParams())
  };

  return {selectedAnime, setSelectedAnime}
}


export default useSelectedAnime;