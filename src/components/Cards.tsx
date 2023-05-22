import Card from '@/components/Card';
import { Anime } from '@/types/Anime';
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import { FunctionComponent, useRef, useEffect, useState, ReactElement } from "react";
import useSeasons from '@/hooks/useSeasons';
import { useAppDispatch } from "@/context/AppContext";
import { useAnimeListDispatch } from "@/context/AnimeListContext";
import { getAnimesByYear, upsertAnime } from '@/lib/api';
import { getAnimeList, getSeasonYears, getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { ReactNode, FC, Dispatch, SetStateAction } from 'react';
import { DndContext, closestCenter, DragEndEvent, DroppableContainer, Active, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";

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

const Sortable: FC<SortableProps> = (props) => {
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

interface SortableWrapperProps {
  condition: boolean,
  Wrapper: (children: ReactNode) => JSX.Element,
  children: ReactNode
}

const SortableWrapper = ({condition, Wrapper, children}: SortableWrapperProps) => condition ? Wrapper(children) : <>{children}</>;

interface CardsOptionsProps {
  list: Anime[],
  sortable: boolean,
  showRank: boolean,
}

const Cards = ({list, sortable = false, showRank = false}: CardsOptionsProps) => {
  const { setSelectedAnime } = useSelectedAnimeDispatch();

  return (
    <>
      {
        list.map(anime => 
          <SortableWrapper
            key={anime.id}
            condition={sortable}
            Wrapper={(children: ReactNode) => <Sortable key={anime.id} id={anime.id}>{children}</Sortable>}
          >
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
              rank={showRank ? anime.rank : null}
              stars={showRank ? anime.stars : null}
            />
          </SortableWrapper>
        )
      }
    </>
  )
}

export default Cards;