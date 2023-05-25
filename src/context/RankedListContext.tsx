import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

interface DummyDBRankedType {
  data: Anime[],
  count: number
}

export const DummyDBRanked: DummyDBRankedType = { data: [], count: 0 };

interface RankedListContextProps {
  animeRankedList: Anime[]
  setAnimeRankedList: Dispatch<SetStateAction<Anime[]>>
}

export const RankedListContext = createContext<RankedListContextProps | undefined>(undefined);

interface RankedListProviderProps {
  children: ReactNode,
  value: {
    rankedAnimeList: Anime[]
  }
}

const RankedListProvider: FC<RankedListProviderProps> = ({ children, value: { rankedAnimeList: rankedAnimeListValue }}) => {
  const [animeRankedList, setAnimeRankedList] = useState<Anime[]>(rankedAnimeListValue);

  return (
    <RankedListContext.Provider value={
      {
        animeRankedList,
        setAnimeRankedList,
      }
    }>
      {children}
    </RankedListContext.Provider>
  );
}

const useRankedListDispatch = () => {
  const context = useContext(RankedListContext)
  if (context === undefined) {
    throw new Error('useRankedListDispatch must be used within a RankedListProvider');
  }
  return context;
}

export { RankedListProvider, useRankedListDispatch };