import { useMemo } from "react";
import { useProgressStore } from "@/store/progressStore";
import type { ScopeKey, TrackedItem } from "@/lib/types";

type Props = {
  scope: ScopeKey;
  items: TrackedItem[];
};

export function ProgressSummary({ scope, items }: Props) {
  const progress = useProgressStore((s) => s.progress[scope]);

  const { done, total } = useMemo(() => {
    let done = 0;
    for (const item of items) {
      const count = progress[item.rowKey] ?? 0;
      if (count >= item.required) done += 1;
    }
    return { done, total: items.length };
  }, [items, progress]);

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      className="flex items-center gap-2 text-sm"
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
