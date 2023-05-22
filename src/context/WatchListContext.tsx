import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

const DummyDB = [];

interface WatchListContextProps {
  animeWatchList: Anime[]
  setAnimeWatchList: Dispatch<SetStateAction<Anime[]>>
}

export const WatchListContext = createContext<WatchListContextProps | undefined>(undefined);

interface WatchListProviderProps {
  children: ReactNode,
  value: {
    animeWatchList: Anime[]
  }
}

const WatchListProvider: FC<WatchListProviderProps> = ({ children, value: { 
  animeWatchList: animeWatchListValue
}}) => {
  const [animeWatchList, setAnimeWatchList] = useState<Anime[]>(animeWatchListValue);

  return (
    <WatchListContext.Provider value={
      {
        animeWatchList,
        setAnimeWatchList,
      }
    }>
      {children}
    </WatchListContext.Provider>
  );
}

const useWatchListDispatch = () => {
  const context = useContext(WatchListContext)
  if (context === undefined) {
    throw new Error('useWatchListDispatch must be used within a WatchListProvider');
  }
  return context;
}

export { WatchListProvider, useWatchListDispatch };