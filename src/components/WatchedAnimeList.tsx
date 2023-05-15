import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Anime } from '@/types/Anime';
import Card from './Card';
import withSortableList, { SortableListProps, DraggableItemProps } from '../HOC/withSortableList';
import {
  fetchAnimes,
  upsertAnime,
  getSeasonYears,
} from '@/lib/api';
import { useAppDispatch } from "@/context/AppContext";

const SortableCard = (props: DraggableItemProps<Anime>) => {

  return (
    <Card
      id={props.item.id}
      selectAnime={() => 
        // props.overlay ? 
          {}
          // : 
          // setSelectedAnime((currentAnime) => {
          //   if (!!currentAnime && currentAnime.id === props.item.id) return null;

          //   return props.item;
          // })
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
  useEffect(() => {
    upsertAnime(props.updatedValues)
  }, [props.updatedValues])

  return (
    <section className='col-span-1'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          <button className={`tab tab-lifted font-bold ${!props.showWatchList ? 'tab-active' : ''}`} onClick={() => props.setShowWatchList(false)}>Ranked</button>
          <button className={`tab tab-lifted font-bold ${props.showWatchList ? 'tab-active' : ''}`} onClick={() => props.setShowWatchList(true)}>WatchList</button>
        </div>
        <div className='space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
          {props.draggableContainer(SortableCard)}
        </div>
      </div>
    </section>
  )
}


const SortableWatchedAnimeList = () => {
  const [showWatchList, setShowWatchList] = useState(false);
  
  const { animeRankedList, setAnimeRankedList, animeWatchList, setAnimeWatchList } = useAppDispatch();
  const AnimeRankedList = withSortableList<Anime>(WatchedList, animeRankedList, setAnimeRankedList, showWatchList, setShowWatchList)
  const AnimeWatchList = withSortableList<Anime>(WatchedList, animeWatchList, setAnimeWatchList, showWatchList, setShowWatchList)

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
