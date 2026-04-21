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
    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <ItemRow key={item.rowKey} item={item} scope={scope} />
      ))}
    </ul>
  );
}
