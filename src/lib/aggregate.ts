import type {
  AllBreakdownEntry,
  AllRow,
  ApiHideoutStation,
  ApiItem,
  ApiPrestige,
  ApiTask,
  ApiTaskObjective,
  ItemSource,
  PrestigeLevel,
  ScopeKey,
  TrackedItem,
} from "@/lib/types";
import { scopeLabel, PRESTIGE_LEVELS } from "@/lib/types";

function dedupItems(items: ApiItem[]): ApiItem[] {
  const seen = new Set<string>();
  const out: ApiItem[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}

function sourceOfTask(task: ApiTask): ItemSource {
  return {
    kind: "task",
    taskId: task.id,
    taskName: task.name,
    traderName: task.trader.name,
    wikiLink: task.wikiLink,
  };
}

function sourceOfPrestige(level: ApiPrestige): ItemSource {
  return {
    kind: "prestige",
    prestigeLevel: level.prestigeLevel,
    prestigeName: level.name,
  };
}

function sourceOfHideout(stationName: string, level: number): ItemSource {
  return { kind: "hideout", stationName, level };
}

type Accumulator = Map<string, TrackedItem>;

function sourceKey(source: ItemSource): string {
  switch (source.kind) {
    case "task":
      return `task::${source.taskId}`;
    case "prestige":
      return `prestige::${source.prestigeLevel}`;
    case "hideout":
      return `hideout::${source.stationName}::${source.level}`;
  }
}

function addRow(acc: Accumulator, draft: TrackedItem): void {
  const existing = acc.get(draft.rowKey);
  if (!existing) {
    acc.set(draft.rowKey, draft);
    return;
  }
  existing.required += draft.required;
  const existingSourceKeys = new Set(existing.sources.map(sourceKey));
  for (const source of draft.sources) {
    if (!existingSourceKeys.has(sourceKey(source))) {
      existing.sources.push(source);
      existingSourceKeys.add(sourceKey(source));
    }
  }
}

function ingestObjective(
  acc: Accumulator,
  objective: ApiTaskObjective,
  source: ItemSource,
): void {
  if (objective.optional) return;

  if (objective.__typename === "TaskObjectiveItem" && objective.items) {
    const items = dedupItems(objective.items);
    if (items.length === 0) return;
    const fir = objective.foundInRaid ?? false;
    const count = objective.count ?? 0;

    if (items.length === 1) {
      const item = items[0];
      addRow(acc, {
        rowKey: `item::${item.id}::${fir ? "fir" : "any"}`,
        kind: "item",
        displayName: item.name,
        shortName: item.shortName,
        iconLink: item.image512pxLink ?? item.iconLink,
        fir,
        required: count,
        sources: [source],
      });
      return;
    }

    const sortedIds = items.map((i) => i.id).sort().join(",");
    const preview = items
      .slice(0, 3)
      .map((i) => i.shortName ?? i.name)
      .join(" / ");
    const displayName =
      items.length > 3
        ? `Any of: ${preview} + ${items.length - 3} more`
        : `Any of: ${preview}`;
    addRow(acc, {
      rowKey: `any::${sortedIds}::${fir ? "fir" : "any"}`,
      kind: "any-of",
      displayName,
      shortName: null,
      iconLink: items[0].image512pxLink ?? items[0].iconLink,
      fir,
      required: count,
      sources: [source],
      alternatives: items,
    });
    return;
  }

  if (objective.__typename === "TaskObjectiveQuestItem" && objective.questItem) {
    const qi = objective.questItem;
    addRow(acc, {
      rowKey: `questItem::${qi.id}`,
      kind: "questItem",
      displayName: qi.name,
      shortName: qi.shortName,
      iconLink: qi.image512pxLink ?? qi.iconLink,
      fir: true,
      required: objective.count ?? 0,
      sources: [source],
    });
  }
}

function finalize(acc: Accumulator): TrackedItem[] {
  return Array.from(acc.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );
}

export function aggregateForKappa(tasks: ApiTask[]): TrackedItem[] {
  const acc: Accumulator = new Map();
  for (const task of tasks) {
    if (!task.kappaRequired) continue;
    const source = sourceOfTask(task);
    for (const objective of task.objectives) {
      ingestObjective(acc, objective, source);
    }
  }
  return finalize(acc);
}

export function aggregateForLightkeeper(tasks: ApiTask[]): TrackedItem[] {
  const acc: Accumulator = new Map();
  for (const task of tasks) {
    if (!task.lightkeeperRequired) continue;
    const source = sourceOfTask(task);
    for (const objective of task.objectives) {
      ingestObjective(acc, objective, source);
    }
  }
  return finalize(acc);
}

export function aggregateForPrestigeLevel(
  prestige: ApiPrestige[],
  level: PrestigeLevel,
  tasks: ApiTask[],
): TrackedItem[] {
  const acc: Accumulator = new Map();
  const target = prestige.find((p) => p.prestigeLevel === level);
  if (!target) return [];

  const prestigeSource = sourceOfPrestige(target);
  const tasksById = new Map(tasks.map((t) => [t.id, t]));

  for (const condition of target.conditions) {
    if (condition.__typename === "TaskObjectiveItem") {
      ingestObjective(acc, condition, prestigeSource);
      continue;
    }
    if (
      condition.__typename === "TaskObjectiveTaskStatus" &&
      condition.task?.id
    ) {
      const task = tasksById.get(condition.task.id);
      if (!task) continue;
      // Skip Collector (kappaRequired) — already tracked in the Kappa tab.
      if (task.kappaRequired) continue;
      const taskSource = sourceOfTask(task);
      for (const objective of task.objectives) {
        ingestObjective(acc, objective, taskSource);
      }
    }
  }

  return finalize(acc);
}

function hideoutRequiresFir(
  attrs: { type: string; name: string; value: string | null }[] | null,
): boolean {
  if (!attrs) return false;
  for (const a of attrs) {
    if (
      (a.type === "foundInRaid" || a.name === "foundInRaid") &&
      a.value === "true"
    ) {
      return true;
    }
  }
  return false;
}

export function aggregateForHideout(
  stations: ApiHideoutStation[] | undefined,
): TrackedItem[] {
  const acc: Accumulator = new Map();
  if (!stations) return [];
  for (const station of stations) {
    for (const level of station.levels) {
      const source = sourceOfHideout(station.name, level.level);
      for (const req of level.itemRequirements) {
        const fir = hideoutRequiresFir(req.attributes);
        addRow(acc, {
          rowKey: `item::${req.item.id}::${fir ? "fir" : "any"}`,
          kind: "item",
          displayName: req.item.name,
          shortName: req.item.shortName,
          iconLink: req.item.image512pxLink ?? req.item.iconLink,
          fir,
          required: req.count,
          sources: [source],
        });
      }
    }
  }
  return finalize(acc);
}

function groupKeyFor(item: TrackedItem): string {
  if (item.kind === "questItem") return item.rowKey;
  return item.rowKey.replace(/::(fir|any)$/, "");
}

export function aggregateForAll(
  tasks: ApiTask[],
  hideout: ApiHideoutStation[] | undefined,
  prestige: ApiPrestige[],
): AllRow[] {
  const perScope: Array<{ scope: ScopeKey; items: TrackedItem[] }> = [
    { scope: "kappa", items: aggregateForKappa(tasks) },
    { scope: "hideout", items: aggregateForHideout(hideout) },
    { scope: "lightkeeper", items: aggregateForLightkeeper(tasks) },
    ...PRESTIGE_LEVELS.map((lv) => ({
      scope: `prestige-${lv}` as ScopeKey,
      items: aggregateForPrestigeLevel(prestige, lv, tasks),
    })),
  ];

  const byGroup = new Map<string, AllRow>();

  for (const { scope, items } of perScope) {
    for (const item of items) {
      const groupKey = groupKeyFor(item);
      const entry: AllBreakdownEntry = {
        scope,
        label: scopeLabel(scope),
        rowKey: item.rowKey,
        fir: item.fir,
        required: item.required,
        sources: item.sources,
      };
      const existing = byGroup.get(groupKey);
      if (existing) {
        existing.breakdown.push(entry);
        existing.totalRequired += item.required;
        if (item.fir) existing.hasFir = true;
        else existing.hasNonFir = true;
      } else {
        byGroup.set(groupKey, {
          groupKey,
          kind: item.kind,
          displayName: item.displayName,
          shortName: item.shortName,
          iconLink: item.iconLink,
          alternatives: item.alternatives,
          breakdown: [entry],
          totalRequired: item.required,
          hasFir: item.fir,
          hasNonFir: !item.fir,
        });
      }
    }
  }

  return Array.from(byGroup.values()).sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  );
}
