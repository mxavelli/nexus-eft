import { useState } from "react";
import type { ScopeKey, TrackedItem } from "@/lib/types";
import { ItemCounter } from "./ItemCounter";
import { QuestSources } from "./QuestSources";

type Props = {
  item: TrackedItem;
  scope: ScopeKey;
};

export function ItemRow({ item, scope }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="flex flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 shadow-sm shadow-black/40">
      <div className="flex flex-col gap-2 px-3 py-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`sources-${item.rowKey}`}
          aria-label={`${open ? "Collapse" : "Expand"} sources for ${item.displayName}`}
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

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-950/60">
            {item.iconLink ? (
              <img
                src={item.iconLink}
                alt=""
                loading="lazy"
                className="h-16 w-16 object-contain"
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
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {item.kind === "questItem" && <Badge tone="violet">Quest</Badge>}
              {item.kind === "any-of" && <Badge tone="amber">Any of</Badge>}
              {item.fir && item.kind !== "questItem" && (
                <Badge tone="emerald">FIR</Badge>
              )}
              <span className="text-[11px] text-zinc-400">
                {item.sources.length}{" "}
                {item.sources.length === 1 ? "source" : "sources"}
              </span>
            </div>
          </div>
        </button>

        <div className="flex justify-end">
          <ItemCounter
            scope={scope}
            rowKey={item.rowKey}
            required={item.required}
          />
        </div>
      </div>

      {open && (
        <div
          id={`sources-${item.rowKey}`}
          className="border-t border-zinc-800 bg-zinc-950/40"
        >
          <QuestSources sources={item.sources} />
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
