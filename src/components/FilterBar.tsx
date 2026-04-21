import { usePreferencesStore } from "@/store/preferencesStore";
import { PRESTIGE_LEVELS, type PrestigeLevel } from "@/lib/types";

export function FilterBar() {
  const objective = usePreferencesStore((s) => s.objective);
  const prestigeLevel = usePreferencesStore((s) => s.prestigeLevel);
  const firOnly = usePreferencesStore((s) => s.firOnly);
  const includeQuestItems = usePreferencesStore((s) => s.includeQuestItems);
  const search = usePreferencesStore((s) => s.search);
  const setPrestigeLevel = usePreferencesStore((s) => s.setPrestigeLevel);
  const toggleFirOnly = usePreferencesStore((s) => s.toggleFirOnly);
  const toggleIncludeQuestItems = usePreferencesStore(
    (s) => s.toggleIncludeQuestItems,
  );
  const setSearch = usePreferencesStore((s) => s.setSearch);

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <Toggle checked={firOnly} onChange={toggleFirOnly} label="FIR only" />
      <Toggle
        checked={includeQuestItems}
        onChange={toggleIncludeQuestItems}
        label="Show quest items"
      />

      {objective === "prestige" && (
        <label className="flex items-center gap-2 text-zinc-200">
          <span className="text-zinc-400">Level</span>
          <select
            value={prestigeLevel}
            onChange={(e) => setPrestigeLevel(Number(e.target.value) as PrestigeLevel)}
            aria-label="Prestige level"
            className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-zinc-50 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
          >
            {PRESTIGE_LEVELS.map((lv) => (
              <option key={lv} value={lv}>
                Prestige {lv}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="relative ml-auto flex items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search item name…"
          aria-label="Search items by name"
          className="h-7 w-56 rounded border border-zinc-600 bg-zinc-800 px-2 pr-7 text-zinc-50 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-1 flex h-5 w-5 items-center justify-center rounded text-zinc-300 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-500"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-zinc-200 hover:text-zinc-50">
      <span
        role="switch"
        aria-checked={checked}
        aria-label={label}
        tabIndex={0}
        onClick={onChange}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange();
          }
        }}
        className={
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 " +
          (checked
            ? "border-emerald-500 bg-emerald-500/40"
            : "border-zinc-600 bg-zinc-800")
        }
      >
        <span
          className={
            "inline-block h-3.5 w-3.5 transform rounded-full bg-zinc-100 transition-transform " +
            (checked ? "translate-x-4" : "translate-x-1")
          }
        />
      </span>
      <span onClick={onChange}>{label}</span>
    </label>
  );
}
