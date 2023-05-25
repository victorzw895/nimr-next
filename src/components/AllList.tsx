import { FC, useEffect, useState } from "react";
import useSeasons from '@/hooks/useSeasons';
import { useAppDispatch } from "@/context/AppContext";
import { useAnimeListDispatch } from "@/context/AnimeListContext";
import { getAnimesByYear } from '@/lib/api';
import { getAnimeList } from '@/lib/api';
import List from './List';

interface AllListProps {
  collapsed: Record<string, boolean>,
  toggleCollapse: (year: number) => void,
}

const AllList: FC<AllListProps> = ({ collapsed, toggleCollapse }) => {
  const [ showAll, setShowAll ] = useState(false);
  const [ fetchFromApi, setFetchFromApi] = useState(false);
  const { seasonYears, setSeasonYears } = useAppDispatch();
  const { latestYear, getMoreAnime } = useSeasons();
  const [ hasMore, setHasMore ] = useState<Record<string, boolean>>(seasonYears.reduce((prev, current) => ({...prev, [current.toString()]: true}), {}));
  const { animeList, setAnimeList } = useAnimeListDispatch();

  useEffect(() => {
    (async () => {
      const animeList = await getAnimeList(seasonYears);
      setAnimeList(animeList);
      if (!seasonYears.length) {
        setSeasonYears([2000])
        setFetchFromApi(true)
        setHasMore((prev) => ({...prev, '2000': true}))
      }
    })()
  }, [])

  const getList = (year: number) => {
    if (!animeList) return [];
    if (showAll) {
      return animeList[year.toString()] || []
    }
    else {
      return (animeList[year.toString()] || []).filter(anime => !anime.isWatched)
    }
  }

  const loadMore = async (year: number) => {
    const yearString = year.toString()
    const nextAnimeIndex = animeList[yearString].length;

    const moreAnimes = await getAnimesByYear({year, fromIndex: nextAnimeIndex, toIndex: nextAnimeIndex + 20, limit: 20});

    if (moreAnimes.length) {
      setAnimeList((prevAnimeList) => ({
        ...prevAnimeList,
        [yearString]: [...animeList[yearString], ...moreAnimes]
      }))
    }
    else if (latestYear() === year) {
        await getMoreAnime(setHasMore);
        setFetchFromApi(true);
    }
    else {
      setHasMore((prev) => ({
        ...prev,
        [yearString]: false
      }));
    }
  }

  return (
    <section className='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          <button className={`tab tab-lifted font-bold ${showAll ? 'tab-active' : ''}`} onClick={() => setShowAll(true)}>All</button>
          <button className={`tab tab-lifted font-bold ${!showAll ? 'tab-active' : ''}`} onClick={() => setShowAll(false)}>Unwatched</button>
        </div>
        <div className='space-y-1 max-h-[37rem] overflow-y-auto scrollbar-hide bg-light rounded-b-lg min-h-[32rem]'>
          {seasonYears.map(year => {
            return (
              <div key={year} className='collapse collapse-arrow bg-dark items-center'>
                <input type="checkbox" id={`${year}-tab`} checked={collapsed[year.toString()]} onChange={() => toggleCollapse(year)} /> 
                <div data-testid='grouped-by-year' className="collapse-title text-xl font-medium">
                  {year}
                </div>
                <div id={`main-list-${year}`} data-testid='anime-list' className="list space-y-1 overflow-y-scroll scrollbar-hide collapse-content p-0 bg-light">
                <List 
                  list={getList(year)}
                  scrollableTarget={`main-list-${year}`}
                  loadMore={() => fetchFromApi ? getMoreAnime(setHasMore) : loadMore(year)}
                  hasMore={hasMore[year.toString()]}
                />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AllList;