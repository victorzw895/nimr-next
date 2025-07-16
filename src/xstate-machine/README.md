# XState Machine

This directory contains XState machine implementations for managing complex state logic in the NIMR-Next application. XState provides declarative state management with explicit state transitions and side effect handling.

## Files Overview

### `PreviewMachine.tsx`
XState machine implementation for managing anime preview functionality.

**Features:**
- Declarative state transitions
- Side effect management
- Error handling
- Integration with React components
- Alternative to React Context for preview state

## XState Integration

### Why XState?

XState is used as an alternative state management approach to demonstrate:
- **Explicit State Modeling**: Clear definition of possible states and transitions
- **Predictable Behavior**: State transitions are explicit and predictable
- **Side Effect Management**: Services and actions handle side effects cleanly
- **Visual State Charts**: State machines can be visualised and debugged
- **Complex Logic**: Better handling of complex state logic than traditional approaches

### When XState is Active

XState machine is used when the environment variable `NEXT_PUBLIC_XSTATE=true` is set:

```bash
# Enable XState machine
NEXT_PUBLIC_XSTATE=true npm run dev

# Or use the dedicated script
npm run dev-xstate
```

## PreviewMachine Implementation

### Machine States

The preview machine manages the following states:

```typescript
type PreviewState = 
  | 'idle'           // No anime selected
  | 'loading'        // Loading anime details
  | 'loaded'         // Anime details loaded successfully
  | 'error'          // Error loading anime details
  | 'updating'       // Updating anime data
```

### Machine Context

```typescript
interface PreviewMachineContext {
  selectedAnime: Anime | null;
  error: string | null;
  isLoading: boolean;
}
```

### Machine Events

```typescript
type PreviewMachineEvent = 
  | { type: 'SELECT_ANIME'; anime: Anime }
  | { type: 'LOAD_DETAILS'; animeId: number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'UPDATE_ANIME'; updates: Partial<Anime> }
  | { type: 'RETRY' }
  | { type: 'SUCCESS'; data: Anime }
  | { type: 'FAILURE'; error: string };
```

### Machine Configuration

```typescript
import { createMachine, assign } from 'xstate';

export const previewMachine = createMachine<
  PreviewMachineContext,
  PreviewMachineEvent
>({
  id: 'preview',
  initial: 'idle',
  context: {
    selectedAnime: null,
    error: null,
    isLoading: false,
  },
  states: {
    idle: {
      on: {
        SELECT_ANIME: {
          target: 'loaded',
          actions: assign({
            selectedAnime: (_, event) => event.anime,
            error: null,
          }),
        },
        LOAD_DETAILS: {
          target: 'loading',
          actions: assign({
            isLoading: true,
            error: null,
          }),
        },
      },
    },
    loading: {
      invoke: {
        id: 'loadAnimeDetails',
        src: 'loadAnimeDetails',
        onDone: {
          target: 'loaded',
          actions: assign({
            selectedAnime: (_, event) => event.data,
            isLoading: false,
            error: null,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message,
            isLoading: false,
          }),
        },
      },
      on: {
        CLEAR_SELECTION: {
          target: 'idle',
          actions: assign({
            selectedAnime: null,
            isLoading: false,
            error: null,
          }),
        },
      },
    },
    loaded: {
      on: {
        SELECT_ANIME: {
          target: 'loaded',
          actions: assign({
            selectedAnime: (_, event) => event.anime,
            error: null,
          }),
        },
        UPDATE_ANIME: {
          target: 'updating',
          actions: assign({
            isLoading: true,
          }),
        },
        CLEAR_SELECTION: {
          target: 'idle',
          actions: assign({
            selectedAnime: null,
            error: null,
          }),
        },
        LOAD_DETAILS: {
          target: 'loading',
          actions: assign({
            isLoading: true,
            error: null,
          }),
        },
      },
    },
    updating: {
      invoke: {
        id: 'updateAnime',
        src: 'updateAnime',
        onDone: {
          target: 'loaded',
          actions: assign({
            selectedAnime: (_, event) => event.data,
            isLoading: false,
            error: null,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (_, event) => event.data.message,
            isLoading: false,
          }),
        },
      },
      on: {
        CLEAR_SELECTION: {
          target: 'idle',
          actions: assign({
            selectedAnime: null,
            isLoading: false,
            error: null,
          }),
        },
      },
    },
    error: {
      on: {
        RETRY: [
          {
            target: 'loading',
            cond: 'hasAnimeToLoad',
            actions: assign({
              isLoading: true,
              error: null,
            }),
          },
          {
            target: 'idle',
            actions: assign({
              selectedAnime: null,
              error: null,
            }),
          },
        ],
        CLEAR_SELECTION: {
          target: 'idle',
          actions: assign({
            selectedAnime: null,
            error: null,
          }),
        },
        SELECT_ANIME: {
          target: 'loaded',
          actions: assign({
            selectedAnime: (_, event) => event.anime,
            error: null,
          }),
        },
      },
    },
  },
});
```

