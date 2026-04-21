/**
 * PmcSearchBar — DORMANT (not mounted anywhere as of v5 cache)
 *
 * Small header input that opens the matching PMC profile on
 * tarkov.dev in a new tab. No auth, no backend, no in-app data —
 * just a deep-link shortcut.
 *
 * To re-enable: import into src/App.tsx and render inside the
 * header row next to the title. Nothing else needs to change.
 *
 *     import { PmcSearchBar } from "@/components/PmcSearchBar";
 *     …
 *     <div className="flex min-w-0 flex-wrap items-center gap-3">
 *       <div>
 *         <h1 …>Nexus EFT</h1>
 *         <p …>Objective item tracker</p>
 *       </div>
 *       <PmcSearchBar />
 *     </div>
 *
 * -----------------------------------------------------------------
 * Why this is a deep-link rather than a live profile card
 * -----------------------------------------------------------------
 * tarkov.dev exposes a REST surface for PMC profiles, but it's
 * gated by Cloudflare Turnstile:
 *
 *   GET https://player.tarkov.dev/name/{name}?gameMode={mode}&token={turnstileToken}
 *   GET https://player.tarkov.dev/account/{aid}?gameMode={mode}&token={turnstileToken}
 *
 * We built the full integration (Turnstile widget via
 * @marsidev/react-turnstile, token-refresh-on-401, debounced
 * search hook, TanStack-cached profile fetch, PmcProfileCard
 * rendering faction/level/raids/K-D/survival%/achievements) and
 * it failed at the last mile:
 *
 *   Cloudflare Turnstile tokens are bound to the SECRET key of
 *   whoever issued the widget's SITE key. A token we issue with
 *   our own site key can only be validated by our own secret —
 *   tarkov.dev's backend validates with *their* secret, so every
 *   request from a third-party origin 401s.
 *
 * We verified this live: real Turnstile tokens with a valid
 * user-registered site key still 401'd on every call. Hostname /
 * Origin headers make no difference; the failure is in
 * Cloudflare's cross-secret validation. That was the end of the
 * line for a direct-API approach.
 *
 * Paths back to a live profile card, if tarkov.dev's policy or
 * the API ever changes:
 *
 *   1. They add a cross-secret or public-read mode to Turnstile
 *      for /player.tarkov.dev/ specifically.
 *   2. They publish a public API without Turnstile (e.g.
 *      something under https://api.tarkov.dev/).
 *   3. Battlestate Games publishes their own public profile API.
 *   4. We proxy through our own backend that has permission
 *      (extremely unlikely to be granted).
 *
 * The full plumbing we removed (if you want to resurrect it):
 *
 *   - @marsidev/react-turnstile    (dependency)
 *   - src/store/turnstileStore.ts  (zustand, token helper)
 *   - src/store/pmcStore.ts        (selected-aid store)
 *   - src/components/TurnstileMount.tsx
 *   - src/api/player.ts            (searchPlayers, getProfile, fetchWithTurnstile)
 *   - src/hooks/usePlayerSearch.ts (TanStack Query, 3-char debounce)
 *   - src/hooks/usePlayerProfile.ts
 *   - src/components/PmcProfileCard.tsx
 *   - playerLevels { level exp } in the GraphQL query (for XP→level)
 *   - VITE_TURNSTILE_SITE_KEY env var handling
 *
 * Git history has the last working version of all of the above;
 * see plan file §10 for the full design.
 */

import { useState } from "react";

type Mode = "regular" | "pve";

const MIN_CHARS = 3;

export function PmcSearchBar() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("regular");

  const open = () => {
    const trimmed = name.trim();
    if (trimmed.length < MIN_CHARS) return;
    const url = `https://tarkov.dev/players/${mode}/${encodeURIComponent(trimmed)}`;
    window.open(url, "_blank", "noreferrer");
  };

  const disabled = name.trim().length < MIN_CHARS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        open();
      }}
      className="flex items-center gap-1.5"
    >
      <input
        type="search"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="PMC name…"
        aria-label="Open PMC profile on tarkov.dev"
        className="h-8 w-44 rounded border border-zinc-700 bg-zinc-900 px-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
      />
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as Mode)}
        aria-label="Game mode"
        className="h-8 rounded border border-zinc-700 bg-zinc-900 px-1.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none"
      >
        <option value="regular">PVP</option>
        <option value="pve">PVE</option>
      </select>
      <button
        type="submit"
        disabled={disabled}
        title={
          disabled
            ? `Enter at least ${MIN_CHARS} characters`
            : "Open on tarkov.dev"
        }
        className="flex h-8 items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 text-xs font-medium text-zinc-300 enabled:hover:border-zinc-500 enabled:hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Open ↗
      </button>
    </form>
  );
}
