import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const selectedAnime = undefined;
  const animeList = [];
  const toggleAnimeWatched = () => {}
  const toggleAnimeWatchlist = () => {}
  const handleNextAnime = () => {}
  
  return (
    <>
    <p className="text-2xl text-lightest text-center py-10">App</p>
      <main className={`grid ${!!selectedAnime ? 'grid-cols-4' : 'grid-cols-2'} gap-6 items-start h-full mx-6 ${inter.className}`}>
        <List animeList={animeList} />
        <Show when={!!selectedAnime}>
          <Preview
            animeWatched={toggleAnimeWatched}
            toggleWatchlist={toggleAnimeWatchlist}
            nextAnime={handleNextAnime}
          />
        </Show>
        <SortableWatchedAnimeList />
      </main>
    </>
  )
}