### Machine Services

Services handle side effects and asynchronous operations:

```typescript
import { interpret } from 'xstate';
import { getAnimeById, upsertAnime } from '@/lib/api';

const previewMachineWithServices = previewMachine.withConfig({
  services: {
    loadAnimeDetails: async (context, event) => {
      if (event.type === 'LOAD_DETAILS') {
        const anime = await getAnimeById(event.animeId);
        return anime;
      }
      throw new Error('Invalid event for loadAnimeDetails service');
    },
    updateAnime: async (context, event) => {
      if (event.type === 'UPDATE_ANIME' && context.selectedAnime) {
        const updatedAnime = { ...context.selectedAnime, ...event.updates };
        const result = await upsertAnime(updatedAnime);
        return result?.[0] || updatedAnime;
      }
      throw new Error('Invalid event for updateAnime service');
    },
  },
  guards: {
    hasAnimeToLoad: (context) => context.selectedAnime !== null,
  },
});
```

## React Integration

### PreviewProvider Component

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { useActor } from '@xstate/react';
import { previewMachineWithServices } from './PreviewMachine';

interface PreviewProviderProps {
  children: ReactNode;
}

const PreviewMachineContext = createContext<any>(null);

export const PreviewProvider: React.FC<PreviewProviderProps> = ({ children }) => {
  const [state, send] = useActor(previewMachineWithServices);

  return (
    <PreviewMachineContext.Provider value={{ state, send }}>
      {children}
    </PreviewMachineContext.Provider>
  );
};

export const usePreviewMachine = () => {
  const context = useContext(PreviewMachineContext);
  if (!context) {
    throw new Error('usePreviewMachine must be used within PreviewProvider');
  }
  return context;
};
```

### Hook Integration

```typescript
// src/hooks/usePreview/usePreviewMachine.tsx
import { usePreviewMachine } from '@/xstate-machine/PreviewMachine';

export const usePreviewMachineHook = () => {
  const { state, send } = usePreviewMachine();

  const selectedAnime = state.context.selectedAnime;
  const isLoading = state.context.isLoading;
  const error = state.context.error;
  const currentState = state.value;

  const selectAnime = (anime: Anime) => {
    send({ type: 'SELECT_ANIME', anime });
  };

  const loadAnimeDetails = (animeId: number) => {
    send({ type: 'LOAD_DETAILS', animeId });
  };

  const updateAnime = (updates: Partial<Anime>) => {
    send({ type: 'UPDATE_ANIME', updates });
  };

  const clearSelection = () => {
    send({ type: 'CLEAR_SELECTION' });
  };

  const retry = () => {
    send({ type: 'RETRY' });
  };

  return {
    // State
    selectedAnime,
    isLoading,
    error,
    currentState,
    
    // Actions
    selectAnime,
    loadAnimeDetails,
    updateAnime,
    clearSelection,
    retry,
    
    // Raw machine access
    state,
    send,
  };
};
```

## Component Usage

### Using XState in Components

```typescript
import React from 'react';
import { usePreviewMachineHook } from '@/hooks/usePreview/usePreviewMachine';

