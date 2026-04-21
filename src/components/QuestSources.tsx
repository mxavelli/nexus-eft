import type { ItemSource } from "@/lib/types";

type Props = {
  sources: ItemSource[];
};

export function QuestSources({ sources }: Props) {
  if (sources.length === 0) {
    return <p className="px-3 py-2 text-xs text-zinc-400">No source data.</p>;
  }

  return (
    <ul className="flex flex-col gap-1 border-t border-zinc-700 bg-zinc-950/60 px-3 py-2">
      {sources.map((source, idx) => (
        <li key={idx} className="flex items-center gap-2 text-xs">
          {source.kind === "task" && <TaskSource source={source} />}
          {source.kind === "prestige" && <PrestigeSource source={source} />}
          {source.kind === "hideout" && <HideoutSource source={source} />}
        </li>
      ))}
    </ul>
  );
}

function TaskSource({
  source,
}: {
  source: Extract<ItemSource, { kind: "task" }>;
}) {
  const label = (
    <>
      <span className="text-zinc-300">{source.traderName}</span>
      <span className="text-zinc-500" aria-hidden="true">—</span>
      <span className="text-zinc-100">{source.taskName}</span>
    </>
  );
  return source.wikiLink ? (
    <a
      href={source.wikiLink}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${source.taskName} on the Tarkov wiki (opens in a new tab)`}
      className="flex items-center gap-2 rounded hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      {label}
      <span aria-hidden="true" className="text-zinc-400">
        ↗
      </span>
    </a>
  ) : (
    <span className="flex items-center gap-2">{label}</span>
  );
}

function PrestigeSource({
  source,
}: {
  source: Extract<ItemSource, { kind: "prestige" }>;
}) {
  const label = `Prestige ${source.prestigeLevel}`;
  const showName =
    source.prestigeName && source.prestigeName.toLowerCase() !== label.toLowerCase();
  return (
    <span className="flex items-center gap-2">
      <span className="text-zinc-100">{label}</span>
      {showName && (
        <>
          <span className="text-zinc-500" aria-hidden="true">—</span>
          <span className="text-zinc-300">{source.prestigeName}</span>
        </>
      )}
    </span>
  );
}

function HideoutSource({
  source,
}: {
  source: Extract<ItemSource, { kind: "hideout" }>;
}) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-zinc-100">{source.stationName}</span>
      <span className="text-zinc-500" aria-hidden="true">·</span>
      <span className="text-zinc-300">Level {source.level}</span>
    </span>
  );
}
