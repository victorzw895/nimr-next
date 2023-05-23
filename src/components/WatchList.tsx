import { FC, useEffect, useState } from "react";
import { getAnimeWatchList } from '@/lib/api';
import { useWatchListDispatch } from "@/context/WatchListContext";
import List from './List';

const RankedList: FC = () => {
  const [ hasMore, setHasMore ] = useState(true);
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  useEffect(() => {
    (async () => {
      const animeWatchList = await getAnimeWatchList();
      setAnimeWatchList(animeWatchList)
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
    <div id='watch-list' className='list space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
      <List 
        sortable={true}
        showRank={true}
        scrollableTarget='watch-list'
        list={animeWatchList}
        setList={setAnimeWatchList}
        loadMore={loadMore}
        hasMore={hasMore}
      />
    </div>
  )
}

export default RankedList;