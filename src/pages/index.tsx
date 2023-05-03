import Image from 'next/image'
import { Inter } from 'next/font/google'
import Layout from '@/layout/Layout';
import List from '@/components/List';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const selectedAnime = undefined;
  // const animeList = [];
  const toggleAnimeWatched = () => {}
  const toggleAnimeWatchlist = () => {}
  const handleNextAnime = () => {}

  return (
    <Layout>
      <main className={`grid ${!!selectedAnime ? 'grid-cols-4' : 'grid-cols-2'} gap-6 items-start h-full mx-6 ${inter.className}`}>
        {/* <List animeList={animeList} />
        {!!selectedAnime && 
          <Preview
            animeWatched={toggleAnimeWatched}
            toggleWatchlist={toggleAnimeWatchlist}
            nextAnime={handleNextAnime}
          />
        }
        <SortableWatchedAnimeList /> */}
      </main>
    </Layout>
  )
}
