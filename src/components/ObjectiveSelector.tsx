import type { Objective } from "@/lib/types";

const OPTIONS: { value: Objective; label: string }[] = [
  { value: "kappa", label: "Kappa" },
  { value: "hideout", label: "Hideout" },
  { value: "lightkeeper", label: "Lightkeeper" },
  { value: "prestige", label: "Prestige" },
  { value: "all", label: "All" },
];

type Props = {
  value: Objective;
  onChange: (value: Objective) => void;
};

export function ObjectiveSelector({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Objective"
      className="inline-flex flex-wrap rounded-lg border border-zinc-700 bg-zinc-900 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 " +
              (active
                ? "bg-emerald-500/25 text-emerald-100"
                : "text-zinc-300 hover:text-zinc-50")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
