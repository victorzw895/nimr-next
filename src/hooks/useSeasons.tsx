import { useState, useEffect } from 'react';
// import { setAnimeList } from '../App';
import {
  fetchAnimes,
  upsertAnime,
  getSeasonYears,
} from '@/lib/api';
import { Anime, AnimesByYear } from '@/types/Anime';
import moment from 'moment';
import { useAppDispatch } from '@/context/AppContext';

const useSeasons = () => {
  const { animeList, setAnimeList, seasonYears, setSeasonYears } = useAppDispatch();
  const latestYear = () => seasonYears.slice(-1)[0];

  const loadMore = async () => {
    if (!animeList) return;
    const limit = 20;
    const latestYearAnimeList = animeList[latestYear().toString()];
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

      const latestYearString = latestYear().toString()

      if (latestYearAnimeList && latestYearAnimeList.length) {
        setAnimeList({
          ...animeList,
          [latestYearString]: [...animeList[latestYearString], ...upsertAnimes]
        })
      }
      else {
        setAnimeList((animeByYears) => ({
          ...animeByYears,
          [latestYearString]: upsertAnimes
        }))
      }
    }

    if (limit + offset <= moreAnimes.meta.count) return;
    if (latestYear() === moment().year()) return;

    setSeasonYears((years) => [...years, latestYear() + 1])
  }

  return {seasonYears, setSeasonYears, loadMore}
}

export default useSeasons;