type Entry = { label: string; text: string; classes: string };

const ENTRIES: Entry[] = [
  {
    label: "K",
    text: "Kappa",
    classes: "bg-amber-500/25 text-amber-100 ring-amber-400/60",
  },
  {
    label: "H",
    text: "Hideout",
    classes: "bg-sky-500/25 text-sky-100 ring-sky-400/60",
  },
  {
    label: "LK",
    text: "Lightkeeper",
    classes: "bg-cyan-500/25 text-cyan-100 ring-cyan-400/60",
  },
  {
    label: "P1–P6",
    text: "Prestige 1–6",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
  {
    label: "FIR",
    text: "FIR in every scope",
    classes: "bg-emerald-500/25 text-emerald-100 ring-emerald-400/60",
  },
  {
    label: "FIR*",
    text: "FIR in some scopes",
    classes: "bg-emerald-500/25 text-emerald-100 ring-emerald-400/60",
  },
  {
    label: "Any of",
    text: "Objective accepts any of several items",
    classes: "bg-amber-500/25 text-amber-100 ring-amber-400/60",
  },
  {
    label: "Quest",
    text: "Raid-only quest item",
    classes: "bg-violet-500/25 text-violet-100 ring-violet-400/60",
  },
];

export function AllLegend() {
  return (
    <ul
      role="note"
      aria-label="Chip legend"
      className="flex flex-col gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1.5"
    >
      {ENTRIES.map((e) => (
        <li key={e.label} className="flex items-center gap-1.5">
          <span
            className={`inline-flex min-w-[2.75rem] justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${e.classes}`}
          >
            {e.label}
          </span>
          <span>{e.text}</span>
        </li>
      ))}
    </ul>
  );
}
