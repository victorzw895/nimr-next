import { supabase } from './supabaseClient';
import { Anime, AnimesByYear } from '@/types/Anime';

const fetchAnimes = async ({limit, offset, year} = {limit: 20, offset: 0, year: 2000}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ANIME_API}?page[limit]=${limit}&page[offset]=${offset}&filter[season_year]=${year}&sort=createdAt`);
  return await response.json();
}

const getSeasonYears = async () => {
  let { data }: { data: number[] | null } = await supabase
      .rpc('getseasonyears')

  return data;
}

const getAnimesByYear = async (year: number) => {
  const { data } = await supabase
      .from('AnimeList')
      .select()
      .eq('seasonYear', year)
      .order('id', { ascending: true })
  
  return data as Anime[];
}

const getAllAnimes = async (seasonYears: number[]) => {
  const animes = await Promise.all(seasonYears.map(async (year) => await getAnimesByYear(year)))

  const animesByYear: {[x: string]: Anime[]} = seasonYears.reduce((acc, year, index) => ({
      ...acc,
      [year.toString()]: animes[index]
  }), {})

  return animesByYear;
}

const getAnimeList = async (seasonYears: number[]) => {
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

  // return {'2000': [data['2000'][0]]};
  return data;
}

const getAnimeRankedList = async () => {
  const { data } = await supabase
      .from('AnimeList')
      .select()
      .eq('isWatched', true)
      .order('rank', { ascending: true });

  return data as Anime[];
}

const getAnimeWatchList = async () => {
  const { data } = await supabase
      .from('AnimeList')
      .select()
      .eq('watchlist', true)
      .order('rank', { ascending: true });

  return data as Anime[];
}

const insertAnime = async (anime: Anime[]) => {
  const { error } = await supabase
      .from('AnimeList')
      .insert(anime)
}

const upsertAnime = async (anime: Anime | Anime[]) => {
  const { data }: {data: Anime[] | null} = await supabase
      .from('AnimeList')
      .upsert(anime)
      .select()
  
  return data;
}

const updateAnimeWatched = async (anime: Anime) => {
  const { data }: {data: Anime | null} = await supabase
      .from('AnimeList')
      .update(anime)
      .eq('id', anime.id)
      .select()
      .single()
  
  return data;
}

export {
  fetchAnimes,
  getAnimeList,
  getAnimeRankedList,
  getAnimeWatchList,
  getSeasonYears,
  insertAnime,
  upsertAnime,
  updateAnimeWatched
}