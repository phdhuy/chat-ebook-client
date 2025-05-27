import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

const NORMAL_SIZE = 290;
const COLLAPSED_SIZE = 50;

interface CollapseState {
  isCollapsed: boolean;
  width: number;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
  setWidth: (value: number) => void;
}

const collapseStoreCreator: StateCreator<
  CollapseState,
  [],
  [["zustand/persist", CollapseState]]
> = (set) => ({
  isCollapsed: false,
  width: NORMAL_SIZE,
  toggle: () =>
    set((state) => {
      const next = !state.isCollapsed;
      return {
        isCollapsed: next,
        width: next ? COLLAPSED_SIZE : NORMAL_SIZE,
      };
    }),
  setCollapsed: (value: boolean) =>
    set({
      isCollapsed: value,
      width: value ? COLLAPSED_SIZE : NORMAL_SIZE,
    }),
  setWidth: (value: number) => set({ width: value }),
});

const useCollapseStore = create<CollapseState>()(
  persist(collapseStoreCreator, {
    name: "collapse-storage",
  })
);

export default useCollapseStore;