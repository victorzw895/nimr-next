import { FC } from "react";
import moment from 'moment';
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import Image from "next/image";
import { useAppDispatch } from "@/context/AppContext";
import { useSelectedAnimeDispatch } from "@/context/SelectedAnimeContext";
import { useAnimeListDispatch } from "@/context/AnimeListContext";
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import {
  upsertAnime,
  getRankedListCount,
  getWatchListCount
} from '@/lib/api';

interface PreviewProps {
  toggleCollapse: (year: number) => void
}

const Preview: FC<PreviewProps> = ({ toggleCollapse }) => {
  const { setFocusAnimeId } = useAppDispatch();
  const { selectedAnime, setSelectedAnime } = useSelectedAnimeDispatch();
  const { animeList, setAnimeList } = useAnimeListDispatch();
  const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  const handleNextAnime = () => {
    if (!selectedAnime) return;
    const currentSeason = selectedAnime.seasonYear;
    const nextAnimeIndex = animeList[currentSeason.toString()].findIndex(anime => anime.id === selectedAnime.id) + 1;
    if (nextAnimeIndex < animeList[currentSeason.toString()].length) {
      const nextAnime = animeList[currentSeason.toString()][nextAnimeIndex];
      setFocusAnimeId(nextAnime.id)
      setSelectedAnime(nextAnime);
    }
    else if ((currentSeason + 1).toString() in animeList) {
      const nextAnime = animeList[(currentSeason + 1).toString()][0];
      toggleCollapse(currentSeason + 1)
      setFocusAnimeId(nextAnime.id)
      setSelectedAnime(nextAnime);
    }
  }

  const toggleAnimeWatched = async () => {
    if (!selectedAnime) return;
    const count = !selectedAnime.isWatched ? await getRankedListCount() + 1 : null;
  
    const updatedAnime = {
      id: selectedAnime.id,
      attributes: selectedAnime.attributes,
      rank: count,
      stars: 0,
      isWatched: !selectedAnime.isWatched,
      seasonYear: selectedAnime.seasonYear,
      watchlist: false,
    }

    const upsertedAnime = (await upsertAnime(updatedAnime) || [])[0]
    const currentSeason = upsertedAnime.seasonYear;
    const currentSeasonString = currentSeason.toString();

    let updatedCurrentSeasonAnimeList = animeList[currentSeasonString];
    let updatedRankedList = [];

    if (selectedAnime.watchlist) {
      const updatedWatchlist = animeWatchList
        .filter(anime => anime.id !== upsertedAnime.id)
        .map((anime, index) => ({...anime, rank: index + 1}))

      updatedCurrentSeasonAnimeList = updatedCurrentSeasonAnimeList.map(anime => {
        if (anime.id === upsertedAnime.id) {
          return {
            ...anime,
            watchlist: false
          }
        }
        return anime
      })
      setAnimeWatchList(updatedWatchlist)
    }

    if (upsertedAnime.isWatched) {
      setFocusAnimeId(upsertedAnime.id)
      const nextAnimeIndex = animeList[currentSeasonString].findIndex(anime => anime.id === selectedAnime.id) + 1;
      if (nextAnimeIndex < animeList[currentSeasonString].length) {
        setSelectedAnime(animeList[currentSeasonString][nextAnimeIndex]);
      }
      else if ((currentSeason + 1).toString() in animeList) {
        setSelectedAnime(animeList[(currentSeason + 1).toString()][0]);
      }

      updatedRankedList = [...animeRankedList, upsertedAnime]
    }
    else {
      setSelectedAnime(null)
      updatedRankedList = animeRankedList
        .filter(anime => anime.id !== upsertedAnime.id)
        .map((anime, index) => ({...anime, rank: index + 1}))
    }

    setAnimeList(prev => ({
      ...prev,
      [currentSeasonString]: updatedCurrentSeasonAnimeList.map(anime => {
        if (anime.id === upsertedAnime.id) {
          return {
            ...anime,
            isWatched: upsertedAnime.isWatched
          }
        }
        return anime
      })
    }))
    setAnimeRankedList(updatedRankedList)
  }

  const toggleAnimeWatchlist = async () => {
    if (!selectedAnime) return;
    const count = !selectedAnime.watchlist ? await getWatchListCount() + 1 : null;
    const updatedAnime = {
      id: selectedAnime.id,
      attributes: selectedAnime.attributes,
      rank: count,
      stars: 0,
      isWatched: false,
      seasonYear: selectedAnime.seasonYear,
      watchlist: !selectedAnime.watchlist,
    }

    const upsertedAnime = (await upsertAnime(updatedAnime) || [])[0]
    const currentSeason = upsertedAnime.seasonYear;
    const currentSeasonString = currentSeason.toString();

    let updatedCurrentSeasonAnimeList = animeList[currentSeasonString];
    let updatedWatchlist = [];

    if (selectedAnime.isWatched) {
      const updatedRankedlist = animeRankedList
        .filter(anime => anime.id !== upsertedAnime.id)
        .map((anime, index) => ({...anime, rank: index + 1}))

      updatedCurrentSeasonAnimeList = updatedCurrentSeasonAnimeList.map(anime => {
        if (anime.id === upsertedAnime.id) {
          return {
            ...anime,
            isWatched: false
          }
        }
        return anime
      })
      setAnimeRankedList(updatedRankedlist)
    }

    if (upsertedAnime.watchlist) {
      updatedWatchlist = [...animeWatchList, upsertedAnime]
    }
    else {
      updatedWatchlist = animeWatchList
        .filter(anime => anime.id !== upsertedAnime.id)
        .map((anime, index) => ({...anime, rank: index + 1}))
    }

    setSelectedAnime(upsertedAnime);
    setAnimeList(prev => ({
      ...prev,
      [currentSeasonString]: updatedCurrentSeasonAnimeList.map(anime => {
        if (anime.id === upsertedAnime.id) {
          return {
            ...anime,
            isWatched: upsertedAnime.isWatched
          }
        }
        return anime
      })
    }))
    setAnimeList(prev => ({
      ...prev,
      [currentSeasonString]: animeList[currentSeasonString].map(anime => {
        if (anime.id === upsertedAnime.id) {
          return {
            ...anime,
            watchlist: !anime.watchlist,
          }
        }
        return anime
      })
    }))
    setAnimeWatchList(updatedWatchlist)
  }

  const inWatchList = () => {
    return selectedAnime && selectedAnime.watchlist ? 
      <FaHeart className='absolute top-0 right-0 m-2' size='32' onClick={toggleAnimeWatchlist} />
        :
      <FaRegHeart className='absolute top-0 right-0 m-2' size='32' onClick={toggleAnimeWatchlist} />
  }

  return (
    selectedAnime && selectedAnime.attributes ?
      <>
        <section className='col-span-2 self-center'>
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