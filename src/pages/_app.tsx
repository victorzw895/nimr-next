import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '@/context/AppContext';
import { SelectedAnimeProvider } from '@/context/SelectedAnimeContext';
import { AnimeListProvider } from '@/context/AnimeListContext';
import { RankedListProvider } from '@/context/RankedListContext';
import { WatchListProvider } from '@/context/WatchListContext';
import { PreviewProvider } from '@/context/PreviewMachine';
import Layout from '@/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <AppProvider value={{ seasonYears: pageProps.seasonYears }}>
        <SelectedAnimeProvider>
          <AnimeListProvider>
            <RankedListProvider value={{
              rankedAnimeList: pageProps.rankedAnimeList
            }}>
              <WatchListProvider>
                <PreviewProvider>
                  <Component {...pageProps} />
                </PreviewProvider>
              </WatchListProvider>
            </RankedListProvider>
          </AnimeListProvider>
        </SelectedAnimeProvider>
      </AppProvider>
    </Layout>
  )
}
