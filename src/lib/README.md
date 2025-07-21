# Lib

This directory contains utility libraries and external service integrations for data management.

## Files

### `api.tsx`
Core API functions for anime data management with Kitsu API integration and Supabase database operations.

**Key Functions:**
- `fetchAnimes()` - Fetches anime data from Kitsu API
- `getAnimesByYear()` - Gets anime filtered by year
- `getAnimeList()` - Comprehensive anime list retrieval
- `upsertAnime()` - Updates/inserts anime data
- `getAnimeRankedList()` - Gets user's ranked anime
- `getAnimeWatchList()` - Gets watch list anime

### `supabaseClient.tsx`
Supabase client configuration and initialisation.

## Usage

```tsx
import { getAnimesByYear, upsertAnime } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';

// Fetch anime data
const animeList = await getAnimesByYear({ year: 2023, limit: 20 });

// Update anime
const updatedAnime = await upsertAnime(modifiedAnime);
```

## Data Flow

- **Primary**: Supabase database
- **Secondary**: Kitsu API (when database is empty)
- **Fallback**: Dummy data (for development/offline)
