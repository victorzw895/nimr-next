import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '@/context/AppContext';
import { SelectedAnimeProvider } from '@/context/SelectedAnimeContext';
import { AnimeListProvider } from '@/context/AnimeListContext';
import { RankedListProvider } from '@/context/RankedListContext';
import { WatchListProvider } from '@/context/WatchListContext';
import Layout from '@/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <AppProvider value={{ seasonYears: pageProps.seasonYears }}>
        <SelectedAnimeProvider>
          <AnimeListProvider value={{
            animeList: pageProps.animeList,
          }}>
            <RankedListProvider value={{
              rankedAnimeList: pageProps.rankedAnimeList
            }}>
              <WatchListProvider value={{
                animeWatchList: pageProps.animeWatchList,
              }}>
                <Component {...pageProps} />
              </WatchListProvider>
            </RankedListProvider>
          </AnimeListProvider>
        </SelectedAnimeProvider>
      </AppProvider>
    </Layout>
  )
}
