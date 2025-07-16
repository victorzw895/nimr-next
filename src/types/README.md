# Types

This directory contains TypeScript type definitions for the NIMR-Next application.

## Files

### `Anime.tsx`
Core TypeScript interfaces and types for anime data structures.

**Key Types:**
- `Anime` - Main anime interface with attributes, ranking, and user data
- `Images` - Image URL structure for posters and covers
- `AnimesByYear` - Record type for organising anime by year

## Usage

```tsx
import { Anime, AnimesByYear } from '@/types/Anime';

const anime: Anime = {
  id: 1,
  attributes: {
    titles: { en: 'Anime Title' },
    synopsis: 'Description',
    posterImage: { small: 'url', tiny: 'url' }
  },
  rank: null,
  stars: 0,
  isWatched: false,
  seasonYear: 2023,
  watchlist: false
};

const animeByYear: AnimesByYear = {
  '2023': [anime],
  '2022': []
};
