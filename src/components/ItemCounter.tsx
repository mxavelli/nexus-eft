import { useProgressStore, useItemCount } from "@/store/progressStore";
import type { ScopeKey } from "@/lib/types";

type Props = {
  scope: ScopeKey;
  rowKey: string;
  required: number;
};

export function ItemCounter({ scope, rowKey, required }: Props) {
  const count = useItemCount(scope, rowKey);
  const adjust = useProgressStore((s) => s.adjust);
  const setCount = useProgressStore((s) => s.setCount);

  const atMin = count <= 0;
  const atMax = count >= required;
  const complete = count >= required && required > 0;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`Decrease count for ${rowKey}, currently ${count} of ${required}`}
        disabled={atMin}
        onClick={() => adjust(scope, rowKey, -1, required)}
        className="flex h-8 w-8 items-center justify-center rounded border border-zinc-600 bg-zinc-800 text-base text-zinc-200 transition-colors enabled:hover:border-zinc-400 enabled:hover:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        −
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={required}
        value={count}
        aria-label={`Count for ${rowKey}`}
        onChange={(e) => {
          const raw = Number(e.target.value);
          if (Number.isNaN(raw)) return;
          const clamped = Math.max(0, Math.min(required, Math.floor(raw)));
          setCount(scope, rowKey, clamped);
        }}
        onFocus={(e) => e.target.select()}
        className="h-8 w-10 rounded border border-zinc-600 bg-zinc-800 text-center font-mono text-sm tabular-nums text-zinc-50 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <span className="whitespace-nowrap font-mono text-sm tabular-nums text-zinc-300" aria-hidden="true">
        /{" "}
        <span className={complete ? "text-emerald-300" : "text-zinc-100"}>
          {required}
        </span>
      </span>

      <button
        type="button"
        aria-label={`Increase count for ${rowKey}, currently ${count} of ${required}`}
        disabled={atMax}
        onClick={() => adjust(scope, rowKey, 1, required)}
        className="flex h-8 w-8 items-center justify-center rounded border border-zinc-600 bg-zinc-800 text-base text-zinc-200 transition-colors enabled:hover:border-zinc-400 enabled:hover:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        +
      </button>
    </div>
  );
}
