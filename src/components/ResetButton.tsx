import { useEffect, useState } from "react";
import type { Objective, ScopeKey } from "@/lib/types";
import { scopeLabel } from "@/lib/types";
import { useProgressStore } from "@/store/progressStore";

type Props = {
  objective: Objective;
  scope: ScopeKey | null;
};

export function ResetButton({ objective, scope }: Props) {
  const [confirming, setConfirming] = useState(false);
  const resetScope = useProgressStore((s) => s.resetScope);
  const hasProgress = useProgressStore((s) =>
    scope ? Object.keys(s.progress[scope]).length > 0 : false,
  );

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  useEffect(() => {
    setConfirming(false);
  }, [scope]);

  if (objective === "all" || scope === null) {
    return (
      <button
        type="button"
        disabled
        title="Reset individual tabs instead"
        aria-label="Reset disabled — pick an individual tab to reset"
        className="cursor-not-allowed rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 opacity-60"
      >
        Reset progress
      </button>
    );
  }

  const disabled = !hasProgress && !confirming;

  const handleClick = () => {
    if (confirming) {
      resetScope(scope);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={
        confirming
          ? `Confirm reset of ${scopeLabel(scope)} progress`
          : `Reset ${scopeLabel(scope)} progress`
      }
      className={
        "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 " +
        (confirming
          ? "border-red-500 bg-red-900/60 text-red-100 hover:bg-red-900/80"
          : "border-zinc-600 bg-zinc-800 text-zinc-200 enabled:hover:border-zinc-400 enabled:hover:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-50")
      }
    >
      {confirming ? `Click again to wipe ${scopeLabel(scope)}` : "Reset progress"}
    </button>
  );
}
