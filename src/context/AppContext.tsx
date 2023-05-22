import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

const DummyDB = [];

interface AppContextProps {
  focusAnimeId: number | undefined,
  setFocusAnimeId: Dispatch<SetStateAction<number | undefined>>
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
  const [focusAnimeId, setFocusAnimeId] = useState<number>(); // App handleNext, Watched
  const [seasonYears, setSeasonYears] = useState<number[]>(seasonYearsValue);

  return (
    <AppContext.Provider value={
      {
        focusAnimeId,
        setFocusAnimeId,
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