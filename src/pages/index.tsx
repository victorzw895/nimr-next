import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Inter } from 'next/font/google'
import AllList from '@/components/AllList';
import { getSeasonYears, getAnimeRankedList } from '@/lib/api';
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import { useEffect } from 'react';
import ConsumedList from '@/components/ConsumedList';
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
      <ConsumedList />
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