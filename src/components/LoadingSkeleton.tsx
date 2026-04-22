export function LoadingSkeleton() {
  return (
    <ul
      className="grid animate-pulse gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]"
      aria-label="Loading items"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900"
        >
          <div className="aspect-square w-full bg-zinc-800" />
          <div className="flex flex-col gap-2 px-3 pt-3">
            <div className="h-4 w-3/4 rounded bg-zinc-800" />
            <div className="h-3 w-1/2 rounded bg-zinc-800/70" />
          </div>
          <div className="flex justify-end px-3 pt-3 pb-3">
            <div className="h-9 w-44 rounded bg-zinc-800" />
          </div>
        </li>
      ))}
    </ul>
  );
}
