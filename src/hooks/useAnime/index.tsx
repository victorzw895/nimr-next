import { useAppDispatch } from "@/context/AppContext";
import useAnimeStore from "@/zustand-store/AnimeStore";

const useXState = process.env.NEXT_PUBLIC_XSTATE;
const useZustand = process.env.NEXT_PUBLIC_ZUSTAND;

// console.info(`Preview State Management Option: ${useXState ? 'XState Machine' : 'React Context'}`)

// const usePreview = useXState ? usePreviewMachine : usePreviewHook

const useAnime = () => {
  const reactContextState = useAppDispatch();

  const zustandState = useAnimeStore(({focusAnimeId, setFocusAnimeId}) => 
    (
      {
        focusAnimeId,
        setFocusAnimeId
      }
    )
  )

  const focusAnimeId = useZustand ?
    zustandState.focusAnimeId :
    reactContextState.focusAnimeId;
  const setFocusAnimeId = useZustand ?
    zustandState.setFocusAnimeId :
    reactContextState.setFocusAnimeId;

  return {
    focusAnimeId,
    setFocusAnimeId,
  }
}

export default useAnime;