import Image from 'next/image'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Inter } from 'next/font/google'
import Layout from '@/layout/Layout';
import List from '@/components/List';
import { AnimesByYear } from '@/types/Anime';
import { getAnimeList, getSeasonYears, getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { useAppDispatch } from "@/context/AppContext";
import { useEffect } from 'react';
import SortableWatchedAnimeList from '@/components/WatchedAnimeList';

const inter = Inter({ subsets: ['latin'] })

const Home = ({seasonYears}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { setAnimeList, setAnimeRankedList, setAnimeWatchList } = useAppDispatch();
  const selectedAnime = undefined;
  const toggleAnimeWatched = () => {}
  const toggleAnimeWatchlist = () => {}
  const handleNextAnime = () => {}

  useEffect(() => {
    (async () => {
      const animeList: AnimesByYear = await getAnimeList(seasonYears);
      setAnimeList(animeList)

      const rankedAnimeList = await getAnimeRankedList()
      setAnimeRankedList(rankedAnimeList)
      
      const watchAnimeList = await getAnimeWatchList()
      setAnimeWatchList(watchAnimeList)
    })()
  }, [])

  return (
    <main className={`grid ${!!selectedAnime ? 'grid-cols-4' : 'grid-cols-2'} gap-6 items-stretch h-full mx-6 ${inter.className}`}>
      <List />
      {/* {!!selectedAnime && 
        <Preview
          animeWatched={toggleAnimeWatched}
          toggleWatchlist={toggleAnimeWatchlist}
          nextAnime={handleNextAnime}
        />
      }
      */}
      <SortableWatchedAnimeList /> 
    </main>
  )
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const seasonYears: number[] = await getSeasonYears() || [];

  return {
    props: {
      seasonYears,
    },
    revalidate: 1
  }
}