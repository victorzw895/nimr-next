import { FC, useEffect, useState } from "react";
import { getAnimeRankedList, getAnimeWatchList, } from '@/lib/api';
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import List from './List';

const ConsumedList: FC = () => {
  const [ showWatchList, setShowWatchList ] = useState(false);
  const [ hasMore, setHasMore ] = useState({ranked: true, watchlist: true});
  const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  useEffect(() => {
    (async () => {
      const animeWatchList = await getAnimeWatchList();
      setAnimeWatchList(animeWatchList)
    })()
  }, [])

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

  return (
    <section className='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          <button key='ranked' className={`tab tab-lifted font-bold ${!showWatchList ? 'tab-active' : ''}`} onClick={() => setShowWatchList(false)}>Ranked</button>
          <button key='watchlist' className={`tab tab-lifted font-bold ${showWatchList ? 'tab-active' : ''}`} onClick={() => setShowWatchList(true)}>WatchList</button>
        </div>
        <div id='consumed-list' className='list space-y-1 max-h-[37rem] overflow-y-scroll scrollbar-hide bg-light rounded-b-lg min-h-[38rem] pb-4'>
          <List 
            sortable={true}
            showRank={true}
            scrollableTarget='consumed-list'
            list={showWatchList ? animeWatchList : animeRankedList}
            setList={showWatchList ? setAnimeWatchList : setAnimeRankedList}
            loadMore={() => loadMore(showWatchList ? 'watchlist' : 'ranked')}
            hasMore={showWatchList ? hasMore.watchlist : hasMore.ranked}
          />
        </div>
      </div>
    </section>
  )
}

export default ConsumedList;