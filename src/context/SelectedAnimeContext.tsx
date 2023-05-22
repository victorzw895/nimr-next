import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { Anime, AnimesByYear } from '@/types/Anime';

const DummyDB = [];

interface SelectedAnimeContextProps {
  selectedAnime: Anime | null
  setSelectedAnime: Dispatch<SetStateAction<Anime | null>>
}

export const SelectedAnimeContext = createContext<SelectedAnimeContextProps | undefined>(undefined);

interface SelectedAnimeProviderProps {
  children: ReactNode,
}

const SelectedAnimeProvider: FC<SelectedAnimeProviderProps> = ({ children }) => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  return (
    <SelectedAnimeContext.Provider value={
      {
        selectedAnime,
        setSelectedAnime,
      }
    }>
      {children}
    </SelectedAnimeContext.Provider>
  );
}

const useSelectedAnimeDispatch = () => {
  const context = useContext(SelectedAnimeContext)
  if (context === undefined) {
    throw new Error('useSelectedAnimeDispatch must be used within a SelectedAnimeProvider');
  }
  return context;
}

export { SelectedAnimeProvider, useSelectedAnimeDispatch };