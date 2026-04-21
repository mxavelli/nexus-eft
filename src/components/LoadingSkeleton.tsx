export function LoadingSkeleton() {
  return (
    <ul
      className="grid animate-pulse grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3"
      aria-label="Loading items"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        >
          <div className="flex items-start gap-2">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-sm bg-zinc-800" />
            <div className="h-12 w-12 shrink-0 rounded bg-zinc-800" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="h-3 w-3/4 rounded bg-zinc-800" />
              <div className="h-2.5 w-1/2 rounded bg-zinc-900" />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="h-7 w-40 rounded bg-zinc-800" />
          </div>
        </li>
      ))}
    </ul>
  );
}
