import type { IconType } from "react-icons";
import {
  LuBomb,
  LuFileText,
  LuFolder,
  LuGamepad2,
  LuMail,
  LuMusic,
  LuSettings,
  LuSkull,
  LuTerminal,
  LuFile,
} from "react-icons/lu";

export type AppId =
  | "about"
  | "terminal"
  | "files"
  | "text"
  | "pdf"
  | "music"
  | "mail"
  | "settings"
  | "snake"
  | "minesweeper";

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
  about: { id: "about", title: "About Me", icon: LuSkull, tint: "from-[#3a0b0b] to-[#120404]", size: { w: 760, h: 540 }, singleton: true, launchable: true },
  terminal: { id: "terminal", title: "Terminal", icon: LuTerminal, tint: "from-[#262323] to-[#0b0b0b]", size: { w: 760, h: 480 }, minSize: { w: 420, h: 260 }, singleton: false, launchable: true },
  files: { id: "files", title: "Files", icon: LuFolder, tint: "from-[#3b3226] to-[#15110c]", size: { w: 820, h: 520 }, minSize: { w: 480, h: 320 }, singleton: false, launchable: true },
  music: { id: "music", title: "Music", icon: LuMusic, tint: "from-[#4a1010] to-[#160505]", size: { w: 760, h: 600 }, minSize: { w: 420, h: 440 }, singleton: true, launchable: true },
  mail: { id: "mail", title: "Mail", icon: LuMail, tint: "from-[#2c2a24] to-[#0e0d0b]", size: { w: 600, h: 540 }, singleton: true, launchable: true },
  snake: { id: "snake", title: "Serpent", icon: LuGamepad2, tint: "from-[#1f2a1c] to-[#080b07]", size: { w: 460, h: 560 }, singleton: true, launchable: true },
  minesweeper: { id: "minesweeper", title: "Graveyard", icon: LuBomb, tint: "from-[#2b2b33] to-[#0b0b0e]", size: { w: 420, h: 540 }, singleton: true, launchable: true },
  settings: { id: "settings", title: "Settings", icon: LuSettings, tint: "from-[#2f2c2c] to-[#0f0e0e]", size: { w: 760, h: 520 }, singleton: true, launchable: true },
  text: { id: "text", title: "Text Editor", icon: LuFileText, tint: "from-[#3a3630] to-[#121110]", size: { w: 640, h: 520 }, singleton: false, launchable: false },
  pdf: { id: "pdf", title: "Document Viewer", icon: LuFile, tint: "from-[#3a1414] to-[#120606]", size: { w: 780, h: 640 }, singleton: true, launchable: false },
};

export const launchableApps = Object.values(apps).filter((a) => a.launchable);
