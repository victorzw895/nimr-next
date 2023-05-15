import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

const DummyDB = [];

interface AppContextProps {
  focusAnimeId: number | undefined,
  setFocusAnimeId: Dispatch<SetStateAction<number | undefined>>
  selectedAnime: Anime | Partial<Anime> | null
  setSelectedAnime: Dispatch<SetStateAction<Anime | Partial<Anime> | null>>
  animeList: AnimesByYear | null
  setAnimeList: Dispatch<SetStateAction<AnimesByYear | null>>
  animeRankedList: Anime[]
  setAnimeRankedList: Dispatch<SetStateAction<Anime[]>>
  animeWatchList: Anime[]
  setAnimeWatchList: Dispatch<SetStateAction<Anime[]>>
  seasonYears: number[],
  setSeasonYears: Dispatch<SetStateAction<number[]>>,
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode,
  value: {
    seasonYears: number[]
  }
}

const AppProvider: FC<AppProviderProps> = ({ children, value: { seasonYears: seasonYearsValue } }) => {
  const [focusAnimeId, setFocusAnimeId] = useState<number>();
  const [selectedAnime, setSelectedAnime] = useState<Anime | Partial<Anime> | null>(null);
  const [animeRankedList, setAnimeRankedList] = useState<Anime[]>([]);
  const [animeWatchList, setAnimeWatchList] = useState<Anime[]>([]);
  const [animeList, setAnimeList] = useState<AnimesByYear | null>(null);
  const [seasonYears, setSeasonYears] = useState<number[]>(seasonYearsValue);

  return (
    <AppContext.Provider value={
      {
        focusAnimeId,
        setFocusAnimeId,
        selectedAnime,
        setSelectedAnime,
        animeList,
        setAnimeList,
        animeRankedList,
        setAnimeRankedList,
        animeWatchList,
        setAnimeWatchList,
        seasonYears,
        setSeasonYears,
      }
    }>
      {children}
    </AppContext.Provider>
  );
}

const useAppDispatch = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppProvider');
  }
  return context;
}

export { AppProvider, useAppDispatch };