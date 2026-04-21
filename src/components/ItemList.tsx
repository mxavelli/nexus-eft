import type { ScopeKey, TrackedItem } from "@/lib/types";
import { ItemRow } from "./ItemRow";

type Props = {
  items: TrackedItem[];
  scope: ScopeKey;
};

export function ItemList({ items, scope }: Props) {
  if (items.length === 0) {
    return (
      <p className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-500">
        No items match the current filters.
      </p>
    );
  }

  return (
    <ul className="grid gap-1.5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
      {items.map((item) => (
        <ItemRow key={item.rowKey} item={item} scope={scope} />
      ))}
    </ul>
  );
}
