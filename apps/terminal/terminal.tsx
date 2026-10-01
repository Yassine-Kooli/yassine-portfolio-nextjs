"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { HOME, prettyPath } from "@/lib/fs";
import { profile } from "@/lib/data";
import { useSystem } from "@/store/system";
import { useWindows } from "@/store/windows";
import type { AppProps } from "@/os/app-view";
import { complete, run } from "@/apps/terminal/commands";

type Line = { id: number; node: ReactNode };

const Prompt = ({ cwd }: { cwd: string }) => (
  <span className="shrink-0">
    <span className="font-bold text-accent">{profile.handle}@yassineos</span>
    <span className="text-ash-400">:</span>
    <span className="font-bold text-[#8aa6b8]">{prettyPath(cwd)}</span>
    <span className="text-ash-400">$&nbsp;</span>
  </span>
);

const banner = (
  <div className="mb-2">
    <div className="font-goth text-4xl leading-tight text-parchment">YassineOS</div>
    <div className="text-ash-400">
      ysh 1.0 — type <span className="text-accent">help</span> to see what lurks here. Try <span className="text-accent">neofetch</span>.
    </div>
  </div>
);

let lineId = 0;

export default function Terminal({ windowId, active, props }: AppProps) {
  const crt = useSystem((s) => s.crt);
  const [lines, setLines] = useState<Line[]>([{ id: ++lineId, node: banner }]);
  const [cwd, setCwd] = useState<string>(typeof props.path === "string" ? props.path : HOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus({ preventScroll: true });
  }, [active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const push = (...nodes: ReactNode[]) => setLines((l) => [...l, ...nodes.map((node) => ({ id: ++lineId, node }))]);

  const submit = () => {
    const value = input;
    const echo = (
      <div className="flex">
        <Prompt cwd={cwd} />
        <span className="whitespace-pre-wrap break-all">{value}</span>
      </div>
    );
    setInput("");
    setCursor(null);
    if (!value.trim()) return push(echo);
    const nextHistory = [...history, value];
    setHistory(nextHistory);
    let cleared = false;
    const out = run(value, {
      cwd,
      setCwd,
      history: nextHistory,
      clear: () => {
        cleared = true;
        setLines([]);
      },
      exit: () => useWindows.getState().close(windowId),
    });
    if (cleared) return;
    push(echo, ...(out !== null && out !== undefined ? [<div key="o" className="mb-1">{out}</div>] : []));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") return submit();
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const next = e.key === "ArrowUp" ? Math.max(0, (cursor ?? history.length) - 1) : (cursor ?? history.length) + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput("");
      } else {
        setCursor(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const { value, options } = complete(input, cwd);
      if (value !== undefined) setInput(value);
      else if (options)
        push(
          <div className="flex">
            <Prompt cwd={cwd} />
            {input}
          </div>,
          <div className="flex flex-wrap gap-x-6 text-ash-300">{options.map((o) => <span key={o}>{o}</span>)}</div>,
        );
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      return setLines([]);
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      if (window.getSelection()?.toString()) return; // allow copying
      e.preventDefault();
      push(
        <div className="flex">
          <Prompt cwd={cwd} />
          {input}^C
        </div>,
      );
      setInput("");
    }
  };

  return (
    <div
      ref={scrollRef}
      className={clsx("h-full overflow-y-auto bg-[#0a0909] p-3 font-mono text-[13px] leading-relaxed text-bone", crt && "crt")}
      onMouseUp={() => !window.getSelection()?.toString() && inputRef.current?.focus({ preventScroll: true })}
    >
      {lines.map((l) => (
        <div key={l.id}>{l.node}</div>
      ))}
      <div className="flex">
        <Prompt cwd={cwd} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-bone caret-accent outline-none"
        />
      </div>
    </div>
  );
}
