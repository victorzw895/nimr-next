# Zustand Store

This directory contains Zustand store implementations for lightweight state management in the NIMR-Next application. Zustand provides a simple, unopinionated state management solution with minimal boilerplate.

## Files Overview

### `AnimeStore.tsx`
Zustand store implementation for managing anime-related state.

**Features:**
- Lightweight state management
- Minimal boilerplate
- TypeScript support
- Selective subscriptions
- Alternative to React Context and XState

## Zustand Integration

### Why Zustand?

Zustand is used as an alternative state management approach to demonstrate:
- **Simplicity**: Minimal API with less boilerplate than other solutions
- **Performance**: Selective subscriptions prevent unnecessary re-renders
- **Flexibility**: No providers needed, can be used anywhere
- **TypeScript Support**: Excellent TypeScript integration
- **Small Bundle Size**: Lightweight compared to other state management libraries

### When Zustand is Active

Zustand store is used when the environment variable `NEXT_PUBLIC_ZUSTAND=true` is set:

```bash
# Enable Zustand store
NEXT_PUBLIC_ZUSTAND=true npm run dev
```

## AnimeStore Implementation

### Store Interface

```typescript
interface AnimeStore {
  // State
  animeList: AnimesByYear;
  selectedAnime: Anime | null;
  rankedAnimeList: Anime[];
  watchAnimeList: Anime[];
  seasonYears: number[];
  loading: boolean;
  error: string | null;

  // Actions
  setAnimeList: (animeList: AnimesByYear) => void;
  setSelectedAnime: (anime: Anime | null) => void;
  setRankedAnimeList: (rankedList: Anime[]) => void;
  setWatchAnimeList: (watchList: Anime[]) => void;
  setSeasonYears: (years: number[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Complex Actions
  updateAnime: (id: number, updates: Partial<Anime>) => void;
  addAnimeToWatchList: (anime: Anime) => void;
  removeAnimeFromWatchList: (animeId: number) => void;
  rankAnime: (animeId: number, rank: number) => void;
  rateAnime: (animeId: number, stars: number) => void;
  markAsWatched: (animeId: number) => void;
  clearSelection: () => void;

  // Computed/Derived State
  getAnimeByYear: (year: number) => Anime[];
  getWatchedAnime: () => Anime[];
  getUnwatchedAnime: () => Anime[];
  getRankedCount: () => number;
  getWatchListCount: () => number;
}
```

### Store Implementation

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Anime, AnimesByYear } from '@/types/Anime';

interface AnimeStore {
  // State
  animeList: AnimesByYear;
  selectedAnime: Anime | null;
  rankedAnimeList: Anime[];
  watchAnimeList: Anime[];
  seasonYears: number[];
  loading: boolean;
  error: string | null;

