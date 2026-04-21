import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { AllRow } from "@/lib/types";
import { useProgressStore } from "@/store/progressStore";
import { ItemCounter } from "./ItemCounter";

type Props = {
  row: AllRow;
  anchorRect: DOMRect;
  onClose: () => void;
};

const POPOVER_WIDTH = 340;
const GAP = 6;

export function CreditPopover({ row, anchorRect, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const progress = useProgressStore((s) => s.progress);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const totalCurrent = row.breakdown.reduce(
    (sum, e) => sum + (progress[e.scope][e.rowKey] ?? 0),
    0,
  );
  const complete = totalCurrent >= row.totalRequired && row.totalRequired > 0;

  const viewportW = window.innerWidth;
  let left = anchorRect.right - POPOVER_WIDTH;
  if (left < 8) left = 8;
  if (left + POPOVER_WIDTH > viewportW - 8) left = viewportW - POPOVER_WIDTH - 8;
  const top = anchorRect.bottom + GAP;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={`Credit breakdown for ${row.displayName}`}
      style={{ position: "fixed", top, left, width: POPOVER_WIDTH, zIndex: 50 }}
      className="rounded-lg border border-zinc-600 bg-zinc-900 p-3 shadow-xl shadow-black/60"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className="truncate text-sm font-medium text-zinc-100"
            title={row.displayName}
          >
            {row.displayName}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">
            Credit to which objective?
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close credit breakdown"
          className="shrink-0 rounded border border-zinc-600 bg-zinc-800 px-1.5 text-xs text-zinc-200 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-500"
        >
          ×
        </button>
      </div>

      <ul className="flex flex-col gap-1.5 border-t border-zinc-700 pt-2">
        {row.breakdown.map((entry) => (
          <li
            key={`${entry.scope}:${entry.fir ? "fir" : "any"}`}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-1.5 truncate text-xs text-zinc-200">
              <span className="truncate">{entry.label}</span>
              {entry.fir && row.kind !== "questItem" && (
                <span className="shrink-0 rounded bg-emerald-500/25 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-inset ring-emerald-400/60">
                  FIR
                </span>
              )}
            </span>
            <ItemCounter
              scope={entry.scope}
              rowKey={entry.rowKey}
              required={entry.required}
            />
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between border-t border-zinc-700 pt-2 text-xs">
        <span className="text-zinc-400">Total</span>
        <span className="font-mono tabular-nums">
          <span className={complete ? "text-emerald-300" : "text-zinc-100"}>
            {totalCurrent}
          </span>
          <span className="text-zinc-400"> / {row.totalRequired}</span>
        </span>
      </div>
    </div>,
    document.body,
  );
}
