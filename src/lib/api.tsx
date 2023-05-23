import { supabase } from './supabaseClient';
import { Anime, AnimesByYear } from '@/types/Anime';

export const fetchAnimes = async ({limit, offset, year} = {limit: 20, offset: 0, year: 2000}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ANIME_API}?page[limit]=${limit}&page[offset]=${offset}&filter[season_year]=${year}&sort=createdAt`);
  return await response.json();
}

export const getSeasonYears = async () => {
  let { data }: { data: number[] | null } = await supabase
      .rpc('getseasonyears')

  return data;
}

export const getAnimesByYear = async ({fromIndex = 0, toIndex = 10, year, limit = 10} = {fromIndex: 0, toIndex: 10, year: 2000, limit: 10}) => {
  const { data } = await supabase
      .from('AnimeList')
      .select()
      .eq('seasonYear', year)
      .range(fromIndex, toIndex)
      .order('id', { ascending: true })
      .limit(limit);
  
  return data as Anime[];
}

const getAllAnimes = async (seasonYears: number[]) => {
  const animes = await Promise.all(seasonYears.map(async (year) => await getAnimesByYear({year})))

  const animesByYear: {[x: string]: Anime[]} = seasonYears.reduce((acc, year, index) => ({
      ...acc,
      [year.toString()]: animes[index]
  }), {})

  return animesByYear;
}

export const getAnimeList = async (seasonYears: number[]) => {
  let data: AnimesByYear;
  const dbAnimes = await getAllAnimes(seasonYears);

  if (dbAnimes && Object.keys(dbAnimes).length) {
      data = dbAnimes
  }
  else {
      const { data: fetchInitialAnimesData }: {data: Partial<Anime>[]} = await fetchAnimes()
      
      data = {
          '2000': fetchInitialAnimesData.map(anime => 
              ({
                  id: anime.id,
                  attributes: {
                    startDate: anime.attributes?.startDate,
                    description: anime.attributes?.description,
                    posterImage: {
                      small: anime.attributes?.posterImage.small,
                    },
                    titles: {
                      en: anime.attributes?.titles.en,
                      en_jp: anime.attributes?.titles.en_jp,
                    },
                    ageRatingGuide: anime.attributes?.ageRatingGuide,
                  },
                  rank: null,
                  stars: 0,
                  isWatched: false,
                  seasonYear: 2000,
              }) as Anime
          )
      }
      
      insertAnime(data['2000'])
  };

  return data;
}

export const getAnimeRankedList = async ({fromIndex, toIndex, limit = 10} = {fromIndex: 0, toIndex: 10, limit: 10}) => {
  const { data } = await supabase
      .from('AnimeList')
      .select()
      .eq('isWatched', true)
      .range(fromIndex, toIndex)
      .order('rank', { ascending: true })
      .limit(limit);

  return data as Anime[];
}

export const getRankedListCount = async () => {
  const { count } = await supabase
    .from('AnimeList')
    .select('*', { count: 'exact', head: true })
    .eq('isWatched', true);

  return count ?? 0;
}

export const getAnimeWatchList = async ({fromIndex, toIndex, limit = 10} = {fromIndex: 0, toIndex: 10, limit: 10}) => {
  const { data } = await supabase
      .from('AnimeList')
      .select()
      .eq('watchlist', true)
      .range(fromIndex, toIndex)
      .order('rank', { ascending: true })
      .limit(limit);

  return data as Anime[];
}

export const getWatchListCount = async () => {
  const { count } = await supabase
    .from('AnimeList')
    .select('*', { count: 'exact', head: true })
    .eq('watchlist', true);

  return count ?? 0;
}


export const insertAnime = async (anime: Anime[]) => {
  const { error } = await supabase
      .from('AnimeList')
      .insert(anime)
}

export const upsertAnime = async (anime: Anime | Anime[]) => {
  const { data }: {data: Anime[] | null} = await supabase
      .from('AnimeList')
      .upsert(anime)
      .select()
  
  return data;
}

export const updateAnimeWatched = async (anime: Anime) => {
  const { data }: {data: Anime | null} = await supabase
      .from('AnimeList')
      .update(anime)
      .eq('id', anime.id)
      .select()
      .single()
  
  return data;
}
