import { create } from 'zustand';

type State = {
  focusAnimeId: number | undefined,
  seasonYears: number[],
}

type Actions = {
  setFocusAnimeId: (id: number) => void
  setSeasonYears: (year: number) => void
}

const useAnimeStore = create<State & Actions>((set) => ({
  focusAnimeId: 0,
  seasonYears: [],
  setFocusAnimeId: (id: number) => set(() => ({ focusAnimeId: id })),
  setSeasonYears: (year: number) => set((state) => ({ seasonYears: [...state.seasonYears, year] })),
}))

export default useAnimeStore;