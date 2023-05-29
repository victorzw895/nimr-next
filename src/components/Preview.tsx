import { FC, useEffect } from "react";
import moment from 'moment';
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import Image from "next/image";
import usePreview, { useSelectedAnime } from "@/hooks/usePreview";

interface PreviewProps {
  toggleCollapse: (year: number) => void
}

const Preview: FC<PreviewProps> = ({ toggleCollapse }) => {
  const { handleNextAnime, toggleAnimeWatched, toggleAnimeWatchlist } = usePreview(toggleCollapse)
  const { selectedAnime } = useSelectedAnime();

  const inWatchList = () => {
    return selectedAnime && selectedAnime.watchlist ? 
      <FaHeart className='absolute top-0 right-0 m-2' size='32' onClick={toggleAnimeWatchlist} />
        :
      <FaRegHeart className='absolute top-0 right-0 m-2' size='32' onClick={toggleAnimeWatchlist} />
  }

  return (
    selectedAnime && selectedAnime.attributes ?
      <>
        <section className='flex flex-col justify-between col-span-2 self-center h-[37rem]'>
          <div className='relative flex items-center mx-1'>
            {
              selectedAnime.attributes.posterImage?.small ?
              <Image
                data-testid='poster'
                className='max-h-80 m-2'
                height={320}
                width={225}
                src={selectedAnime.attributes.posterImage?.small}
                alt={`${selectedAnime.attributes.titles.en}-image`}
              />
                :
              <div className='h-80 m-2'></div>
            }
            {inWatchList()}
            <div data-testid='text-content' className='ml-2'>
              <p>{selectedAnime.attributes.titles.en_jp}</p>
              <p className='text-xs'>{selectedAnime.attributes.titles.en}</p>
              <p className='text-xs'>Rating {selectedAnime.attributes.ageRatingGuide}</p>
              <p className='text-xs'>Release Date: {moment(selectedAnime.attributes.startDate).format('YYYY')}</p>
            </div>
          </div>
          <div className='ml-2 min-h-[10rem]'>
            <p>Description</p>
            <p data-testid='description' className='text-xs line-clamp-8'>{selectedAnime.attributes.description}</p>
          </div>
          <div className='ml-2 flex justify-evenly'>
          <button
            data-testid='watched-button'
            className={`rounded my-3 p-2 ${selectedAnime.isWatched ? 'bg-light text-darkest' : 'bg-dark'}`}
            onClick={toggleAnimeWatched}
          >
            Watched
          </button>
          <button
            data-testid='next-button'
            className={`rounded my-3 p-2 bg-dark`}
            onClick={handleNextAnime}
          >
            Next
          </button>
          </div>
        </section>
      </>
        :
      <></>
  )
}

export default Preview;