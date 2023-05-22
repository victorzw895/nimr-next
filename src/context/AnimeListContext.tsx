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
  value: {
    animeList: AnimesByYear,
  }
}

const AnimeListProvider: FC<AnimeListProviderProps> = ({ children, value: { animeList: animeListValue }}) => {
  const [animeList, setAnimeList] = useState<AnimesByYear>(animeListValue);

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