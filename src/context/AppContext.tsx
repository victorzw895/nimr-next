import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

const DummyDB = [];

interface AppContextProps {
  focusAnimeId: number | undefined,
  setFocusAnimeId: Dispatch<SetStateAction<number | undefined>>
  selectedAnime: Anime | Partial<Anime> | null
  setSelectedAnime: Dispatch<SetStateAction<Anime | Partial<Anime> | null>>
  animeList: AnimesByYear,
  setAnimeList: Dispatch<SetStateAction<AnimesByYear>>
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode,
  value: {
    animeList: AnimesByYear
  }
}

const AppProvider: FC<AppProviderProps> = ({ children, value: { animeList: animeListValue } }) => {
  const [focusAnimeId, setFocusAnimeId] = useState<number>();
  const [selectedAnime, setSelectedAnime] = useState<Anime | Partial<Anime> | null>(null);
  const [animeList, setAnimeList] = useState<AnimesByYear>(animeListValue);

  return (
    <AppContext.Provider value={
      {
        focusAnimeId,
        setFocusAnimeId,
        selectedAnime,
        setSelectedAnime,
        animeList,
        setAnimeList,
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