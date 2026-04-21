import { useRef, useState, useEffect } from "react";
import type { AllRow } from "@/lib/types";
import { useProgressStore } from "@/store/progressStore";
import { CreditPopover } from "./CreditPopover";

type Props = {
  row: AllRow;
};

export function AllItemCounter({ row }: Props) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const totalCurrent = useProgressStore((s) =>
    row.breakdown.reduce(
      (sum, e) => sum + (s.progress[e.scope][e.rowKey] ?? 0),
      0,
    ),
  );

  const complete = totalCurrent >= row.totalRequired && row.totalRequired > 0;

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const update = () => {
      if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect());
    }
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${row.displayName}: ${totalCurrent} of ${row.totalRequired} collected. Click to open credit breakdown.`}
        className={
          "flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 " +
          (complete
            ? "border-emerald-500 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
            : "border-zinc-600 bg-zinc-800 text-zinc-100 hover:border-zinc-400")
        }
      >
        <span>{totalCurrent}</span>
        <span className="text-zinc-500">/</span>
        <span>{row.totalRequired}</span>
        <span aria-hidden="true" className="text-zinc-600">
          ▾
        </span>
      </button>
      {open && rect && (
        <CreditPopover row={row} anchorRect={rect} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
