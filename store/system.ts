import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const BOOTED_KEY = "yassineos-booted";

export type Phase = "boot" | "login" | "desktop" | "off";
export type WallpaperId = "bars" | "graphite" | "midnight" | "slate";
export type AccentId = "indigo" | "teal" | "sky" | "slate";

export const accents: Record<AccentId, { label: string; rgb: string }> = {
  indigo: { label: "Indigo", rgb: "99 102 241" },
  teal: { label: "Teal", rgb: "20 184 166" },
  sky: { label: "Sky", rgb: "56 189 248" },
  slate: { label: "Slate", rgb: "148 163 184" },
};

const DEFAULTS = { wallpaper: "bars", accent: "indigo" } as const;

// Bump when the persisted shape changes. Older saved settings are reset to the defaults above.
// v4: 3D data-bars wallpaper became the default.
const SETTINGS_VERSION = 4;

export type Notification = { id: number; title: string; body?: string };

type SystemStore = {
  phase: Phase;
  wallpaper: WallpaperId;
  accent: AccentId;
  launcherOpen: boolean;
  notifications: Notification[];
  setPhase: (p: Phase) => void;
  set: (patch: Partial<Pick<SystemStore, "wallpaper" | "accent" | "launcherOpen">>) => void;
  notify: (title: string, body?: string) => void;
  dismiss: (id: number) => void;
};

let nid = 0;

export const useSystem = create<SystemStore>()(
  persist(
    (set) => ({
      phase: "boot",
      wallpaper: DEFAULTS.wallpaper,
      accent: DEFAULTS.accent,
      launcherOpen: false,
      notifications: [],
      setPhase: (phase) => set({ phase }),
      set: (patch) => set(patch),
      notify: (title, body) => {
        const id = ++nid;
        set((s) => ({ notifications: [...s.notifications.slice(-2), { id, title, body }] }));
        setTimeout(() => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })), 5000);
      },
      dismiss: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
    }),
    {
      name: "yassineos-settings",
      storage: createJSONStorage(() => localStorage),
      version: SETTINGS_VERSION,
      migrate: (persisted, version) => {
        // Older versions had the gothic wallpapers and the grain/fog/CRT toggles: reset them.
        if (version < SETTINGS_VERSION) return { ...DEFAULTS };
        const p = (persisted ?? {}) as Partial<SystemStore>;
        return { wallpaper: p.wallpaper ?? DEFAULTS.wallpaper, accent: p.accent ?? DEFAULTS.accent };
      },
      partialize: ({ wallpaper, accent }) => ({ wallpaper, accent }),
    },
  ),
);
