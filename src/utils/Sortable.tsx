import { FunctionComponent, useRef, useEffect, useState } from "react";
import useSeasons from '@/hooks/useSeasons';
import { useAppDispatch } from "@/context/AppContext";
import { useAnimeListDispatch } from "@/context/AnimeListContext";
import List from "@/components/List";
import { getAnimesByYear, upsertAnime } from '@/lib/api';
import { getAnimeList, getSeasonYears, getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { ReactNode, FC, Dispatch, SetStateAction } from 'react';
import { DndContext, closestCenter, DragEndEvent, DroppableContainer, Active, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Anime } from '@/types/Anime';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import Card from '@/components/Card';
import Cards from '@/components/Cards';

interface SortableItemProps {
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

export const SortableItem: FC<SortableItemProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.id}); 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
};

interface SortableList {
  children: ReactNode,
  list: any[],
  setList: Dispatch<SetStateAction<any[]>>
}

export const SortableList: FC<SortableList> = ({children, list, setList}) => {
  // const [ showAll, setShowAll ] = useState(false);
  // const [ fetchFromApi, setFetchFromApi] = useState(false);
  // const { seasonYears } = useAppDispatch();
  // const { latestYear, getMoreAnime } = useSeasons();
  // const [ hasMore, setHasMore ] = useState({ranked: true, watchlist: true});
  // const [ collapsed, setCollapsed ] = useState<Record<string, boolean>>(seasonYears.reduce((prev, current) => ({...prev, [current.toString()]: false}), {}));
  // const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  // const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  // const getList = (year: number) => {
  //   if (!animeList) return [];
  //   if (showAll) {
  //     return animeList[year.toString()] || []
  //   }
  //   else {
  //     return (animeList[year.toString()] || []).filter(anime => !anime.isWatched)
  //   }
  // }

  // const loadMore = async (listName: 'ranked' | 'watchlist' = 'ranked') => {
  //   const list = listName === 'ranked' ? animeRankedList : animeWatchList;
  //   const setList = listName === 'ranked' ? setAnimeRankedList : setAnimeWatchList;
  //   const getMoreApi = listName === 'ranked' ? getAnimeRankedList : getAnimeWatchList;
  //   const nextAnimeIndex = list.length;

  //   const moreAnimes = await getMoreApi({fromIndex: nextAnimeIndex, toIndex: nextAnimeIndex + 10});

  //   if (moreAnimes.length) {
  //     setList((prevAnimeList) => ([...prevAnimeList, ...moreAnimes]))
  //   }
  //   else {
  //     setHasMore((prev) => ({
  //       ...prev,
  //       [listName]: false
  //     }));
  //   }
  // }

  // const toggleCollapse = (year: number) => {
  //   const yearString = year.toString();

  //   setCollapsed((prev) => ({
  //     ...prev,
  //     [yearString]: !prev[yearString]
  //   }))
  // }

  const [activeItem, setActiveItem] = useState<Anime | null>(null);

  const ids = () => list.map(item => item.id);

  const onDragStart = ({active}: {active: Active}) => {
    const draggedItem = list.find(item => item.id === active.id)
    setActiveItem((_) => draggedItem || null)
  };

  // const onDragOver = ({ draggable, droppable }: { draggable: DragStartEvent, droppable: DroppableContainer }) => {
  //   if (draggable && droppable) {
  //     // const currentItems = list;
  //     // const fromIndex = ids().indexOf(Number(draggable.id));
  //     const toIndex = ids().indexOf(Number(droppable.id));
  //     // if (cardRef) {
  //     //   cardRef.scrollIntoView({
  //     //     behavior: 'smooth',
  //     //     block: 'start',
  //     //   })
  //     // }

  //     // TODO update all cards ranks as active draggable
  //     // const updatedItems = currentItems.slice();
  //     // updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
  //     // const updatedItemRanks = updatedItems.map((anime, index) => ({
  //     //   ...anime,
  //     //   rank: index + 1
  //     // }))

  //     // setList(updatedItemRanks);

  //     const draggedItem = list.find(item => item.id === draggable.id)
  //     setActiveItem((_) => draggedItem ? ({
  //       ...draggedItem,
  //       rank: toIndex + 1
  //     }) : null)
  //   }
  // }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over) {
      const currentItems = list;
      const fromIndex = ids().indexOf(Number(active.id));
      const toIndex = ids().indexOf(Number(over.id));
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        const updatedItemRanks = updatedItems.map((item, index) => ({
          ...item,
          rank: index + 1
        }))

        const changedValues = updatedItemRanks.filter((_, index) => {
          if (fromIndex < toIndex) {
            return index >= fromIndex && index <= toIndex
          }
          else {
            return index >= toIndex && index <= fromIndex
          }
        })
        
        upsertAnime(changedValues)
        // updateDb(changedValues)
        setList((_) => updatedItemRanks);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      // onDragOver={onDragOver}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
      <SortableContext
        items={ids()}
        strategy={verticalListSortingStrategy}
      >
        {children}
        {/* <List
          scrollableTarget='ranked-list'
          list={list}
          loadMore={loadMore}
          hasMore={hasMore.ranked}
        >
          <Cards list={list} sortable={true} showRank={true} />
        </List> */}
      </SortableContext>
    </DndContext>
  )
}