const PreviewComponent: React.FC = () => {
  const {
    selectedAnime,
    isLoading,
    error,
    currentState,
    selectAnime,
    updateAnime,
    clearSelection,
    retry,
  } = usePreviewMachineHook();

  if (currentState === 'idle') {
    return <div>No anime selected</div>;
  }

  if (currentState === 'loading') {
    return <div>Loading anime details...</div>;
  }

  if (currentState === 'error') {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={retry}>Retry</button>
        <button onClick={clearSelection}>Clear</button>
      </div>
    );
  }

  if (selectedAnime) {
    return (
      <div>
        <h2>{selectedAnime.attributes.titles.en}</h2>
        <p>{selectedAnime.attributes.synopsis}</p>
        
        {currentState === 'updating' && <p>Updating...</p>}
        
        <button 
          onClick={() => updateAnime({ stars: 5 })}
          disabled={isLoading}
        >
          Rate 5 Stars
        </button>
        
        <button onClick={clearSelection}>
          Clear Selection
        </button>
      </div>
    );
  }

  return null;
};
```

### State-Based Rendering

```typescript
const StateBasedPreview: React.FC = () => {
  const { state, send } = usePreviewMachine();

  return (
    <div>
      {state.matches('idle') && (
        <div>Select an anime to preview</div>
      )}
      
      {state.matches('loading') && (
        <div className="loading">
          <span>Loading...</span>
          <button onClick={() => send('CLEAR_SELECTION')}>
            Cancel
          </button>
        </div>
      )}
      
      {state.matches('loaded') && state.context.selectedAnime && (
        <div className="preview">
          <AnimeDetails anime={state.context.selectedAnime} />
          <button onClick={() => send('CLEAR_SELECTION')}>
            Close Preview
          </button>
        </div>
      )}
      
      {state.matches('error') && (
        <div className="error">
          <p>Failed to load anime: {state.context.error}</p>
          <button onClick={() => send('RETRY')}>
            Try Again
          </button>
        </div>
      )}
      
      {state.matches('updating') && (
        <div className="updating">
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
};
```

## Advanced Features

### Machine Composition

```typescript
// Compose multiple machines
import { spawn } from 'xstate';

const appMachine = createMachine({
  context: {
    previewMachine: null,
    // other app state
  },
  states: {
    initializing: {
      entry: assign({
        previewMachine: () => spawn(previewMachine),
      }),
      always: 'ready',
    },
    ready: {
      // App is ready with preview machine spawned
    },
  },
});
```

### Machine Testing

```typescript
import { interpret } from 'xstate';
import { previewMachine } from './PreviewMachine';

describe('PreviewMachine', () => {
  it('should transition from idle to loaded when anime is selected', () => {
    const service = interpret(previewMachine);
    service.start();

    expect(service.state.value).toBe('idle');

    service.send({ type: 'SELECT_ANIME', anime: mockAnime });

    expect(service.state.value).toBe('loaded');
    expect(service.state.context.selectedAnime).toEqual(mockAnime);

    service.stop();
  });

  it('should handle loading state correctly', async () => {
    const service = interpret(previewMachineWithServices);
    service.start();

    service.send({ type: 'LOAD_DETAILS', animeId: 123 });

    expect(service.state.value).toBe('loading');
    expect(service.state.context.isLoading).toBe(true);

    // Wait for service to complete
    await new Promise(resolve => {
      service.onTransition(state => {
        if (state.matches('loaded')) {
          resolve(state);
        }
      });
    });

    expect(service.state.value).toBe('loaded');
    expect(service.state.context.isLoading).toBe(false);

    service.stop();
  });
});
```

## Debugging and Visualization

### XState Inspector

```typescript
import { inspect } from '@xstate/inspect';

// Enable inspector in development
if (process.env.NODE_ENV === 'development') {
  inspect({
    url: 'https://stately.ai/viz?inspect',
    iframe: false,
  });
}

// Create machine with inspector
const service = interpret(previewMachine, { devTools: true });
```

### State Logging

```typescript
const previewMachineWithLogging = previewMachine.withConfig({
  actions: {
    logTransition: (context, event) => {
      console.log('State transition:', {
        event: event.type,
        context,
        timestamp: new Date().toISOString(),
      });
    },
  },
});
```

## Comparison with Other State Management

### XState vs React Context

**XState Advantages:**
- Explicit state modeling
- Built-in side effect management
- Predictable state transitions
- Visual debugging tools
- Better handling of complex logic

**React Context Advantages:**
- Simpler for basic state
- Less learning curve
- Smaller bundle size
- Direct React integration

### XState vs Zustand

**XState Advantages:**
- State machine modeling
- Complex state logic handling
- Built-in services and guards
- Visual state representation

**Zustand Advantages:**
- Simpler API
- Smaller bundle size
- Less boilerplate
- More flexible structure

## Best Practices

1. **State Modeling**: Model states explicitly and exhaustively
2. **Side Effects**: Use services for all side effects
3. **Guards**: Use guards for conditional transitions
4. **Actions**: Keep actions pure and focused
5. **Testing**: Test state transitions and services separately
6. **Debugging**: Use XState inspector for development
7. **Documentation**: Document complex state logic clearly

## Performance Considerations

### Machine Optimization

```typescript
// Memoize machine creation
const memoizedMachine = useMemo(() => 
  previewMachine.withConfig(machineConfig), 
  []
);

// Use machine with React.memo
const PreviewComponent = React.memo(() => {
  const { state, send } = useActor(memoizedMachine);
  // Component logic
});
```

### Selective State Subscription

```typescript
// Subscribe to specific state parts
const usePreviewState = () => {
  const { state } = usePreviewMachine();
  
  return useMemo(() => ({
    isLoading: state.context.isLoading,
    hasError: state.matches('error'),
    selectedAnime: state.context.selectedAnime,
  }), [state]);
};
```

## Future Enhancements

- [ ] Add more complex state machines for other features
- [ ] Implement machine composition patterns
- [ ] Add state persistence capabilities
- [ ] Create machine testing utilities
- [ ] Add performance monitoring
- [ ] Implement state machine visualization
- [ ] Add machine-to-machine communication
- [ ] Create reusable machine patterns