  // Actions
  setAnimeList: (animeList: AnimesByYear) => void;
  setSelectedAnime: (anime: Anime | null) => void;
  setRankedAnimeList: (rankedList: Anime[]) => void;
  setWatchAnimeList: (watchList: Anime[]) => void;
  setSeasonYears: (years: number[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateAnime: (id: number, updates: Partial<Anime>) => void;
  addAnimeToWatchList: (anime: Anime) => void;
  removeAnimeFromWatchList: (animeId: number) => void;
  rankAnime: (animeId: number, rank: number) => void;
  rateAnime: (animeId: number, stars: number) => void;
  markAsWatched: (animeId: number) => void;
  clearSelection: () => void;
  getAnimeByYear: (year: number) => Anime[];
  getWatchedAnime: () => Anime[];
  getUnwatchedAnime: () => Anime[];
  getRankedCount: () => number;
  getWatchListCount: () => number;
}

export const useAnimeStore = create<AnimeStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        animeList: {},
        selectedAnime: null,
        rankedAnimeList: [],
        watchAnimeList: [],
        seasonYears: [],
        loading: false,
        error: null,

        // Basic Setters
        setAnimeList: (animeList) =>
          set((state) => {
            state.animeList = animeList;
          }),

        setSelectedAnime: (anime) =>
          set((state) => {
            state.selectedAnime = anime;
          }),

        setRankedAnimeList: (rankedList) =>
          set((state) => {
            state.rankedAnimeList = rankedList;
          }),

        setWatchAnimeList: (watchList) =>
          set((state) => {
            state.watchAnimeList = watchList;
          }),

        setSeasonYears: (years) =>
          set((state) => {
            state.seasonYears = years;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        // Complex Actions
        updateAnime: (id, updates) =>
          set((state) => {
            // Update in main anime list
            Object.keys(state.animeList).forEach((year) => {
              const animeIndex = state.animeList[year].findIndex(
                (anime) => anime.id === id
              );
              if (animeIndex !== -1) {
                Object.assign(state.animeList[year][animeIndex], updates);
              }
            });

            // Update in ranked list
            const rankedIndex = state.rankedAnimeList.findIndex(
              (anime) => anime.id === id
            );
            if (rankedIndex !== -1) {
              Object.assign(state.rankedAnimeList[rankedIndex], updates);
            }

            // Update in watch list
            const watchIndex = state.watchAnimeList.findIndex(
              (anime) => anime.id === id
            );
            if (watchIndex !== -1) {
              Object.assign(state.watchAnimeList[watchIndex], updates);
            }

            // Update selected anime if it matches
            if (state.selectedAnime?.id === id) {
              Object.assign(state.selectedAnime, updates);
            }
          }),

        addAnimeToWatchList: (anime) =>
          set((state) => {
            const exists = state.watchAnimeList.some((a) => a.id === anime.id);
            if (!exists) {
              state.watchAnimeList.push({ ...anime, watchlist: true });
            }
          }),

        removeAnimeFromWatchList: (animeId) =>
          set((state) => {
            state.watchAnimeList = state.watchAnimeList.filter(
              (anime) => anime.id !== animeId
            );
            // Update the anime in main list
            get().updateAnime(animeId, { watchlist: false });
          }),

        rankAnime: (animeId, rank) =>
          set((state) => {
            get().updateAnime(animeId, { rank, isWatched: true });
            
            // Update ranked list
            const anime = get().getAnimeById(animeId);
            if (anime) {
              const existingIndex = state.rankedAnimeList.findIndex(
                (a) => a.id === animeId
              );
              if (existingIndex !== -1) {
                state.rankedAnimeList[existingIndex].rank = rank;
              } else {
                state.rankedAnimeList.push({ ...anime, rank, isWatched: true });
              }
              // Sort by rank
              state.rankedAnimeList.sort((a, b) => (a.rank || 0) - (b.rank || 0));
            }
          }),

        rateAnime: (animeId, stars) =>
          set(() => {
            get().updateAnime(animeId, { stars });
          }),

        markAsWatched: (animeId) =>
          set(() => {
            get().updateAnime(animeId, { isWatched: true });
          }),

        clearSelection: () =>
          set((state) => {
            state.selectedAnime = null;
          }),

        // Computed/Derived State
        getAnimeByYear: (year) => {
          const state = get();
          return state.animeList[year.toString()] || [];
        },

        getWatchedAnime: () => {
          const state = get();
          const allAnime: Anime[] = [];
          Object.values(state.animeList).forEach((yearAnime) => {
            allAnime.push(...yearAnime.filter((anime) => anime.isWatched));
          });
          return allAnime;
        },

        getUnwatchedAnime: () => {
          const state = get();
          const allAnime: Anime[] = [];
          Object.values(state.animeList).forEach((yearAnime) => {
            allAnime.push(...yearAnime.filter((anime) => !anime.isWatched));
          });
          return allAnime;
        },

        getRankedCount: () => {
          const state = get();
          return state.rankedAnimeList.length;
        },

        getWatchListCount: () => {
          const state = get();
          return state.watchAnimeList.length;
        },
      })),
      {
        name: 'anime-store',
        partialize: (state) => ({
          animeList: state.animeList,
          rankedAnimeList: state.rankedAnimeList,
          watchAnimeList: state.watchAnimeList,
          seasonYears: state.seasonYears,
        }),
      }
    ),
    {
      name: 'anime-store',
    }
  )
);

