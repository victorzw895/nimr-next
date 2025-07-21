# Context

This directory contains React Context providers for application state management using the Context API pattern.

## Context Providers

### `AppContext.tsx`
Global application context managing focused anime ID and available season years.

### `AnimeListContext.tsx`
Manages the main anime list data organised by year with CRUD operations.

### `RankedListContext.tsx`
Manages user's ranked anime list for watched anime with ranking functionality.

### `WatchListContext.tsx`
Manages anime marked for watching with watch list operations.

### `PreviewContext.tsx`
Manages anime preview state and selection for the preview component.

## Usage

Each context provides a custom hook for accessing state and actions:

```tsx
import { useAppDispatch } from '@/context/AppContext';
import { useAnimeListDispatch } from '@/context/AnimeListContext';

const { seasonYears } = useAppDispatch();
const { animeList, setAnimeList } = useAnimeListDispatch();
```

## Provider Hierarchy

The contexts are nested in a specific hierarchy:

```tsx
<AppProvider>
  <AnimeListProvider>
    <RankedListProvider>
      <WatchListProvider>
        <PreviewProvider>
          {children}
        </PreviewProvider>
      </WatchListProvider>
    </RankedListProvider>
  </AnimeListProvider>
</AppProvider>
