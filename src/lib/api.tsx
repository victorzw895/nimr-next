import { supabase } from './supabaseClient';
import { Anime, AnimesByYear } from '@/types/Anime';
import { DummyDBSeasons } from '@/context/AppContext';
import { DummyDBAnimes } from '@/context/AnimeListContext';
import { DummyDBRanked } from '@/context/RankedListContext';
import { DummyDBWatch } from '@/context/WatchListContext';

export const fetchAnimes = async ({limit, offset, year} = {limit: 20, offset: 0, year: 2000}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ANIME_API}?page[limit]=${limit}&page[offset]=${offset}&filter[season_year]=${year}&sort=createdAt`);
  return await response.json();
}

export const getSeasonYears = async () => {
  let { data }: { data: number[] | null } = !supabase ? DummyDBSeasons : await supabase
      .rpc('getseasonyears')

  return data;
}

export const getAnimesByYear = async ({fromIndex = 0, toIndex = 10, year, limit = 10} = {fromIndex: 0, toIndex: 10, year: 2000, limit: 10}) => {
  const { data } = !supabase ? sortData(DummyDBAnimes, 'id') : await supabase
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
                      tiny: anime.attributes?.posterImage.tiny,
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
  const { data } = !supabase ? sortData(DummyDBRanked, 'rank') : await supabase
      .from('AnimeList')
      .select()
      .eq('isWatched', true)
      .range(fromIndex, toIndex)
      .order('rank', { ascending: true })
      .limit(limit);

  return data as Anime[];
}

export const getRankedListCount = async () => {
  const { count } = !supabase ? DummyDBRanked : await supabase
    .from('AnimeList')
    .select('*', { count: 'exact', head: true })
    .eq('isWatched', true);

  return count ?? 0;
}

const sortData = (db: Record<'data', Anime[]>, attributeName: keyof Anime) => {
  const sortedData = db.data.sort((a, b) => {
    if (a[attributeName] === b[attributeName]) {
      return 0;
    }
    if (a[attributeName] === null) {
        return 1;
    }
    if (b[attributeName] === null) {
        return -1;
    }
    return a[attributeName]! < b[attributeName]! ? -1 : 1;
  })
  
  return { data: sortedData }
}

export const getAnimeWatchList = async ({fromIndex, toIndex, limit = 10} = {fromIndex: 0, toIndex: 10, limit: 10}) => {
  const { data } = !supabase ? sortData(DummyDBWatch, 'rank') : await supabase
      .from('AnimeList')
      .select()
      .eq('watchlist', true)
      .range(fromIndex, toIndex)
      .order('rank', { ascending: true })
      .limit(limit);

  return data as Anime[];
}

export const getWatchListCount = async () => {
  const { count } = !supabase ? DummyDBWatch : await supabase
    .from('AnimeList')
    .select('*', { count: 'exact', head: true })
    .eq('watchlist', true);

  return count ?? 0;
}


export const insertAnime = async (anime: Anime[]) => {
  if (supabase) {
    const { error } = await supabase
        .from('AnimeList')
        .insert(anime)
  } else {
    DummyDBAnimes.data.push(...anime)
  }
}

export const upsertAnime = async (anime: Anime | Anime[]) => {
  if (supabase) {
    const { data }: {data: Anime[] | null} = await supabase
        .from('AnimeList')
        .upsert(anime)
        .select()
    
    return data;
  }
  if (Array.isArray(anime)) {
    const currentDB = [...DummyDBAnimes.data];
    anime.map((a) => {
      const dbAnimeIndex = currentDB.findIndex(dbAnime => dbAnime.id === a.id)
      if (dbAnimeIndex >= 0) {
        DummyDBAnimes.data.splice(dbAnimeIndex, 1, a);
      }
      else {
        DummyDBAnimes.data.push(a)
      }
    })
    return anime
  }
  else {
    const dbAnimeIndex = DummyDBAnimes.data.findIndex(dbAnime => dbAnime.id === anime.id);
    if (dbAnimeIndex >= 0) {
      DummyDBAnimes.data.splice(dbAnimeIndex, 1, anime);
    }
    else {
      DummyDBAnimes.data.push(anime);
    }

    return [anime]
  }
}

// export const updateAnimeWatched = async (anime: Anime) => {
//   const { data }: {data: Anime | null} = await supabase
//       .from('AnimeList')
//       .update(anime)
//       .eq('id', anime.id)
//       .select()
//       .single()
  
//   return data;
// }
