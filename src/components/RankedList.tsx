import { FC, useState, useEffect } from "react";
import { getAnimeRankedList, getRankedListCount } from '@/lib/api';
import { useRankedListDispatch } from "@/context/RankedListContext";
import List from './List';

const RankedList: FC = () => {
  const [ hasMore, setHasMore ] = useState(true);
  const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  
  useEffect(() => {
    (async () => {
      const rankedListCount = await getRankedListCount()
      if (animeRankedList.length === rankedListCount) {
        setHasMore(false);
      }
    })()
  }, [])

  const loadMore = async () => {
    const nextAnimeIndex = animeRankedList.length;

    const moreAnimes = await getAnimeRankedList({fromIndex: nextAnimeIndex, toIndex: nextAnimeIndex + 10});

    if (moreAnimes.length) {
      setAnimeRankedList((prevAnimeList) => ([...prevAnimeList, ...moreAnimes]))
    }
    else {
      setHasMore(false);
    }
  }

  return (
    <div id='ranked-list' className='list space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
      <List 
        sortable={true}
        showRank={true}
        scrollableTarget='ranked-list'
        list={animeRankedList}
        setList={setAnimeRankedList}
        loadMore={loadMore}
        hasMore={hasMore}
      />
    </div>
  )
}

export default RankedList;