// Helper function to get anime by ID
const getAnimeById = (id: number): Anime | null => {
  const state = useAnimeStore.getState();
  for (const yearAnime of Object.values(state.animeList)) {
    const anime = yearAnime.find((a) => a.id === id);
    if (anime) return anime;
  }
  return null;
};
```

## Hook Integration

### Custom Hooks for Zustand

```typescript
// src/hooks/usePreview/useZustandPreview.tsx
import { useAnimeStore } from '@/zustand-store/AnimeStore';

export const useZustandPreview = () => {
  const selectedAnime = useAnimeStore((state) => state.selectedAnime);
  const setSelectedAnime = useAnimeStore((state) => state.setSelectedAnime);
  const clearSelection = useAnimeStore((state) => state.clearSelection);

  const selectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  return {
    selectedAnime,
    selectAnime,
    clearSelection,
    setSelectedAnime,
  };
};

// Anime list management hook
export const useZustandAnimeList = () => {
  const animeList = useAnimeStore((state) => state.animeList);
  const setAnimeList = useAnimeStore((state) => state.setAnimeList);
  const getAnimeByYear = useAnimeStore((state) => state.getAnimeByYear);
  const updateAnime = useAnimeStore((state) => state.updateAnime);

  return {
    animeList,
    setAnimeList,
    getAnimeByYear,
    updateAnime,
  };
};

// Ranked list hook
export const useZustandRankedList = () => {
  const rankedAnimeList = useAnimeStore((state) => state.rankedAnimeList);
  const setRankedAnimeList = useAnimeStore((state) => state.setRankedAnimeList);
  const rankAnime = useAnimeStore((state) => state.rankAnime);
  const getRankedCount = useAnimeStore((state) => state.getRankedCount);

  return {
    rankedAnimeList,
    setRankedAnimeList,
    rankAnime,
    getRankedCount,
  };
};

// Watch list hook
export const useZustandWatchList = () => {
  const watchAnimeList = useAnimeStore((state) => state.watchAnimeList);
  const addAnimeToWatchList = useAnimeStore((state) => state.addAnimeToWatchList);
  const removeAnimeFromWatchList = useAnimeStore((state) => state.removeAnimeFromWatchList);
  const getWatchListCount = useAnimeStore((state) => state.getWatchListCount);

  return {
    watchAnimeList,
    addAnimeToWatchList,
    removeAnimeFromWatchList,
    getWatchListCount,
  };
};
```

## Component Usage

### Using Zustand in Components

```typescript
import React from 'react';
import { useAnimeStore } from '@/zustand-store/AnimeStore';

