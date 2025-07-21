import { FC, useEffect, useState } from "react";
import { getAnimeWatchList, getWatchListCount, upsertAnime } from '@/lib/api';
import { useWatchListDispatch } from "@/context/WatchListContext";
import List from './List';

const RankedList: FC = () => {
  const [ hasMore, setHasMore ] = useState(true);
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  useEffect(() => {
    (async () => {
      const watchList = await getAnimeWatchList();
      setAnimeWatchList(watchList)

      const watchListCount = await getWatchListCount()
      if (watchList.length === watchListCount) {
        setHasMore(false);
      }
    })()
  }, [])

  const loadMore = async () => {
    const nextAnimeIndex = animeWatchList.length;

    const moreAnimes = await getAnimeWatchList({fromIndex: nextAnimeIndex, toIndex: nextAnimeIndex + 10});

    if (moreAnimes.length) {
      setAnimeWatchList((prevAnimeList) => ([...prevAnimeList, ...moreAnimes]))
    }
    else {
      setHasMore(false);
    }
  }

  return (
    <div id='watch-list' className='list space-y-1 max-h-148 overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-152 pb-4'>
      <List 
        sortable={true}
        showRank={true}
        scrollableTarget='watch-list'
        list={animeWatchList}
        setList={setAnimeWatchList}
        loadMore={loadMore}
        hasMore={hasMore}
        updateDb={upsertAnime}
      />
    </div>
  )
}

export default RankedList;