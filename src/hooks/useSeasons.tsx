import { useState, useEffect, Dispatch, SetStateAction } from 'react';
// import { setAnimeList } from '../App';
import {
  fetchAnimes,
  upsertAnime,
  getSeasonYears,
} from '@/lib/api';
import { Anime, AnimesByYear } from '@/types/Anime';
import moment from 'moment';
import { useAppDispatch } from '@/context/AppContext';
import { useAnimeListDispatch } from '@/context/AnimeListContext';

const useSeasons = () => {
  const { seasonYears, setSeasonYears } = useAppDispatch();
  const { animeList, setAnimeList } = useAnimeListDispatch();
  const latestYear = () => seasonYears.slice(-1)[0];

  const getMoreAnime = async (setHasMore: Dispatch<SetStateAction<Record<string, boolean>>>) => {
    const limit = 20;
    const latestYearString = latestYear().toString()
    const latestYearAnimeList = animeList[latestYearString];
    const offset = latestYearAnimeList && latestYearAnimeList.length ?
      latestYearAnimeList.filter(anime => anime.seasonYear === latestYear()).length
      : 0;
    const moreAnimes = await fetchAnimes({limit, offset, year: latestYear()});

    if (moreAnimes.data.length) {
      const upsertAnimes = (await upsertAnime(
        moreAnimes.data.map((anime: Partial<Anime>) => ({
          id: anime.id,
          attributes: anime.attributes,
          stars: 0,
          isWatched: false,
          seasonYear: latestYear()
        }))
      )) || [];


      if (latestYearAnimeList && latestYearAnimeList.length) {
        setAnimeList((prevAnimeList) => ({
          ...prevAnimeList,
          [latestYearString]: [...prevAnimeList[latestYearString], ...upsertAnimes]
        }))
      }
      else {
        setAnimeList((prevAnimeList) => ({
          ...prevAnimeList,
          [latestYearString]: upsertAnimes
        }))
      }
    }
    else {
      setHasMore((prev) => ({
        ...prev,
        [latestYearString]: false
      }));
    }

    if (limit + offset <= moreAnimes.meta.count) return;
    if (latestYear() === moment().year()) return;

    setSeasonYears((years) => [...years, latestYear() + 1])
  }

  return {latestYear, getMoreAnime}
}

export default useSeasons;