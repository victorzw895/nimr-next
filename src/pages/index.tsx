import Image from 'next/image'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Inter } from 'next/font/google'
import Layout from '@/layout/Layout';
import List from '@/components/List';
import { Anime } from '@/types/Anime';

const inter = Inter({ subsets: ['latin'] })

const Home = ({animeList}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const selectedAnime = undefined;
  // const animeList = [];
  const toggleAnimeWatched = () => {}
  const toggleAnimeWatchlist = () => {}
  const handleNextAnime = () => {}

  return (
    <main className={`grid ${!!selectedAnime ? 'grid-cols-4' : 'grid-cols-2'} gap-6 items-start h-full mx-6 ${inter.className}`}>
      <List animeList={animeList} />
      {/* {!!selectedAnime && 
        <Preview
          animeWatched={toggleAnimeWatched}
          toggleWatchlist={toggleAnimeWatchlist}
          nextAnime={handleNextAnime}
        />
      }
      <SortableWatchedAnimeList /> */}
    </main>
  )
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const animeList: Anime[] = [];
  return {
    props: {
      animeList
    },
    revalidate: 1
  }
}