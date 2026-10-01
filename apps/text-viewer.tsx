"use client";

import { Fragment, type ReactNode } from "react";
import { getNode } from "@/lib/fs";
import type { AppProps } from "@/os/app-view";

// Tiny markdown subset: headings, quotes, bullets, inline `code` and links.
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|https?:\/\/\S+)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[0.9em] text-accent">{part.slice(1, -1)}</code>;
    if (/^https?:\/\//.test(part))
      return <a key={i} href={part} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">{part}</a>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="space-y-2 leading-relaxed">
      {source.split("\n").map((line, i) => {
        if (line.startsWith("# ")) return <h1 key={i} className="mb-3 font-display text-2xl font-semibold tracking-wide text-parchment">{inline(line.slice(2))}</h1>;
        if (line.startsWith("## ")) return <h2 key={i} className="mt-5 font-display text-base font-semibold tracking-wider text-accent">{inline(line.slice(3))}</h2>;
        if (line.startsWith("> ")) return <p key={i} className="border-l-2 border-accent/60 pl-3 italic text-ash-300">{inline(line.slice(2))}</p>;
        if (line.startsWith("- ")) return <p key={i} className="pl-4 before:-ml-4 before:mr-2 before:text-accent before:content-['✝']">{inline(line.slice(2))}</p>;
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{inline(line)}</p>;
      })}
    </div>
  );
}

export default function TextViewer({ props }: AppProps) {
  const node = typeof props.path === "string" ? getNode(props.path) : null;
  const content = node?.type === "file" ? node.content ?? "" : "File not found.";
  return (
    <div className="flex h-full flex-col bg-[#11100f] text-[15px] text-bone">
      <div className="flex items-center justify-between border-b border-black/50 px-4 py-1.5 font-mono text-xs text-ash-500">
        <span>{props.path as string}</span>
        <span>read-only</span>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-2xl">
          <Markdown source={content} />
        </div>
      </div>
    </div>
  );
}
