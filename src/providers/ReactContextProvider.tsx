import { FC, ReactNode } from 'react';
import { AppProvider } from '@/context/AppContext';
import { AnimeListProvider } from '@/context/AnimeListContext';
import { RankedListProvider } from '@/context/RankedListContext';
import { WatchListProvider } from '@/context/WatchListContext';
import { PreviewProvider} from "@/context/PreviewContext";

const ReactContextProvider: FC<any> = ({children, pageProps}) => {
  return (
    <AppProvider value={{ seasonYears: pageProps.seasonYears }}>
      <AnimeListProvider>
        <RankedListProvider value={{
          rankedAnimeList: pageProps.rankedAnimeList
        }}>
          <WatchListProvider>
            <PreviewProvider>
              {children}
            </PreviewProvider>
          </WatchListProvider>
        </RankedListProvider>
      </AnimeListProvider>
    </AppProvider>
  )
}

export default ReactContextProvider;