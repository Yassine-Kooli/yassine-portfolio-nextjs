"use client";

import { LuDownload, LuExternalLink } from "react-icons/lu";
import { profile } from "@/lib/data";
import type { AppProps } from "@/os/app-view";

export default function PdfViewer({ props }: AppProps) {
  const src = typeof props.src === "string" ? props.src : profile.cv;
  return (
    <div className="flex h-full flex-col bg-ash-900">
      <div className="flex items-center justify-end gap-2 border-b border-black/50 px-3 py-2 text-sm">
        <a href={src} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-bone transition hover:bg-white/10">
          <LuExternalLink size={14} /> Open in tab
        </a>
        <a href={src} download className="flex items-center gap-2 rounded-lg bg-accent/80 px-3 py-1.5 text-parchment transition hover:bg-accent">
          <LuDownload size={14} /> Download
        </a>
      </div>
      <iframe src={`${src}#view=FitH`} title="Document" className="w-full flex-1 bg-ash-800" />
    </div>
  );
}
