"use client";

import { useState } from "react";
import clsx from "clsx";
import { LuInfo, LuMonitor, LuSparkles } from "react-icons/lu";
import { accents, useSystem, type AccentId } from "@/store/system";
import Wallpaper, { wallpapers } from "@/os/wallpaper";
import type { AppProps } from "@/os/app-view";

const tabs = [
  { id: "appearance", label: "Appearance", icon: LuMonitor },
  { id: "effects", label: "Effects", icon: LuSparkles },
  { id: "about", label: "About", icon: LuInfo },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function Settings({ props }: AppProps) {
  const [tab, setTab] = useState<Tab>((props.tab as Tab) ?? "appearance");
  const sys = useSystem();

  return (
    <div className="flex h-full bg-ash-900 text-sm text-bone">
      <aside className="w-48 shrink-0 space-y-0.5 border-r border-black/50 bg-[#0f0e0e] p-2">
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
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {wallpapers.map((w) => (
                  <button key={w.id} onClick={() => sys.set({ wallpaper: w.id })} className="text-left">
                    <div
                      className={clsx(
                        "relative aspect-video overflow-hidden rounded-lg border-2 transition",
                        sys.wallpaper === w.id ? "border-accent" : "border-transparent hover:border-ash-600",
                      )}
                    >
                      <Wallpaper id={w.id} fog={false} />
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

        {tab === "effects" && (
          <Section title="Atmosphere">
            <Toggle label="Film grain" hint="A fine layer of noise over everything" value={sys.grain} onChange={(v) => sys.set({ grain: v })} />
            <Toggle label="Drifting fog" hint="Animated fog on the wallpaper" value={sys.fog} onChange={(v) => sys.set({ fog: v })} />
            <Toggle label="CRT scanlines" hint="Old-monitor lines in the Terminal" value={sys.crt} onChange={(v) => sys.set({ crt: v })} />
          </Section>
        )}

        {tab === "about" && (
          <div className="flex flex-col items-center pt-6 text-center">
            <div className="font-goth text-6xl text-parchment">YassineOS</div>
            <div className="mt-1 font-display tracking-[0.3em] text-accent">1.0 · GHOST</div>
            <dl className="mt-8 grid w-full max-w-sm grid-cols-2 gap-y-2 text-left">
              {[
                ["Kernel", "6.6.6-doom"],
                ["Desktop", "Necropolis (GNOME-ish)"],
                ["Shell", "ysh 1.0"],
                ["Built with", "Next.js · TypeScript · Tailwind"],
                ["Windowing", "react-rnd · Zustand"],
                ["Motion", "Framer Motion"],
                ["Mail", "Resend"],
                ["Music", "Spotify embed"],
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
      <h2 className="mb-3 font-display text-xs tracking-[0.25em] text-ash-400">{title.toUpperCase()}</h2>
      {children}
    </section>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="mb-2 flex w-full items-center justify-between rounded-xl bg-black/30 px-4 py-3 text-left">
      <span>
        <span className="block">{label}</span>
        <span className="block text-xs text-ash-500">{hint}</span>
      </span>
      <span className={clsx("relative h-6 w-11 rounded-full transition", value ? "bg-accent" : "bg-ash-700")}>
        <span className={clsx("absolute top-1 h-4 w-4 rounded-full bg-parchment transition-all", value ? "left-6" : "left-1")} />
      </span>
    </button>
  );
}
