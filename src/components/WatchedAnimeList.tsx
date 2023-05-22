import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Anime } from '@/types/Anime';
import Card from './Card';
import withSortableList, { SortableListProps, DraggableItemProps } from '../HOC/withSortableList';
import {
  fetchAnimes,
  upsertAnime,
  getSeasonYears,
  getAnimeRankedList,
  getAnimeWatchList,
} from '@/lib/api';
import { useAppDispatch } from "@/context/AppContext";
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";

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

const WatchedList = (props: SortableListProps<Anime>) => {

  return (
    <section className='col-span-1'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          <button key='ranked' className={`tab tab-lifted font-bold ${!props.showWatchList ? 'tab-active' : ''}`} onClick={() => props.setShowWatchList(false)}>Ranked</button>
          <button key='watchlist' className={`tab tab-lifted font-bold ${props.showWatchList ? 'tab-active' : ''}`} onClick={() => props.setShowWatchList(true)}>WatchList</button>
        </div>
        <div id='favorite-list' className='list space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
          {props.draggableContainer(SortableCard)}
        </div>
      </div>
    </section>
  )
}


const SortableWatchedAnimeList = () => {
  const [ showWatchList, setShowWatchList ] = useState(false);
  const [ hasMore, setHasMore ] = useState({ranked: true, watchlist: true});
  
  const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  const loadMore = async (listName: 'ranked' | 'watchlist') => {
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
  
  const AnimeRankedList = withSortableList<Anime>(WatchedList, animeRankedList, setAnimeRankedList, showWatchList, setShowWatchList, upsertAnime, () => loadMore('ranked'), hasMore.ranked)
  const AnimeWatchList = withSortableList<Anime>(WatchedList, animeWatchList, setAnimeWatchList, showWatchList, setShowWatchList, upsertAnime, () => loadMore('watchlist'), hasMore.watchlist)

  return (
    <>
      {
        showWatchList ?
          <AnimeWatchList />
            :
          <AnimeRankedList />
      }
    </>
  )
}


export default SortableWatchedAnimeList;
