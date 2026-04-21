import { useMemo } from "react";
import { useProgressStore } from "@/store/progressStore";
import type { AllRow } from "@/lib/types";

type Props = {
  rows: AllRow[];
};

export function AllProgressSummary({ rows }: Props) {
  const progress = useProgressStore((s) => s.progress);

  const { done, total } = useMemo(() => {
    let done = 0;
    for (const row of rows) {
      let current = 0;
      for (const entry of row.breakdown) {
        current += progress[entry.scope][entry.rowKey] ?? 0;
      }
      if (current >= row.totalRequired) done += 1;
    }
    return { done, total: rows.length };
  }, [rows, progress]);

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      className="flex items-center gap-2.5 text-lg"
      role="status"
      aria-live="polite"
      aria-label={`Progress: ${done} of ${total} items complete, ${percent} percent`}
    >
      <span className="font-mono tabular-nums text-zinc-100">
        {done} / {total}
      </span>
      <span className="text-zinc-400">items</span>
      <span className="text-zinc-500" aria-hidden="true">·</span>
      <span className="font-mono tabular-nums text-emerald-300">{percent}%</span>
    </div>
  );
}
