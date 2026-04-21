export type Objective = "kappa" | "hideout" | "lightkeeper" | "prestige" | "all";

export type PrestigeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const PRESTIGE_LEVELS: PrestigeLevel[] = [1, 2, 3, 4, 5, 6];

export type ScopeKey =
  | "kappa"
  | "hideout"
  | "lightkeeper"
  | "prestige-1"
  | "prestige-2"
  | "prestige-3"
  | "prestige-4"
  | "prestige-5"
  | "prestige-6";

export const ALL_SCOPE_KEYS: ScopeKey[] = [
  "kappa",
  "hideout",
  "lightkeeper",
  "prestige-1",
  "prestige-2",
  "prestige-3",
  "prestige-4",
  "prestige-5",
  "prestige-6",
];

export function scopeLabel(scope: ScopeKey): string {
  switch (scope) {
    case "kappa":
      return "Kappa";
    case "hideout":
      return "Hideout";
    case "lightkeeper":
      return "Lightkeeper";
    case "prestige-1":
      return "Prestige 1";
    case "prestige-2":
      return "Prestige 2";
    case "prestige-3":
      return "Prestige 3";
    case "prestige-4":
      return "Prestige 4";
    case "prestige-5":
      return "Prestige 5";
    case "prestige-6":
      return "Prestige 6";
  }
}

export type ApiItem = {
  id: string;
  name: string;
  shortName: string | null;
  iconLink: string | null;
};

export type ApiTaskObjective = {
  __typename: string;
  id: string | null;
  type: string;
  optional: boolean;
  count?: number;
  foundInRaid?: boolean;
  items?: ApiItem[];
  questItem?: ApiItem;
  task?: { id: string } | null;
  status?: string[] | null;
};

export type ApiTrader = { name: string };

export type ApiTaskRequirement = {
  task: { id: string } | null;
};

export type ApiTask = {
  id: string;
  name: string;
  wikiLink: string | null;
  kappaRequired: boolean | null;
  lightkeeperRequired: boolean | null;
  trader: ApiTrader;
  requiredPrestige: { prestigeLevel: number } | null;
  taskRequirements: ApiTaskRequirement[] | null;
  objectives: ApiTaskObjective[];
};

export type ApiPrestige = {
  prestigeLevel: number;
  name: string;
  conditions: ApiTaskObjective[];
};

export type ApiItemAttribute = {
  type: string;
  name: string;
  value: string | null;
};

export type ApiHideoutItemRequirement = {
  count: number;
  item: ApiItem;
  attributes: ApiItemAttribute[] | null;
};

export type ApiHideoutStationLevel = {
  level: number;
  itemRequirements: ApiHideoutItemRequirement[];
};

export type ApiHideoutStation = {
  id: string;
  name: string;
  levels: ApiHideoutStationLevel[];
};

export type TrackerData = {
  tasks: ApiTask[];
  prestige: ApiPrestige[];
  hideoutStations: ApiHideoutStation[];
};

export type ItemSource =
  | {
      kind: "task";
      taskId: string;
      taskName: string;
      traderName: string;
      wikiLink: string | null;
    }
  | {
      kind: "prestige";
      prestigeLevel: number;
      prestigeName: string;
    }
  | {
      kind: "hideout";
      stationName: string;
      level: number;
    };

export type TrackedItem = {
  rowKey: string;
  kind: "item" | "questItem" | "any-of";
  displayName: string;
  shortName: string | null;
  iconLink: string | null;
  fir: boolean;
  required: number;
  sources: ItemSource[];
  alternatives?: ApiItem[];
};

export type AllBreakdownEntry = {
  scope: ScopeKey;
  label: string;
  rowKey: string;
  fir: boolean;
  required: number;
  sources: ItemSource[];
};

export type AllRow = {
  groupKey: string;
  kind: "item" | "questItem" | "any-of";
  displayName: string;
  shortName: string | null;
  iconLink: string | null;
  breakdown: AllBreakdownEntry[];
  totalRequired: number;
  alternatives?: ApiItem[];
  hasFir: boolean;
  hasNonFir: boolean;
};
