import { useState } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Inter } from 'next/font/google'
import AllList from '@/components/AllList';
import { getSeasonYears, getAnimeRankedList } from '@/lib/api';
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import InterestList from '@/components/InterestList';
import Preview from '@/components/Preview';
import { Anime } from '@/types/Anime'

const inter = Inter({ subsets: ['latin'] })

const Home = ({seasonYears}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { selectedAnime } = useSelectedAnimeDispatch();
  const [ collapsed, setCollapsed ] = useState<Record<string, boolean>>(seasonYears.reduce((prev, current) => ({...prev, [current.toString()]: false}), {}));

  const toggleCollapse = (year: number) => {
    const yearString = year.toString();

    setCollapsed((prev) => ({
      ...prev,
      [yearString]: !prev[yearString]
    }))
  }

  return (
    <main className={`grid ${!!selectedAnime ? 'grid-cols-4' : 'grid-cols-2'} gap-6 items-stretch h-full mx-6 ${inter.className}`}>
      <AllList collapsed={collapsed} toggleCollapse={toggleCollapse} />
      {!!selectedAnime && 
        <Preview toggleCollapse={toggleCollapse} />
      }
      <InterestList />
    </main>
  )
}

export default Home;

interface StaticProps {
  seasonYears: number[],
  rankedAnimeList: Anime[],
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const seasonYears: number[] = await getSeasonYears() || [];
  const rankedAnimeList = await getAnimeRankedList();

  return {
    props: {
      seasonYears,
      rankedAnimeList,
    },
    revalidate: 1
  }
}