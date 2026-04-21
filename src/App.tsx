import { useMemo } from "react";
import { useTrackerData } from "@/hooks/useTrackerData";
import {
  aggregateForAll,
  aggregateForHideout,
  aggregateForKappa,
  aggregateForLightkeeper,
  aggregateForPrestigeLevel,
} from "@/lib/aggregate";
import type { AllRow, Objective, ScopeKey, TrackedItem } from "@/lib/types";
import { usePreferencesStore } from "@/store/preferencesStore";
import { ObjectiveSelector } from "@/components/ObjectiveSelector";
import { ItemList } from "@/components/ItemList";
import { ProgressSummary } from "@/components/ProgressSummary";
import { AllProgressSummary } from "@/components/AllProgressSummary";
import { ResetButton } from "@/components/ResetButton";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { FilterBar } from "@/components/FilterBar";
import { AllItemRow } from "@/components/AllItemRow";
import { AllLegend } from "@/components/AllLegend";
import { BackupControls } from "@/components/BackupControls";

function scopeForObjective(
  objective: Objective,
  prestigeLevel: number,
): ScopeKey | null {
  switch (objective) {
    case "kappa":
      return "kappa";
    case "hideout":
      return "hideout";
    case "lightkeeper":
      return "lightkeeper";
    case "prestige":
      return `prestige-${prestigeLevel}` as ScopeKey;
    case "all":
      return null;
  }
}

export default function App() {
  const objective = usePreferencesStore((s) => s.objective);
  const setObjective = usePreferencesStore((s) => s.setObjective);
  const prestigeLevel = usePreferencesStore((s) => s.prestigeLevel);
  const firOnly = usePreferencesStore((s) => s.firOnly);
  const includeQuestItems = usePreferencesStore((s) => s.includeQuestItems);
  const allSearch = usePreferencesStore((s) => s.allSearch);

  const { data, isPending, isError, error } = useTrackerData();

  const scope = scopeForObjective(objective, prestigeLevel);

  const scopedItems: TrackedItem[] = useMemo(() => {
    if (!data) return [];
    switch (objective) {
      case "kappa":
        return aggregateForKappa(data.tasks);
      case "hideout":
        return aggregateForHideout(data.hideoutStations);
      case "lightkeeper":
        return aggregateForLightkeeper(data.tasks);
      case "prestige":
        return aggregateForPrestigeLevel(data.prestige, prestigeLevel, data.tasks);
      case "all":
        return [];
    }
  }, [data, objective, prestigeLevel]);

  const allRows: AllRow[] = useMemo(() => {
    if (!data || objective !== "all") return [];
    return aggregateForAll(data.tasks, data.hideoutStations, data.prestige);
  }, [data, objective]);

  const filteredScoped = useMemo(
    () =>
      scopedItems.filter((it) => {
        if (firOnly && !it.fir) return false;
        if (!includeQuestItems && it.kind === "questItem") return false;
        return true;
      }),
    [scopedItems, firOnly, includeQuestItems],
  );

  const filteredAll = useMemo(() => {
    const needle = allSearch.trim().toLowerCase();
    return allRows.filter((it) => {
      if (firOnly && !it.hasFir) return false;
      if (!includeQuestItems && it.kind === "questItem") return false;
      if (needle && !it.displayName.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [allRows, firOnly, includeQuestItems, allSearch]);

  return (
    <main className="mx-auto flex h-full w-full flex-col gap-4 p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nexus EFT</h1>
          <p className="text-sm text-zinc-400">Objective item tracker</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ObjectiveSelector value={objective} onChange={setObjective} />
          <BackupControls />
        </div>
      </header>

      <FilterBar />

      {isError && (
        <p className="rounded-md border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
          Failed to load: {error instanceof Error ? error.message : "unknown error"}
        </p>
      )}

      {isPending && !isError && <LoadingSkeleton />}

      {data && objective === "all" && (
        <>
          <AllLegend />
          <div className="flex items-center justify-between gap-4">
            <AllProgressSummary rows={filteredAll} />
            <ResetButton objective={objective} scope={null} />
          </div>
          {filteredAll.length === 0 ? (
            <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-500">
              No items match the current filters.
            </p>
          ) : (
            <ul className="grid gap-1.5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
              {filteredAll.map((row) => (
                <AllItemRow key={row.groupKey} item={row} />
              ))}
            </ul>
          )}
        </>
      )}

      {data && scope && (
        <>
          <div className="flex items-center justify-between gap-4">
            <ProgressSummary scope={scope} items={filteredScoped} />
            <ResetButton objective={objective} scope={scope} />
          </div>
          <ItemList items={filteredScoped} scope={scope} />
        </>
      )}
    </main>
  );
}
