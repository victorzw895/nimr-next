# NIMR-Next

A personal anime tracking and state management playground application built with Next.js.

## Overview

NIMR-Next serves dual purposes:
1. **Personal Anime Management**: Track watched anime, mark favourites, and organise anime by seasons from yearly releases
2. **Development Playground**: Experiment with and compare different state management libraries (React Context, XState, Zustand) in isolation

## Features

### Anime Management
- 📺 **Multiple List Views**: All anime, ranked list, watch list, and interest list
- ⭐ **Rating System**: Star-based rating for watched anime
- 🏆 **Custom Rankings**: Drag-and-drop ranking system for watched anime
- 📅 **Seasonal Organisation**: Anime organised by release year with collapsible sections
- 🔍 **Preview System**: Detailed anime preview with contextual information
- ♾️ **Infinite Scrolling**: Efficient loading of large anime datasets

### State Management Playground
- 🔄 **React Context API**: Default state management approach
- 🤖 **XState Machine**: State machine implementation for complex preview logic
- 🐻 **Zustand Store**: Lightweight state management alternative
- 🔀 **Configurable**: Switch between state management approaches via environment variables

## Technology Stack

### Core Framework
- **Next.js 13.3.2** - React framework with SSG/SSR
- **TypeScript 5.0.2** - Type safety throughout
- **React 18.2.0** - UI library

### Styling & UI
- **Tailwind CSS 3.2.7** - Utility-first CSS framework
- **DaisyUI 2.51.5** - Component library
- **React Icons** - Icon library
- **Custom Colour Scheme** - Teal-based design system

### State Management
- **React Context API** - Built-in React state management
- **XState 4.37.2** - State machines and statecharts
- **Zustand 4.3.8** - Lightweight state management

### Data & API
- **Kitsu API** - External anime data source
- **Supabase** - Backend-as-a-Service (being phased out)
- **Local JSON** - Future simple storage solution

### UI/UX Libraries
- **@dnd-kit** - Drag and drop functionality
- **React Infinite Scroll** - Infinite scrolling implementation
- **Moment.js** - Date manipulation

### Development Tools
- **Storybook 7.0.18** - Component development and documentation
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/victorzw895/nimr-next.git
cd nimr-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables (optional):
```bash
# Create .env.local file
NEXT_PUBLIC_ANIME_API=https://kitsu.io/api/edge/anime
NEXT_PUBLIC_XSTATE=false
NEXT_PUBLIC_ZUSTAND=false
```

### Development

#### Run with React Context (Default)
```bash
npm run dev
```

#### Run with XState Machine
```bash
npm run dev-xstate
# or
NEXT_PUBLIC_XSTATE=true npm run dev
```

#### Run with Zustand Store
```bash
NEXT_PUBLIC_ZUSTAND=true npm run dev
```

#### Storybook Development
```bash
npm run storybook
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
Open [http://localhost:6006](http://localhost:6006) to view Storybook.

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Project Structure

```
nimr-next/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AllList.tsx    # Main anime list with filters
│   │   ├── Card.tsx       # Anime card component
│   │   ├── InterestList.tsx # Interest tracking list
│   │   ├── List.tsx       # Reusable list component
│   │   ├── Preview.tsx    # Anime preview component
│   │   ├── RankedList.tsx # Ranked anime list
│   │   └── WatchList.tsx  # Watch list component
│   ├── context/           # React Context providers
│   │   ├── AnimeListContext.tsx
│   │   ├── AppContext.tsx
│   │   ├── PreviewContext.tsx
│   │   ├── RankedListContext.tsx
│   │   └── WatchListContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useSeasons.tsx
│   │   ├── useAnime/      # Anime-related hooks
│   │   └── usePreview/    # Preview-related hooks
│   ├── layout/            # Layout components
│   ├── lib/               # API utilities and clients
│   │   ├── api.tsx        # API functions
│   │   └── supabaseClient.tsx
│   ├── pages/             # Next.js pages
│   │   ├── _app.tsx       # App configuration
│   │   ├── _document.tsx  # Document configuration
│   │   ├── index.tsx      # Home page
│   │   └── api/           # API routes
│   ├── providers/         # State management providers
│   │   ├── ReactContextProvider.tsx
│   │   └── XStateProvider.tsx
│   ├── stories/           # Storybook stories
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── xstate-machine/    # XState implementation
│   └── zustand-store/     # Zustand implementation
├── .eslintrc.json         # ESLint configuration
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## State Management Approaches

### React Context API (Default)
The default state management approach using React's built-in Context API with multiple providers:
- `AppContext` - Global application state
- `AnimeListContext` - Anime list management
- `RankedListContext` - Ranked anime management
- `WatchListContext` - Watch list management
- `PreviewContext` - Preview state management

### XState Machine
State machine implementation for complex state logic, particularly for the preview system:
- Declarative state transitions
- Predictable state management
- Visual state machine representation

### Zustand Store
Lightweight state management with minimal boilerplate:
- Simple API
- TypeScript support
- Minimal re-renders

## API Integration

### Kitsu API
The application integrates with the [Kitsu API](https://kitsu.docs.apiary.io/) to fetch anime data:
- Seasonal anime data
- Anime metadata and images
- Search functionality

### Data Storage Evolution
- **Current**: Supabase for cloud storage (being phased out)
- **Future**: Local JSON file for simplicity and offline capability

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ANIME_API` | Kitsu API endpoint | `https://kitsu.io/api/edge/anime` |
| `NEXT_PUBLIC_XSTATE` | Enable XState machine | `false` |
| `NEXT_PUBLIC_ZUSTAND` | Enable Zustand store | `false` |

## Development Workflow

1. **Component Development**: Use Storybook for isolated component development
2. **State Management Testing**: Switch between different state management approaches
3. **API Integration**: Test with Kitsu API or local dummy data
4. **Styling**: Tailwind CSS with custom colour scheme and DaisyUI components

## Contributing

This is a personal project primarily for learning and experimentation. However, suggestions and improvements are welcome!

## Future Considerations

- [ ] Implement local JSON storage for anime tracking
- [ ] Remove Supabase dependency
- [ ] Add more state management libraries for comparison
- [ ] Implement offline functionality
- [ ] Add anime recommendation features
- [ ] Improve mobile responsiveness

## License

This project is for personal use and learning purposes.

---

**Note**: This application serves as both a functional anime tracker and a playground for experimenting with different React state management patterns. Each state management approach is maintained separately to allow for independent testing and comparison.
