import { FunctionComponent, ReactNode, Dispatch, SetStateAction, FC, lazy } from "react";
import Card from './Card';
import { Anime } from '@/types/Anime';
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import InfiniteScroll from 'react-infinite-scroll-component';
import useSeasons from '@/hooks/useSeasons';
import { useAppDispatch } from "@/context/AppContext";
import LazyScroll from "@/utils/LazyScroll";
import { getAnimeList, getSeasonYears, getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import { SortableList } from '@/utils/Sortable';
import { SortableItem } from '@/utils/Sortable';

interface ConditionalWrapperProps {
  condition: boolean,
  Wrapper: FC<any>,
  children: ReactNode,
  [x: string]: unknown
}


const ConditionalWrapper = ({condition, Wrapper, children, ...restProps}: ConditionalWrapperProps) => condition ? <Wrapper {...restProps}>{children}</Wrapper> : <>{children}</>;

interface WrapperProps {
  condition: boolean,
  children: ReactNode,
  [x: string]: unknown
}

const SortableWrapper = ({children, ...restProps}: WrapperProps) => <ConditionalWrapper Wrapper={SortableList} {...restProps}>{children}</ConditionalWrapper>

const LazyScrollWrapper = ({children, ...restProps}: WrapperProps) => <ConditionalWrapper Wrapper={LazyScroll} {...restProps}>{children}</ConditionalWrapper>

// interface BaseListProps {
//   list: Anime[],
// }

// interface SortableProps extends BaseListProps {
//   setList: Dispatch<SetStateAction<Anime[]>>
// }

// interface LazyScrollProps extends BaseListProps {
//   scrollableTarget: string,
//   loadMore: () => void,
//   hasMore: boolean,
// }
export interface ListProps {
  list: Anime[],
  setList: Dispatch<SetStateAction<Anime[]>>,
  sortable?: boolean,
  showRank?: boolean,
  lazyScroll?: boolean,
  scrollableTarget?: string,
  loadMore: () => void,
  hasMore?: boolean,
  // children: ReactNode,
}

const List: FunctionComponent<ListProps> = ({
  list,
  setList,
  sortable = false,
  showRank = false,
  lazyScroll = true,
  scrollableTarget,
  loadMore,
  hasMore = true,
}) => {
  const { setSelectedAnime } = useSelectedAnimeDispatch();

  return (
    <SortableWrapper Wrapper={SortableList} condition={sortable} list={list} setList={setList} >
      <LazyScrollWrapper
        Wrapper={LazyScroll}
        condition={lazyScroll}
        list={list}
        scrollableTarget={scrollableTarget}
        loadMore={loadMore}
        hasMore={hasMore}
      >
        {
          list.map(anime => 
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
                rank={showRank ? anime.rank : null}
                stars={showRank ? anime.stars : null}
              />
            </SortableItem>
          )
        }
      </LazyScrollWrapper>
    </SortableWrapper>
  )
}

export default List;