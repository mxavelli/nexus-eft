import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Objective, PrestigeLevel } from "@/lib/types";

type PreferencesState = {
  objective: Objective;
  prestigeLevel: PrestigeLevel;
  firOnly: boolean;
  includeQuestItems: boolean;
  allSearch: string;
  setObjective: (o: Objective) => void;
  setPrestigeLevel: (n: PrestigeLevel) => void;
  toggleFirOnly: () => void;
  toggleIncludeQuestItems: () => void;
  setAllSearch: (q: string) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      objective: "kappa",
      prestigeLevel: 1,
      firOnly: false,
      includeQuestItems: true,
      allSearch: "",
      setObjective: (o) => set({ objective: o }),
      setPrestigeLevel: (n) => set({ prestigeLevel: n }),
      toggleFirOnly: () => set((s) => ({ firOnly: !s.firOnly })),
      toggleIncludeQuestItems: () =>
        set((s) => ({ includeQuestItems: !s.includeQuestItems })),
      setAllSearch: (q) => set({ allSearch: q }),
    }),
    {
      name: "nexus-eft-prefs-v1",
      version: 1,
      partialize: (state) => ({
        objective: state.objective,
        prestigeLevel: state.prestigeLevel,
        firOnly: state.firOnly,
        includeQuestItems: state.includeQuestItems,
      }),
    },
  ),
);
