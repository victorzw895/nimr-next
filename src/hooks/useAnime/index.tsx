import { useAppDispatch } from "@/context/AppContext";
import useAnimeStore from "@/zustand-store/AnimeStore";

// const useXState = process.env.NEXT_PUBLIC_XSTATE;
const useZustand = process.env.NEXT_PUBLIC_ZUSTAND;

// console.info(`Preview State Management Option: ${useXState ? 'XState Machine' : 'React Context'}`)

const useAnimeContext = () => {
  const reactContextState = useAppDispatch();
  return {
    focusAnimeId: reactContextState.focusAnimeId,
    setFocusAnimeId: reactContextState.setFocusAnimeId,
  }
}

const useAnimeZustand = () => {
  const zustandState = useAnimeStore(({focusAnimeId, setFocusAnimeId}) => 
    (
      {
        focusAnimeId,
        setFocusAnimeId
      }
    )
  )
  return {
    focusAnimeId: zustandState.focusAnimeId,
    setFocusAnimeId: zustandState.setFocusAnimeId,
  }
}

const useAnime = useZustand ? useAnimeZustand : useAnimeContext;


export default useAnime;
