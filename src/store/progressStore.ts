import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_SCOPE_KEYS, type ScopeKey } from "@/lib/types";

type ProgressMap = Record<string, number>;

type ProgressState = {
  progress: Record<ScopeKey, ProgressMap>;
  setCount: (scope: ScopeKey, rowKey: string, value: number) => void;
  adjust: (scope: ScopeKey, rowKey: string, delta: number, max: number) => void;
  resetScope: (scope: ScopeKey) => void;
};

const emptyMap = (): ProgressMap => ({});

const emptyProgress = (): Record<ScopeKey, ProgressMap> => {
  const out = {} as Record<ScopeKey, ProgressMap>;
  for (const k of ALL_SCOPE_KEYS) out[k] = emptyMap();
  return out;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: emptyProgress(),
      setCount: (scope, rowKey, value) =>
        set((state) => {
          const next = { ...state.progress[scope] };
          if (value <= 0) {
            delete next[rowKey];
          } else {
            next[rowKey] = value;
          }
          return { progress: { ...state.progress, [scope]: next } };
        }),
      adjust: (scope, rowKey, delta, max) =>
        set((state) => {
          const current = state.progress[scope][rowKey] ?? 0;
          const clamped = Math.max(0, Math.min(max, current + delta));
          const next = { ...state.progress[scope] };
          if (clamped <= 0) {
            delete next[rowKey];
          } else {
            next[rowKey] = clamped;
          }
          return { progress: { ...state.progress, [scope]: next } };
        }),
      resetScope: (scope) =>
        set((state) => ({
          progress: { ...state.progress, [scope]: emptyMap() },
        })),
    }),
    {
      name: "nexus-eft-progress-v1",
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) {
          const old = (persisted as { progress?: Record<string, ProgressMap> })
            ?.progress ?? {};
          return {
            progress: {
              kappa: old.kappa ?? {},
              hideout: {},
              lightkeeper: old.lightkeeper ?? {},
              "prestige-1": {},
              "prestige-2": {},
              "prestige-3": {},
              "prestige-4": {},
              "prestige-5": {},
              "prestige-6": {},
            },
          };
        }
        return persisted as ProgressState;
      },
    },
  ),
);

export function useItemCount(scope: ScopeKey, rowKey: string): number {
  return useProgressStore((s) => s.progress[scope][rowKey] ?? 0);
}
