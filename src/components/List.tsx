import { FunctionComponent, useRef, useEffect, useState } from "react";
import Card from './Card';
import { AnimesByYear } from '@/types/Anime';
// import { setSelectedAnime } from './Preview';
// import {
//   getSeasonYears,
//   AnimesByYear,
// } from '../api';
import useSeasons from '@/hooks/useSeasons';
import { useAppDispatch } from "@/context/AppContext";

const List: FunctionComponent = () => {
  const [showAll, setShowAll] = useState(false);
  const { seasonYears, setSeasonYears, loadMore } = useSeasons();
  const { animeList } = useAppDispatch();

  const getList = (year: number) => {
    if (!animeList) return [];
    if (showAll) {
      return animeList[year.toString()] || []
    }
    else {
      return (animeList[year.toString()] || []).filter(anime => !anime.isWatched)
    }
  }

  return (
    <section className='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          <button className={`tab tab-lifted font-bold ${showAll ? 'tab-active' : ''}`} onClick={() => setShowAll(true)}>All</button>
          <button className={`tab tab-lifted font-bold ${!showAll ? 'tab-active' : ''}`} onClick={() => setShowAll(false)}>Unwatched</button>
        </div>
        <div className='space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[32rem]'>
          {seasonYears.map(year => {
            return (
              <div key={year} className='collapse collapse-arrow bg-dark items-center'>
                <input type="checkbox" /> 
                <div data-testid='grouped-by-year' className="collapse-title text-xl font-medium">
                  {year}
                </div>
                <div data-testid='anime-list' className="space-y-1 collapse-content p-0 bg-light">
                  {
                    getList(year).map(anime => 
                      <Card
                        key={anime.id}
                        id={anime.id}
                        selectAnime={() => {
                          // setSelectedAnime((currentAnime) => {
                          //   if (!!currentAnime && currentAnime.id === anime.id) return null;

                          //   return anime;
                          // })
                        }}
                        japName={anime.attributes.titles.en_jp} 
                        engName={anime.attributes.titles.en}
                        poster={anime.attributes.posterImage?.tiny}
                        rank={null}
                        stars={null}
                      />
                    )  
                  }
                </div>
              </div>
            )
          })}
        </div>
        <button className='block mx-auto my-3' onClick={loadMore}>Load More</button>
      </div>
    </section>
  )
}

export default List;