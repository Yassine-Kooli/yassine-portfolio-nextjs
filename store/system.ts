import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const BOOTED_KEY = "yassineos-booted";

export type Phase = "boot" | "login" | "desktop" | "off";
export type WallpaperId = "forest" | "moon" | "fog" | "void";
export type AccentId = "blood" | "bone" | "moss" | "ember";

export const accents: Record<AccentId, { label: string; rgb: string }> = {
  blood: { label: "Blood", rgb: "160 24 24" },
  ember: { label: "Ember", rgb: "196 98 32" },
  moss: { label: "Moss", rgb: "92 120 64" },
  bone: { label: "Bone", rgb: "190 178 156" },
};

export type Notification = { id: number; title: string; body?: string };

type SystemStore = {
  phase: Phase;
  wallpaper: WallpaperId;
  accent: AccentId;
  grain: boolean;
  fog: boolean;
  crt: boolean;
  launcherOpen: boolean;
  notifications: Notification[];
  setPhase: (p: Phase) => void;
  set: (patch: Partial<Pick<SystemStore, "wallpaper" | "accent" | "grain" | "fog" | "crt" | "launcherOpen">>) => void;
  notify: (title: string, body?: string) => void;
  dismiss: (id: number) => void;
};

let nid = 0;

export const useSystem = create<SystemStore>()(
  persist(
    (set) => ({
      phase: "boot",
      wallpaper: "forest",
      accent: "blood",
      grain: true,
      fog: true,
      crt: true,
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
      partialize: ({ wallpaper, accent, grain, fog, crt }) => ({ wallpaper, accent, grain, fog, crt }),
    },
  ),
);
