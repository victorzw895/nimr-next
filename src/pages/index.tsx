import Image from 'next/image'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Inter } from 'next/font/google'
import Layout from '@/layout/Layout';
import AllList from '@/components/AllList';
import { AnimesByYear } from '@/types/Anime';
import { getAnimeList, getSeasonYears, getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { useAppDispatch } from "@/context/AppContext";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import { useAnimeListDispatch } from "@/context/AnimeListContext";
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import { useEffect } from 'react';
import SortableWatchedAnimeList from '@/components/WatchedAnimeList';
import RankedList from '@/components/RankedList';
import Preview from '@/components/Preview';

const inter = Inter({ subsets: ['latin'] })

const Home = ({seasonYears}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { selectedAnime } = useSelectedAnimeDispatch();
  const toggleAnimeWatched = () => {}
  const toggleAnimeWatchlist = () => {}
  const handleNextAnime = () => {}

  useEffect(() => {
    (async () => {
      // const animeList = await getAnimeList(seasonYears);
      // setAnimeList(animeList)

      // const rankedAnimeList = await getAnimeRankedList()
      // setAnimeRankedList(rankedAnimeList)
      
      // const watchAnimeList = await getAnimeWatchList()
      // setAnimeWatchList(watchAnimeList)
    })()
  }, [])

  return (
    <main className={`grid ${!!selectedAnime ? 'grid-cols-4' : 'grid-cols-2'} gap-6 items-stretch h-full mx-6 ${inter.className}`}>
      <AllList />
      {!!selectedAnime && 
        <Preview
          animeWatched={toggleAnimeWatched}
          toggleWatchlist={toggleAnimeWatchlist}
          nextAnime={handleNextAnime}
        />
      }
      {/* <SortableWatchedAnimeList />  */}
      <RankedList />
    </main>
  )
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const seasonYears: number[] = await getSeasonYears() || [];
  // const animeList = await getAnimeList(seasonYears);
  const rankedAnimeList = await getAnimeRankedList();
  // const animeWatchList = await getAnimeWatchList();

  return {
    props: {
      seasonYears,
      animeList: {},
      rankedAnimeList,
      animeWatchList: [],
    },
    revalidate: 1
  }
}