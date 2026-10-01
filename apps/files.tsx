"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { LuArrowUp, LuBriefcase, LuChevronLeft, LuChevronRight, LuFileAudio, LuFileText, LuFolder, LuHome, LuMusic, LuFile, LuFolderOpen } from "react-icons/lu";
import { getNode, HOME, joinPath, normalize, prettyPath, type FsNode } from "@/lib/fs";
import { openPath } from "@/lib/open";
import { useWindows } from "@/store/windows";
import type { AppProps } from "@/os/app-view";

const places = [
  { label: "Home", path: HOME, icon: LuHome },
  { label: "Projects", path: `${HOME}/projects`, icon: LuFolderOpen },
  { label: "Experience", path: `${HOME}/experience`, icon: LuBriefcase },
  { label: "Music", path: `${HOME}/music`, icon: LuMusic },
];

function NodeIcon({ node, size = 40 }: { node: FsNode; size?: number }) {
  if (node.type === "dir") return <LuFolder size={size} strokeWidth={1.3} className="text-[#b09a78]" />;
  if (node.kind === "pdf") return <LuFile size={size} strokeWidth={1.3} className="text-[#c96b5b]" />;
  if (node.kind === "audio") return <LuFileAudio size={size} strokeWidth={1.3} className="text-[#b07ab8]" />;
  return <LuFileText size={size} strokeWidth={1.3} className="text-bone" />;
}

export default function Files({ windowId, props }: AppProps) {
  const [stack, setStack] = useState<string[]>([typeof props.path === "string" ? props.path : HOME]);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const path = stack[pos];
  const dir = getNode(path);

  // External "open folder" calls focus this window with a new path
  useEffect(() => {
    if (typeof props.path === "string" && props.path !== stack[pos]) go(props.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.path]);

  useEffect(() => {
    useWindows.getState().setTitle(windowId, `${prettyPath(path) === "~" ? "Home" : path.split("/").pop()} — Files`);
  }, [path, windowId]);

  function go(p: string) {
    setStack((s) => [...s.slice(0, pos + 1), p]);
    setPos((i) => i + 1);
    setSelected(null);
  }

  const activate = (node: FsNode) => {
    const p = joinPath(path, node.name);
    if (node.type === "dir") go(p);
    else openPath(p, node);
  };

  const crumbs = path.split("/").filter(Boolean);
  const items = dir?.type === "dir" ? dir.children.filter((c) => showHidden || !c.hidden) : [];

  return (
    <div className="flex h-full bg-ash-900 text-sm text-bone">
      <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-black/50 bg-[#0f0e0e] p-2 sm:flex">
        {places.map(({ label, path: p, icon: Icon }) => (
          <button
            key={p}
            onClick={() => go(p)}
            className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5", path === p && "bg-accent/25 text-parchment")}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
        <div className="flex-1" />
        <label className="flex items-center gap-2 px-3 py-2 text-xs text-ash-400">
          <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} /> Show hidden
        </label>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5 border-b border-black/50 p-2">
          <button disabled={pos === 0} onClick={() => setPos((i) => i - 1)} className="rounded-md p-1.5 hover:bg-white/10 disabled:opacity-30" aria-label="Back">
            <LuChevronLeft size={16} />
          </button>
          <button disabled={pos === stack.length - 1} onClick={() => setPos((i) => i + 1)} className="rounded-md p-1.5 hover:bg-white/10 disabled:opacity-30" aria-label="Forward">
            <LuChevronRight size={16} />
          </button>
          <button disabled={path === "/"} onClick={() => go(normalize(path, ".."))} className="rounded-md p-1.5 hover:bg-white/10 disabled:opacity-30" aria-label="Up">
            <LuArrowUp size={16} />
          </button>
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-lg bg-black/40 px-2 py-1">
            <button onClick={() => go("/")} className="rounded px-1.5 py-0.5 text-ash-400 hover:bg-white/10">/</button>
            {crumbs.map((c, i) => (
              <button
                key={i}
                onClick={() => go("/" + crumbs.slice(0, i + 1).join("/"))}
                className={clsx("whitespace-nowrap rounded px-1.5 py-0.5 hover:bg-white/10", i === crumbs.length - 1 ? "font-bold text-parchment" : "text-ash-300")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2 overflow-y-auto p-4" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          {items.map((node) => (
            <button
              key={node.name}
              onClick={() => setSelected(node.name)}
              onDoubleClick={() => activate(node)}
              onKeyDown={(e) => e.key === "Enter" && activate(node)}
              className={clsx(
                "flex flex-col items-center gap-2 rounded-lg border p-2 text-center outline-none transition",
                selected === node.name ? "border-accent/60 bg-accent/20" : "border-transparent hover:bg-white/5",
              )}
            >
              <NodeIcon node={node} />
              <span className="line-clamp-2 break-all text-xs">{node.name}</span>
            </button>
          ))}
          {!items.length && <p className="col-span-full mt-10 text-center text-ash-500">This folder is as empty as the void.</p>}
        </div>
        <div className="border-t border-black/50 px-4 py-1.5 text-xs text-ash-500">
          {items.length} items · double-click to open
        </div>
      </div>
    </div>
  );
}
