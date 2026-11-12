"use client";

import { useState } from "react";
import clsx from "clsx";
import { LuInfo, LuMonitor } from "react-icons/lu";
import { accents, useSystem, type AccentId } from "@/store/system";
import Wallpaper, { wallpapers } from "@/os/wallpaper";
import type { AppProps } from "@/os/app-view";

const tabs = [
  { id: "appearance", label: "Appearance", icon: LuMonitor },
  { id: "about", label: "About", icon: LuInfo },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function Settings({ props }: AppProps) {
  const [tab, setTab] = useState<Tab>((props.tab as Tab) ?? "appearance");
  const sys = useSystem();

  return (
    <div className="flex h-full bg-ash-900 text-sm text-bone">
      <aside className="w-48 shrink-0 space-y-0.5 border-r border-white/5 bg-crypt p-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5", tab === id && "bg-accent/25 text-parchment")}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </aside>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === "appearance" && (
          <>
            <Section title="Wallpaper">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {wallpapers.map((w) => (
                  <button key={w.id} onClick={() => sys.set({ wallpaper: w.id })} className="text-left">
                    <div
                      className={clsx(
                        "relative aspect-video overflow-hidden rounded-lg border-2 transition",
                        sys.wallpaper === w.id ? "border-accent" : "border-transparent hover:border-ash-600",
                      )}
                    >
                      <Wallpaper id={w.id} />
                    </div>
                    <div className="mt-1.5 text-xs text-ash-300">{w.label}</div>
                  </button>
                ))}
              </div>
            </Section>
            <Section title="Accent">
              <div className="flex flex-wrap gap-3">
                {(Object.keys(accents) as AccentId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => sys.set({ accent: id })}
                    className={clsx("flex items-center gap-2 rounded-full border px-3 py-1.5 transition", sys.accent === id ? "border-bone" : "border-white/10 hover:border-white/30")}
                  >
                    <span className="h-4 w-4 rounded-full" style={{ background: `rgb(${accents[id].rgb})` }} />
                    {accents[id].label}
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {tab === "about" && (
          <div className="flex flex-col items-center pt-6 text-center">
            <div className="font-display text-4xl font-semibold tracking-tight text-parchment">YassineOS</div>
            <div className="mt-1 text-sm text-accent">Version 1.0</div>
            <p className="mt-4 max-w-sm text-xs text-ash-400">
              A desktop-style portfolio. Read it like a CV, or explore it like a workspace.
            </p>
            <dl className="mt-8 grid w-full max-w-sm grid-cols-2 gap-y-2 text-left">
              {[
                ["Framework", "Next.js 16 · React 18"],
                ["Language", "TypeScript"],
                ["Styling", "Tailwind CSS"],
                ["Windowing", "react-rnd · Zustand"],
                ["Motion", "Framer Motion"],
                ["Contact form", "Resend"],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ash-500">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">{title}</h2>
      {children}
    </section>
  );
}
