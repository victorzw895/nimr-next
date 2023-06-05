import { createContext, useContext, useState, FC, ReactNode, Dispatch, SetStateAction } from "react";
import { Anime } from '@/types/Anime';

interface PreviewContextProps {
  selectedAnime: Anime | null
  setSelectedAnime: Dispatch<SetStateAction<Anime | null>>
}

const PreviewContext = createContext<PreviewContextProps | undefined>(undefined);

interface PreviewProviderProps {
  children: ReactNode,
  storybookState?: [Anime | null, Dispatch<SetStateAction<Anime | null>>]
}

const PreviewProvider: FC<PreviewProviderProps> = ({ children, storybookState }) => {
  const previewState = useState<Anime | null>(null);
  const [selectedAnime, setSelectedAnime] = storybookState ? storybookState : previewState;

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