"use client";

import { useState } from "react";
import clsx from "clsx";
import { LuFileText, LuFolder } from "react-icons/lu";
import type { IconType } from "react-icons";
import { HOME } from "@/lib/fs";
import { openPath } from "@/lib/open";
import type { AppId } from "@/lib/apps";
import { useWindows } from "@/store/windows";
import AppIcon from "@/os/app-icon";

type Item = { key: string; label: string; app?: AppId; icon?: IconType; open: () => void };

const items: Item[] = [
  { key: "about", label: "About Me", app: "about", open: () => useWindows.getState().open("about") },
  { key: "projects", label: "Projects", icon: LuFolder, open: () => openPath(`${HOME}/projects`) },
  { key: "cv", label: "CV.pdf", icon: LuFileText, open: () => openPath(`${HOME}/CV.pdf`) },
  { key: "terminal", label: "Terminal", app: "terminal", open: () => useWindows.getState().open("terminal") },
  { key: "music", label: "Music", app: "music", open: () => useWindows.getState().open("music") },
  { key: "mail", label: "Contact", app: "mail", open: () => useWindows.getState().open("mail") },
];

export default function DesktopIcons() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="absolute left-4 top-4 grid grid-flow-row gap-2" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
      {items.map(({ key, label, app, icon: Icon, open }) => (
        <button
          key={key}
          onClick={() => setSelected(key)}
          onDoubleClick={open}
          onKeyDown={(e) => e.key === "Enter" && open()}
          className={clsx(
            "flex w-24 flex-col items-center gap-1.5 rounded-lg border p-2 outline-none transition",
            selected === key ? "border-accent/60 bg-accent/20" : "border-transparent hover:bg-white/5",
          )}
        >
          {app ? (
            <AppIcon id={app} size={48} />
          ) : (
            Icon && (
              <div className="grid h-12 w-12 place-items-center text-bone drop-shadow-[0_4px_8px_rgba(0,0,0,.8)]">
                <Icon size={42} strokeWidth={1.3} />
              </div>
            )
          )}
          <span className="text-center text-xs font-bold text-parchment [text-shadow:0_1px_3px_#000]">{label}</span>
        </button>
      ))}
    </div>
  );
}
