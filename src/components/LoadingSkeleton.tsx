export function LoadingSkeleton() {
  return (
    <ul
      className="grid animate-pulse gap-1.5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
      aria-label="Loading items"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900"
        >
          <div className="aspect-square w-full bg-zinc-800" />
          <div className="flex flex-col gap-1.5 px-3 pt-2">
            <div className="h-3 w-3/4 rounded bg-zinc-800" />
            <div className="h-2.5 w-1/2 rounded bg-zinc-800/70" />
          </div>
          <div className="flex justify-end px-3 pt-2 pb-2">
            <div className="h-7 w-40 rounded bg-zinc-800" />
          </div>
        </li>
      ))}
    </ul>
  );
}
