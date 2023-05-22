import { FunctionComponent, ReactNode } from "react";
import { Anime } from '@/types/Anime';
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import InfiniteScroll from 'react-infinite-scroll-component';

export interface LazyScrollProps {
  scrollableTarget: string,
  list: Anime[],
  loadMore: () => void,
  hasMore: boolean,
  children: ReactNode,
}

const LazyScroll: FunctionComponent<LazyScrollProps> = (props) => {
  // const { setSelectedAnime } = useSelectedAnimeDispatch();

  return (
    <InfiniteScroll
      dataLength={props.list.length}
      next={props.loadMore}
      hasMore={props.hasMore}
      loader={<h3> Loading...</h3>}
      endMessage={<h4>Nothing more to show</h4>}
      scrollableTarget={props.scrollableTarget}
    >
      {props.children}
    </InfiniteScroll>
  )
}

export default LazyScroll;