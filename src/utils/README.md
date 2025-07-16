# Utils

This directory contains utility components and helper functions for the NIMR-Next application.

## Files

### `LazyScroll.tsx`
Utility component for implementing lazy loading and infinite scrolling functionality.

**Features:**
- Intersection Observer API integration
- Lazy loading trigger
- Scroll position management

### `Sortable.tsx`
Utility component for drag-and-drop sorting functionality using @dnd-kit.

**Features:**
- Drag-and-drop interface
- Sortable list management
- Touch and keyboard support

## Usage

```tsx
import LazyScroll from '@/utils/LazyScroll';
import Sortable from '@/utils/Sortable';

// Lazy scrolling
<LazyScroll onIntersect={loadMoreData}>
  <div>Content to lazy load</div>
</LazyScroll>

// Sortable list
<Sortable items={animeList} onReorder={handleReorder}>
  {(item) => <AnimeCard anime={item} />}
</Sortable>
