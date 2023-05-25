import { useAppDispatch } from "@/context/AppContext";
import { useAnimeListDispatch } from "@/context/AnimeListContext";
import { useRankedListDispatch } from "@/context/RankedListContext";
import { useWatchListDispatch } from "@/context/WatchListContext";
import { useActor } from "@/xstate-machine/PreviewMachine";
import {
  upsertAnime,
  getRankedListCount,
  getWatchListCount
} from '@/lib/api';

const usePreview = (toggleCollapse: (year: number) => void) => {
  const [ state, send ] = useActor();
  const { selectedAnime } = state.context;
  const { setFocusAnimeId } = useAppDispatch();
  const { animeList, setAnimeList } = useAnimeListDispatch();
  const { animeRankedList, setAnimeRankedList } = useRankedListDispatch();
  const { animeWatchList, setAnimeWatchList } = useWatchListDispatch();

  const handleNextAnime = () => {
    if (!selectedAnime) return;
    let nextAnime;
    const currentSeason = selectedAnime.seasonYear;
    const nextAnimeIndex = animeList[currentSeason.toString()].findIndex(anime => anime.id === selectedAnime.id) + 1;
    if (nextAnimeIndex < animeList[currentSeason.toString()].length) {
      nextAnime = animeList[currentSeason.toString()][nextAnimeIndex];
      setFocusAnimeId(nextAnime.id)
    }
    else if ((currentSeason + 1).toString() in animeList) {
      nextAnime = animeList[(currentSeason + 1).toString()][0];
      toggleCollapse(currentSeason + 1)
      setFocusAnimeId(nextAnime.id)
    }
    
    if (!nextAnime) return;

    send({type: 'NEXT_ANIME', anime: nextAnime})
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
        send({type: 'TOGGLE_RANKED', anime: animeList[currentSeasonString][nextAnimeIndex]})
      }
      else if ((currentSeason + 1).toString() in animeList) {
        send({type: 'TOGGLE_RANKED', anime: animeList[currentSeasonString][nextAnimeIndex]})
      }

      updatedRankedList = [...animeRankedList, upsertedAnime]
    }
    else {
      // setSelectedAnime(null)
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

    send({type: 'TOGGLE_WATCHLIST', anime: upsertedAnime})
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

  return {
    handleNextAnime,
    toggleAnimeWatched,
    toggleAnimeWatchlist,
  }
}

export default usePreview;