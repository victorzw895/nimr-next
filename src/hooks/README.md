# Hooks

Custom React hooks that provide reusable functionality across the application and work with multiple state management approaches.

## Hooks

### `useSeasons.tsx`
Manages seasonal anime data and pagination with Kitsu API integration.

### `useAnime/index.tsx`
Provides anime management functionality.

### `usePreview/index.tsx`
Adapts to the current state management approach (Context/XState/Zustand) for anime preview functionality.

### `usePreview/usePreviewContext.tsx`
React Context-specific preview hook implementation.

### `usePreview/usePreviewMachine.tsx`
XState machine-specific preview hook implementation.

## Usage

```tsx
import useSeasons from '@/hooks/useSeasons';
import { useSelectedAnime } from '@/hooks/usePreview';

const { latestYear, getMoreAnime } = useSeasons();
const { selectedAnime, setSelectedAnime } = useSelectedAnime();
```

## State Management Integration

The hooks adapt to different state management approaches:

### React Context (Default)
```tsx
const { selectedAnime, setSelectedAnime } = useSelectedAnime();
```

### XState Machine
```tsx
const { selectedAnime, selectAnime, state } = useSelectedAnime();
```

### Zustand Store
```tsx
const { selectedAnime, selectAnime } = useSelectedAnime();
```
