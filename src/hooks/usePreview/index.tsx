import usePreviewHook from "./usePreviewHook";
import usePreviewMachine from "./usePreviewMachine";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import { useActor } from "@/context/PreviewMachine";
import { Anime } from '@/types/Anime';

const useStateMachine = process.env.NEXT_PUBLIC_USE_STATE_MACHINE

export const usePreview = useStateMachine ? usePreviewMachine : usePreviewHook

const useSelectedAnime = () => {
  const { selectedAnime: hookSelectedAnime, setSelectedAnime: hookSetSelectedAnime } = useSelectedAnimeDispatch();
  const [ state, send ] = useActor();
  const { selectedAnime: machineSelectedAnime } = state.context

  const selectedAnime = useStateMachine ? machineSelectedAnime : hookSelectedAnime;

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

    useStateMachine ? send(machineParams) : hookSetSelectedAnime(hookParams())
  };

  return {selectedAnime, setSelectedAnime}
}


export default useSelectedAnime;