import { useState } from "react";
import type { AllRow, ScopeKey } from "@/lib/types";
import { scopeLabel } from "@/lib/types";
import { AllItemCounter } from "./AllItemCounter";
import { QuestSources } from "./QuestSources";

function uniqueScopes(item: AllRow): ScopeKey[] {
  const seen = new Set<ScopeKey>();
  const out: ScopeKey[] = [];
  for (const entry of item.breakdown) {
    if (!seen.has(entry.scope)) {
      seen.add(entry.scope);
      out.push(entry.scope);
    }
  }
  return out;
}

const SCOPE_CHIP: Record<ScopeKey, { short: string; classes: string }> = {
  kappa: {
    short: "K",
    classes: "bg-amber-500/25 text-amber-100 ring-amber-400/60",
  },
  hideout: {
    short: "H",
    classes: "bg-sky-500/25 text-sky-100 ring-sky-400/60",
  },
  lightkeeper: {
    short: "LK",
    classes: "bg-cyan-500/25 text-cyan-100 ring-cyan-400/60",
  },
  "prestige-1": {
    short: "P1",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
  "prestige-2": {
    short: "P2",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
  "prestige-3": {
    short: "P3",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
  "prestige-4": {
    short: "P4",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
  "prestige-5": {
    short: "P5",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
  "prestige-6": {
    short: "P6",
    classes: "bg-fuchsia-500/25 text-fuchsia-100 ring-fuchsia-400/60",
  },
};

type Props = {
  item: AllRow;
};

export function AllItemRow({ item }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="flex flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-sm shadow-black/40">
      <div className="flex flex-col gap-2 px-3 py-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`sources-${item.groupKey}`}
          aria-label={`${open ? "Collapse" : "Expand"} objectives for ${item.displayName}`}
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 items-start gap-2 rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          <span
            aria-hidden="true"
            className={`mt-1 shrink-0 text-zinc-500 transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            ▸
          </span>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-950/60">
            {item.iconLink ? (
              <img
                src={item.iconLink}
                alt=""
                loading="lazy"
                className="h-12 w-12 object-contain"
              />
            ) : (
              <span className="text-xs text-zinc-600">—</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="line-clamp-2 break-words text-sm text-zinc-100"
              title={item.displayName}
            >
              {item.displayName}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1">
              {item.kind === "questItem" && <Badge tone="violet">Quest</Badge>}
              {item.kind === "any-of" && <Badge tone="amber">Any of</Badge>}
              {item.hasFir && item.kind !== "questItem" && (
                <Badge tone="emerald">
                  <span aria-label={item.hasNonFir ? "FIR in some scopes" : "FIR in every scope"}>
                    {item.hasNonFir ? "FIR*" : "FIR"}
                  </span>
                </Badge>
              )}
              {uniqueScopes(item).map((scope) => {
                const cfg = SCOPE_CHIP[scope];
                return (
                  <span
                    key={scope}
                    title={scopeLabel(scope)}
                    aria-label={scopeLabel(scope)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${cfg.classes}`}
                  >
                    {cfg.short}
                  </span>
                );
              })}
            </div>
          </div>
        </button>

        <div className="flex justify-end">
          <AllItemCounter row={item} />
        </div>
      </div>

      {open && (
        <div
          id={`sources-${item.groupKey}`}
          className="border-t border-zinc-700 bg-zinc-950/80"
        >
          {item.breakdown.map((entry) => (
            <div
              key={`${entry.scope}:${entry.fir ? "fir" : "any"}`}
              className="px-3 pt-2 last:pb-2"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold uppercase tracking-wide text-zinc-300">
                    {entry.label}
                  </span>
                  {entry.fir && item.kind !== "questItem" && (
                    <span className="rounded bg-emerald-500/25 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-inset ring-emerald-400/60">
                      FIR
                    </span>
                  )}
                </span>
                <span className="font-mono tabular-nums text-zinc-400">
                  needs {entry.required}
                </span>
              </div>
              <QuestSources sources={entry.sources} />
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "emerald" | "violet" | "amber";
}) {
  const classes = {
    emerald: "bg-emerald-500/25 text-emerald-100 ring-emerald-400/60",
    violet: "bg-violet-500/25 text-violet-100 ring-violet-400/60",
    amber: "bg-amber-500/25 text-amber-100 ring-amber-400/60",
  }[tone];
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${classes}`}
    >
      {children}
    </span>
  );
}
