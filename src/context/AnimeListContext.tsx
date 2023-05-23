import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

const DummyDB = [];

interface AnimeListContextProps {
  animeList: AnimesByYear
  setAnimeList: Dispatch<SetStateAction<AnimesByYear>>
}

export const AnimeListContext = createContext<AnimeListContextProps | undefined>(undefined);

interface AnimeListProviderProps {
  children: ReactNode,
}

const AnimeListProvider: FC<AnimeListProviderProps> = ({ children }) => {
  const [animeList, setAnimeList] = useState<AnimesByYear>({});

  return (
    <AnimeListContext.Provider value={
      {
        animeList,
        setAnimeList,
      }
    }>
      {children}
    </AnimeListContext.Provider>
  );
}

const useAnimeListDispatch = () => {
  const context = useContext(AnimeListContext)
  if (context === undefined) {
    throw new Error('useAnimeListDispatch must be used within a AnimeListProvider');
  }
  return context;
}

export { AnimeListProvider, useAnimeListDispatch };