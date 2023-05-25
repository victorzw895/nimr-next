import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction } from "react";
import { Anime } from '@/types/Anime';

interface PreviewContextProps {
  selectedAnime: Anime | null
  setSelectedAnime: Dispatch<SetStateAction<Anime | null>>
}

const PreviewContext = createContext<PreviewContextProps | undefined>(undefined);

interface PreviewProviderProps {
  children: ReactNode,
}

const PreviewProvider: FC<PreviewProviderProps> = ({ children }) => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  return (
    <PreviewContext.Provider value={
      {
        selectedAnime,
        setSelectedAnime,
      }
    }>
      {children}
    </PreviewContext.Provider>
  );
}

const usePreviewDispatch = () => {
  const context = useContext(PreviewContext)
  if (context === undefined) {
    throw new Error('usePreviewDispatch must be used within a PreviewProvider');
  }
  return context;
}

export { PreviewProvider, usePreviewDispatch };