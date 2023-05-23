import { FC, useState } from "react";
import RankedList from "./RankedList";
import WatchList from "./WatchList";

const InterestList: FC = () => {
  const [ showWatchList, setShowWatchList ] = useState(false);

  return (
    <section className='col-span-1 bg-darkest rounded shadow-lg shadow-darkest'>
      <div className='box-border pt-3 px-3 h-full'>
        <div className='tabs'>
          <button key='ranked' className={`tab tab-lifted font-bold ${!showWatchList ? 'tab-active' : ''}`} onClick={() => setShowWatchList(false)}>Ranked</button>
          <button key='watchlist' className={`tab tab-lifted font-bold ${showWatchList ? 'tab-active' : ''}`} onClick={() => setShowWatchList(true)}>WatchList</button>
        </div>
        {
          showWatchList ?
            <WatchList />
              :
            <RankedList />
        }
      </div>
    </section>
  )
}

export default InterestList;