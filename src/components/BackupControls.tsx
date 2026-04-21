import { useRef, useState } from "react";

const PROGRESS_KEY = "nexus-eft-progress-v1";
const PREFS_KEY = "nexus-eft-prefs-v1";
const BACKUP_VERSION = 1;

type Backup = {
  app: "nexus-eft";
  version: number;
  exportedAt: string;
  progress: unknown;
  preferences?: unknown;
};

function filenameFor(now: Date): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `nexus-eft-backup-${y}-${m}-${d}-${hh}${mm}.json`;
}

export function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<{ kind: "info" | "error"; text: string } | null>(null);

  const flash = (kind: "info" | "error", text: string) => {
    setStatus({ kind, text });
    window.setTimeout(() => setStatus(null), 4000);
  };

  const handleExport = () => {
    try {
      const rawProgress = localStorage.getItem(PROGRESS_KEY);
      const rawPrefs = localStorage.getItem(PREFS_KEY);
      const payload: Backup = {
        app: "nexus-eft",
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        progress: rawProgress ? JSON.parse(rawProgress) : null,
        preferences: rawPrefs ? JSON.parse(rawPrefs) : undefined,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filenameFor(new Date());
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      flash("info", "Backup downloaded.");
    } catch (err) {
      flash(
        "error",
        `Export failed: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data?.app !== "nexus-eft") throw new Error("Not a Nexus EFT backup.");
      if (typeof data.version !== "number") throw new Error("Missing version.");
      if (data.version > BACKUP_VERSION) {
        throw new Error(
          `Backup is from a newer version (v${data.version}); update the app.`,
        );
      }
      if (!data.progress || typeof data.progress !== "object") {
        throw new Error("Backup has no progress payload.");
      }
      const when = data.exportedAt ? new Date(data.exportedAt).toLocaleString() : "unknown date";
      const ok = window.confirm(
        `Replace your current progress with the backup from ${when}?\n\nThis cannot be undone. Export a backup first if you want to keep the current state.`,
      );
      if (!ok) {
        flash("info", "Import cancelled.");
        return;
      }
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data.progress));
      if (data.preferences && typeof data.preferences === "object") {
        localStorage.setItem(PREFS_KEY, JSON.stringify(data.preferences));
      }
      location.reload();
    } catch (err) {
      flash(
        "error",
        `Import failed: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleExport}
        aria-label="Export progress backup to a JSON file"
        className="flex h-10 items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-800 px-3.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        Export
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        aria-label="Import a Nexus EFT backup JSON"
        className="flex h-10 items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-800 px-3.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:text-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />
      {status && (
        <span
          role="status"
          aria-live="polite"
          className={
            "text-xs " +
            (status.kind === "error" ? "text-red-300" : "text-emerald-300")
          }
        >
          {status.text}
        </span>
      )}
    </div>
  );
}