const AnimeListComponent: React.FC = () => {
  // Selective subscriptions - only re-render when these specific values change
  const animeList = useAnimeStore((state) => state.animeList);
  const seasonYears = useAnimeStore((state) => state.seasonYears);
  const loading = useAnimeStore((state) => state.loading);
  
  // Actions
  const setSelectedAnime = useAnimeStore((state) => state.setSelectedAnime);
  const updateAnime = useAnimeStore((state) => state.updateAnime);

  const handleAnimeClick = (anime: Anime) => {
    setSelectedAnime(anime);
  };

  const handleRateAnime = (animeId: number, stars: number) => {
    updateAnime(animeId, { stars });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {seasonYears.map((year) => (
        <div key={year}>
          <h3>{year}</h3>
          {animeList[year.toString()]?.map((anime) => (
            <div key={anime.id} onClick={() => handleAnimeClick(anime)}>
              <h4>{anime.attributes.titles.en}</h4>
              <button onClick={() => handleRateAnime(anime.id, 5)}>
                Rate 5 Stars
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### Optimised Component with Selectors

```typescript
// Custom selector for better performance
const selectAnimeByYear = (year: number) => (state: AnimeStore) => 
  state.animeList[year.toString()] || [];

const AnimeYearComponent: React.FC<{ year: number }> = ({ year }) => {
  // Only re-render when anime for this specific year changes
  const animeForYear = useAnimeStore(selectAnimeByYear(year));
  const updateAnime = useAnimeStore((state) => state.updateAnime);

  return (
    <div>
      <h3>{year}</h3>
      {animeForYear.map((anime) => (
        <AnimeCard 
          key={anime.id} 
          anime={anime} 
          onUpdate={(updates) => updateAnime(anime.id, updates)}
        />
      ))}
    </div>
  );
};
```

## Advanced Patterns

### Store Slicing

```typescript
// Create focused slices of the store
export const usePreviewSlice = () => 
  useAnimeStore((state) => ({
    selectedAnime: state.selectedAnime,
    setSelectedAnime: state.setSelectedAnime,
    clearSelection: state.clearSelection,
  }));

export const useLoadingSlice = () =>
  useAnimeStore((state) => ({
    loading: state.loading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError,
  }));
```

### Computed Selectors

```typescript
// Memoised selectors for computed values
import { useMemo } from 'react';

export const useAnimeStats = () => {
  const stats = useAnimeStore((state) => ({
    totalAnime: Object.values(state.animeList).flat().length,
    watchedCount: state.getWatchedAnime().length,
    unwatchedCount: state.getUnwatchedAnime().length,
    rankedCount: state.getRankedCount(),
    watchListCount: state.getWatchListCount(),
  }));

  return useMemo(() => stats, [stats]);
};

// Filtered anime selector
export const useFilteredAnime = (filters: {
  year?: number;
  watched?: boolean;
  minRating?: number;
}) => {
  return useAnimeStore((state) => {
    let anime = filters.year 
      ? state.getAnimeByYear(filters.year)
      : Object.values(state.animeList).flat();

    if (filters.watched !== undefined) {
      anime = anime.filter((a) => a.isWatched === filters.watched);
    }

    if (filters.minRating) {
      anime = anime.filter((a) => a.stars >= filters.minRating!);
    }

    return anime;
  });
};
```

### Async Actions

```typescript
// Async actions with loading states
export const useAsyncAnimeActions = () => {
  const setLoading = useAnimeStore((state) => state.setLoading);
  const setError = useAnimeStore((state) => state.setError);
  const setAnimeList = useAnimeStore((state) => state.setAnimeList);
  const updateAnime = useAnimeStore((state) => state.updateAnime);

  const loadAnimeList = async (seasonYears: number[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const animeList = await getAnimeList(seasonYears);
      setAnimeList(animeList);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load anime');
    } finally {
      setLoading(false);
    }
  };

  const saveAnimeUpdate = async (animeId: number, updates: Partial<Anime>) => {
    try {
      setLoading(true);
      
      const updatedAnime = await upsertAnime({ id: animeId, ...updates } as Anime);
      if (updatedAnime?.[0]) {
        updateAnime(animeId, updatedAnime[0]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update anime');
    } finally {
      setLoading(false);
    }
  };

  return {
    loadAnimeList,
    saveAnimeUpdate,
  };
};
```

## Middleware Integration

### Persistence Middleware

```typescript
// Persist specific parts of the store
const persistConfig = {
  name: 'anime-store',
  partialize: (state: AnimeStore) => ({
    animeList: state.animeList,
    rankedAnimeList: state.rankedAnimeList,
    watchAnimeList: state.watchAnimeList,
    seasonYears: state.seasonYears,
  }),
  version: 1,
  migrate: (persistedState: any, version: number) => {
    // Handle store migrations
    if (version === 0) {
      // Migrate from version 0 to 1
      return {
        ...persistedState,
        // Add new fields or transform data
      };
    }
    return persistedState;
  },
};
```

### DevTools Integration

```typescript
// Enhanced devtools configuration
const devtoolsConfig = {
  name: 'anime-store',
  serialize: {
    options: {
      // Custom serialization for complex objects
      map: true,
      set: true,
    },
  },
  actionSanitizer: (action: any) => ({
    ...action,
    // Sanitise sensitive data in actions
  }),
  stateSanitizer: (state: any) => ({
    ...state,
    // Sanitise sensitive data in state
  }),
};
```

## Testing

### Store Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAnimeStore } from '@/zustand-store/AnimeStore';

describe('AnimeStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAnimeStore.setState({
      animeList: {},
      selectedAnime: null,
      rankedAnimeList: [],
      watchAnimeList: [],
      seasonYears: [],
      loading: false,
      error: null,
    });
  });

  it('should set selected anime', () => {
    const { result } = renderHook(() => useAnimeStore());
    
    act(() => {
      result.current.setSelectedAnime(mockAnime);
    });

    expect(result.current.selectedAnime).toEqual(mockAnime);
  });

  it('should update anime across all lists', () => {
    const { result } = renderHook(() => useAnimeStore());
    
    // Setup initial state
    act(() => {
      result.current.setAnimeList({ '2023': [mockAnime] });
      result.current.setSelectedAnime(mockAnime);
    });

    // Update anime
    act(() => {
      result.current.updateAnime(mockAnime.id, { stars: 5 });
    });

    expect(result.current.selectedAnime?.stars).toBe(5);
    expect(result.current.animeList['2023'][0].stars).toBe(5);
  });
});
```

### Component Testing with Zustand

```typescript
import { render, screen } from '@testing-library/react';
import { useAnimeStore } from '@/zustand-store/AnimeStore';
import AnimeComponent from './AnimeComponent';

// Mock the store
jest.mock('@/zustand-store/AnimeStore');

describe('AnimeComponent', () => {
  const mockStore = {
    animeList: { '2023': [mockAnime] },
    selectedAnime: null,
    setSelectedAnime: jest.fn(),
    updateAnime: jest.fn(),
  };

  beforeEach(() => {
    (useAnimeStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('should render anime list', () => {
    render(<AnimeComponent />);
    
    expect(screen.getByText(mockAnime.attributes.titles.en)).toBeInTheDocument();
  });
});
```

## Performance Optimisation

### Selective Subscriptions

```typescript
// Only subscribe to specific parts of the store
const AnimeCard: React.FC<{ animeId: number }> = ({ animeId }) => {
  // Only re-render when this specific anime changes
  const anime = useAnimeStore((state) => 
    Object.values(state.animeList)
      .flat()
      .find((a) => a.id === animeId)
  );

  const updateAnime = useAnimeStore((state) => state.updateAnime);

  if (!anime) return null;

  return (
    <div>
      <h3>{anime.attributes.titles.en}</h3>
      <button onClick={() => updateAnime(animeId, { stars: 5 })}>
        Rate 5 Stars
      </button>
    </div>
  );
};
```

### Memoised Selectors

```typescript
import { shallow } from 'zustand/shallow';

// Use shallow comparison for object/array selections
const useAnimeListShallow = () => 
  useAnimeStore(
    (state) => ({
      animeList: state.animeList,
      seasonYears: state.seasonYears,
    }),
    shallow
  );
```

## Comparison with Other State Management

### Zustand vs React Context

**Zustand Advantages:**
- No providers needed
- Better performance with selective subscriptions
- Simpler API
- Built-in persistence
- Smaller bundle size

**React Context Advantages:**
- Built into React
- No additional dependencies
- More explicit data flow
- Better for component-scoped state

### Zustand vs XState

**Zustand Advantages:**
- Simpler API
- Less boilerplate
- More flexible structure
- Better performance for simple state

**XState Advantages:**
- Explicit state modeling
- Complex state logic handling
- Visual state representation
- Built-in side effect management

## Best Practices

1. **Selective Subscriptions**: Only subscribe to the state you need
2. **Store Slicing**: Create focused slices for different concerns
3. **Async Actions**: Handle loading and error states properly
4. **Persistence**: Only persist necessary data
5. **Testing**: Mock the store for component testing
6. **Performance**: Use shallow comparison for object selections
7. **TypeScript**: Leverage TypeScript for better developer experience

## Future Enhancements

- [ ] Add more sophisticated caching strategies
- [ ] Implement optimistic updates
- [ ] Add store composition patterns
- [ ] Create reusable store utilities
- [ ] Add performance monitoring
- [ ] Implement store synchronisation
- [ ] Add more middleware integrations
- [ ] Create store testing utilities
