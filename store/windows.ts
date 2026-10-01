import { create } from "zustand";
import { apps, type AppId } from "@/lib/apps";

export type WindowProps = Record<string, unknown> & { path?: string };

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  props: WindowProps;
};

type WindowStore = {
  windows: WindowState[];
  activeId: string | null;
  zTop: number;
  open: (appId: AppId, opts?: { props?: WindowProps; title?: string }) => void;
  close: (id: string) => void;
  closeAll: () => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setBounds: (id: string, b: Partial<Pick<WindowState, "x" | "y" | "w" | "h">>) => void;
  setTitle: (id: string, title: string) => void;
};

// Workspace = viewport minus top bar (32px) and dock (72px) on desktop
export const TOPBAR_H = 32;
export const DOCK_W = 72;

let counter = 0;

export const useWindows = create<WindowStore>((set, get) => ({
  windows: [],
  activeId: null,
  zTop: 10,

  open: (appId, opts = {}) => {
    const meta = apps[appId];
    const { windows } = get();
    const existing = windows.find(
      (w) => w.appId === appId && (meta.singleton || (opts.props?.path && w.props.path === opts.props.path)),
    );
    if (existing) {
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === existing.id
            ? { ...w, minimized: false, z: s.zTop + 1, props: { ...w.props, ...opts.props }, title: opts.title ?? w.title }
            : w,
        ),
        activeId: existing.id,
        zTop: s.zTop + 1,
      }));
      return;
    }

    const areaW = typeof window === "undefined" ? 1280 : window.innerWidth - DOCK_W;
    const areaH = typeof window === "undefined" ? 800 : window.innerHeight - TOPBAR_H;
    const w = Math.min(meta.size.w, areaW - 24);
    const h = Math.min(meta.size.h, areaH - 24);
    const offset = (windows.length % 6) * 28;
    const x = Math.max(8, Math.round((areaW - w) / 2) + offset - 56);
    const y = Math.max(8, Math.round((areaH - h) / 2) + offset - 56);
    const id = `${appId}-${++counter}`;

    set((s) => ({
      windows: [
        ...s.windows,
        { id, appId, title: opts.title ?? meta.title, x, y, w, h, z: s.zTop + 1, minimized: false, maximized: false, props: opts.props ?? {} },
      ],
      activeId: id,
      zTop: s.zTop + 1,
    }));
  },

  close: (id) =>
    set((s) => {
      const windows = s.windows.filter((w) => w.id !== id);
      const next = [...windows].filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
      return { windows, activeId: s.activeId === id ? next?.id ?? null : s.activeId };
    }),

  closeAll: () => set({ windows: [], activeId: null }),

  focus: (id) =>
    set((s) => {
      if (s.activeId === id && s.windows.find((w) => w.id === id)?.z === s.zTop) return s;
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, z: s.zTop + 1, minimized: false } : w)),
        activeId: id,
        zTop: s.zTop + 1,
      };
    }),

  minimize: (id) =>
    set((s) => {
      const windows = s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w));
      const next = windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
      return { windows, activeId: next?.id ?? null };
    }),

  toggleMaximize: (id) =>
    set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) })),

  setBounds: (id, b) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, ...b } : w)) })),

  setTitle: (id, title) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, title } : w)) })),
}));
