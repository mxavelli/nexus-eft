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
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`sources-${item.rowKey}`}
        aria-label={`${open ? "Collapse" : "Expand"} sources for ${item.displayName}`}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-zinc-950/60">
          <span
            aria-hidden="true"
            className={`absolute top-2 left-2 z-10 rounded bg-zinc-950/75 px-2 py-1 text-sm text-zinc-200 transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            ▸
          </span>
          {item.iconLink ? (
            <img
              src={item.iconLink}
              alt=""
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-zinc-600">no image</span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1.5 px-3 pt-3">
          <div
            className="line-clamp-2 break-words text-base font-medium leading-snug text-zinc-50"
            title={item.displayName}
          >
            {item.displayName}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {item.kind === "questItem" && <Badge tone="violet">Quest</Badge>}
            {item.kind === "any-of" && <Badge tone="amber">Any of</Badge>}
            {item.fir && item.kind !== "questItem" && (
              <Badge tone="emerald">FIR</Badge>
            )}
            <span className="text-xs text-zinc-400">
              {item.sources.length}{" "}
              {item.sources.length === 1 ? "source" : "sources"}
            </span>
          </div>
        </div>
      </button>

      <div className="flex justify-end px-3 pt-3 pb-3">
        <ItemCounter
          scope={scope}
          rowKey={item.rowKey}
          required={item.required}
        />
      </div>

      {open && (
        <div
          id={`sources-${item.rowKey}`}
          className="border-t border-zinc-700 bg-zinc-950/80"
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
      className={`rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${classes}`}
    >
      {children}
    </span>
  );
}
