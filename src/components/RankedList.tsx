import { FunctionComponent, useRef, useEffect, useState } from "react";
import useSeasons from '@/hooks/useSeasons';
import { useAppDispatch } from "@/context/AppContext";
import LazyScroll from "@/utils/LazyScroll";
import { getAnimeList, getSeasonYears, getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { ReactNode, FC, Dispatch, SetStateAction } from 'react';
import { Anime } from '@/types/Anime';
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import Card from './Card';
import { SortableList } from '@/utils/Sortable';
import { SortableItem } from '@/utils/Sortable';
import List from './List';

interface SortableProps {
  // item: {
  //   id: number,
  // },
  id: number,
  children: ReactNode
}

interface SortableItem {
  id: number,
}

export interface DraggableItemProps<T> {
  item: T,
  overlay?: boolean
}

export interface SortableListProps<T> {
  draggableContainer: (SortableItem: FC<DraggableItemProps<T>>) => ReactNode
  showWatchList: boolean,
  setShowWatchList: Dispatch<SetStateAction<boolean>>,
}

const SortableCard = (props: DraggableItemProps<Anime>) => {
  const { setSelectedAnime } = useSelectedAnimeDispatch();

  return (
    <Card
      key={`${props.item.id}-ranked`}
      id={props.item.id}
      selectAnime={() => 
        // props.overlay ? 
          // {}
          // : 
          // console.log('clicking here')
          setSelectedAnime((currentAnime) => {
            if (!!currentAnime && currentAnime.id === props.item.id) return null;

            return props.item;
          })
      }
      japName={props.item.attributes.titles.en_jp} 
      engName={props.item.attributes.titles.en}
      poster={props.item.attributes.posterImage?.tiny}
      rank={props.item.rank}
      stars={props.item.stars}
    />
  )
}


const RankedList: FunctionComponent = () => {
  const [ showAll, setShowAll ] = useState(false);
  const [ fetchFromApi, setFetchFromApi] = useState(false);
  const { seasonYears } = useAppDispatch();
  const { latestYear, getMoreAnime } = useSeasons();
  const [ hasMore, setHasMore ] = useState({ranked: true, watchlist: true});
  const [ collapsed, setCollapsed ] = useState<Record<string, boolean>>(seasonYears.reduce((prev, current) => ({...prev, [current.toString()]: false}), {}));
  const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();
  const { setSelectedAnime } = useSelectedAnimeDispatch();

  // const getList = (year: number) => {
  //   if (!animeList) return [];
  //   if (showAll) {
  //     return animeList[year.toString()] || []
  //   }
  //   else {
  //     return (animeList[year.toString()] || []).filter(anime => !anime.isWatched)
  //   }
  // }

  const loadMore = async (listName: 'ranked' | 'watchlist' = 'ranked') => {
    const list = listName === 'ranked' ? animeRankedList : animeWatchList;
    const setList = listName === 'ranked' ? setAnimeRankedList : setAnimeWatchList;
    const getMoreApi = listName === 'ranked' ? getAnimeRankedList : getAnimeWatchList;
    const nextAnimeIndex = list.length;

    const moreAnimes = await getMoreApi({fromIndex: nextAnimeIndex, toIndex: nextAnimeIndex + 10});

    if (moreAnimes.length) {
      setList((prevAnimeList) => ([...prevAnimeList, ...moreAnimes]))
    }
    else {
      setHasMore((prev) => ({
        ...prev,
        [listName]: false
      }));
    }
  }

  const toggleCollapse = (year: number) => {
    const yearString = year.toString();

    setCollapsed((prev) => ({
      ...prev,
      [yearString]: !prev[yearString]
    }))
  }

  return (
    <section className='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          {/* <button key='ranked' className={`tab tab-lifted font-bold ${!props.showWatchList ? 'tab-active' : ''}`} onClick={() => props.setShowWatchList(false)}>Ranked</button>
          <button key='watchlist' className={`tab tab-lifted font-bold ${props.showWatchList ? 'tab-active' : ''}`} onClick={() => props.setShowWatchList(true)}>WatchList</button> */}
          <button className={`tab tab-lifted font-bold ${showAll ? 'tab-active' : ''}`} onClick={() => setShowAll(true)}>All</button>
          <button className={`tab tab-lifted font-bold ${!showAll ? 'tab-active' : ''}`} onClick={() => setShowAll(false)}>Unwatched</button>
        </div>
        <div id='ranked-list' className='list space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
          <List 
            sortable={true}
            showRank={true}
            lazyScroll={true}
            scrollableTarget='ranked-list'
            list={animeRankedList}
            setList={setAnimeRankedList}
            loadMore={loadMore}
            hasMore={hasMore.ranked}
          />
          {/* <SortableList list={animeRankedList} setList={setAnimeRankedList}>
            <LazyScroll
              scrollableTarget='ranked-list'
              list={animeRankedList}
              loadMore={loadMore}
              hasMore={hasMore.ranked}
            >
              {
                animeRankedList.map(anime => 
                  <SortableItem key={anime.id} id={anime.id}>
                    <Card
                      key={anime.id}
                      id={anime.id}
                      selectAnime={() => {
                        setSelectedAnime((currentAnime) => {
                          if (!!currentAnime && currentAnime.id === anime.id) return null;
          
                          return anime;
                        })
                      }}
                      japName={anime.attributes.titles.en_jp} 
                      engName={anime.attributes.titles.en}
                      poster={anime.attributes.posterImage?.tiny}
                      rank={anime.rank}
                      stars={anime.stars}
                    />
                  </SortableItem>
                )
              }
            </LazyScroll>
          </SortableList> */}
        </div>
      </div>
    </section>
  )
}

export default RankedList;