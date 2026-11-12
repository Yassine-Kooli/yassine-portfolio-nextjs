import type { IconType } from "react-icons";
import { LuBarChart3, LuFile, LuFileText, LuFolder, LuGamepad2, LuMail, LuSettings, LuTerminal, LuUser } from "react-icons/lu";

export type AppId = "about" | "dashboard" | "arcade" | "terminal" | "files" | "text" | "pdf" | "mail" | "settings";

export type AppMeta = {
  id: AppId;
  title: string;
  icon: IconType;
  /** Tile gradient for the dock / launcher icon */
  tint: string;
  size: { w: number; h: number };
  minSize?: { w: number; h: number };
  /** Only one window at a time; re-opening focuses it */
  singleton: boolean;
  /** Listed in the dock and app launcher */
  launchable: boolean;
};

export const apps: Record<AppId, AppMeta> = {
  about: { id: "about", title: "About", icon: LuUser, tint: "from-[#2b3a55] to-[#0c1220]", size: { w: 760, h: 600 }, singleton: true, launchable: true },
  dashboard: { id: "dashboard", title: "BI Dashboard", icon: LuBarChart3, tint: "from-[#1f3d6b] to-[#0a1424]", size: { w: 900, h: 640 }, minSize: { w: 520, h: 420 }, singleton: true, launchable: true },
  arcade: { id: "arcade", title: "Arcade", icon: LuGamepad2, tint: "from-[#2b2350] to-[#0b0a1a]", size: { w: 760, h: 600 }, minSize: { w: 420, h: 460 }, singleton: true, launchable: true },
  terminal: { id: "terminal", title: "Terminal", icon: LuTerminal, tint: "from-[#262b33] to-[#0b0d10]", size: { w: 760, h: 480 }, minSize: { w: 420, h: 260 }, singleton: false, launchable: true },
  files: { id: "files", title: "Files", icon: LuFolder, tint: "from-[#2d3340] to-[#0f1216]", size: { w: 820, h: 520 }, minSize: { w: 480, h: 320 }, singleton: false, launchable: true },
  mail: { id: "mail", title: "Contact", icon: LuMail, tint: "from-[#2a3346] to-[#0d1118]", size: { w: 600, h: 540 }, singleton: true, launchable: true },
  settings: { id: "settings", title: "Settings", icon: LuSettings, tint: "from-[#2f3440] to-[#0f1115]", size: { w: 760, h: 520 }, singleton: true, launchable: true },
  text: { id: "text", title: "Text Editor", icon: LuFileText, tint: "from-[#2d3340] to-[#101216]", size: { w: 640, h: 520 }, singleton: false, launchable: false },
  pdf: { id: "pdf", title: "Document Viewer", icon: LuFile, tint: "from-[#2d3340] to-[#101216]", size: { w: 780, h: 640 }, singleton: true, launchable: false },
};

export const launchableApps = Object.values(apps).filter((a) => a.launchable);
