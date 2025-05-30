import { create } from "zustand";

interface ReferencePageState {
  page: number;
  setReferencePage: (page: number) => void;
  clearReferencePage: () => void;
}

export const useReferencePageStore = create<ReferencePageState>((set) => ({
  page: 0,
  setReferencePage: (page: number) => set({ page }),
  clearReferencePage: () => set({ page: 0 }),
}));