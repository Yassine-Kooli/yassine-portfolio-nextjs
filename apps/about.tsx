"use client";

import Image from "next/image";
import { LuBriefcase, LuDownload, LuExternalLink, LuFolderOpen, LuMail, LuMapPin, LuTerminal } from "react-icons/lu";
import { experiencesData, profile, projectsData } from "@/lib/data";
import { HOME } from "@/lib/fs";
import { openPath } from "@/lib/open";
import { useWindows } from "@/store/windows";

export default function About() {
  const { open } = useWindows.getState();
  return (
    <div className="h-full overflow-y-auto bg-crypt text-bone">
      <div className="relative overflow-hidden border-b border-black/60 px-8 pb-8 pt-10">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 0%, rgb(var(--accent) / .25), transparent 60%)" }} />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-accent/60 shadow-[0_0_40px_rgb(var(--accent)/.3)]">
            <Image src={profile.avatar} alt={profile.name} fill sizes="128px" className="object-cover grayscale-[60%]" />
          </div>
          <div>
            <h1 className="font-goth text-5xl leading-none text-parchment">{profile.name}</h1>
            <p className="mt-2 font-display text-sm tracking-[0.25em] text-accent">{profile.role.toUpperCase()}</p>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ash-300 sm:justify-start">
              <LuMapPin size={14} /> {profile.location}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-black/60 text-center">
        {[
          [profile.yearsOfExperience, "years forging code"],
          [`${projectsData.length}`, "featured projects"],
          ["10+", "freelance apps shipped"],
        ].map(([n, l]) => (
          <div key={l} className="border-r border-black/60 px-2 py-4 last:border-r-0">
            <div className="font-display text-2xl font-semibold text-parchment">{n}</div>
            <div className="text-xs text-ash-400">{l}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4 px-8 py-6 text-[15px] leading-relaxed text-ash-300">
        <p className="text-bone">{profile.tagline}</p>
        {profile.bio.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
      </div>

      <div className="px-8 pb-6">
        <h2 className="mb-3 font-display text-sm tracking-[0.2em] text-accent">CURRENTLY</h2>
        <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/30 p-4">
          <LuBriefcase className="mt-1 text-ash-400" />
          <div>
            <div className="font-bold text-parchment">
              {experiencesData[0].title} · {experiencesData[0].location}
            </div>
            <div className="text-xs text-ash-500">{experiencesData[0].date}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-8 pb-8">
        <Btn primary onClick={() => openPath(`${HOME}/CV.pdf`)} icon={LuDownload}>Read my CV</Btn>
        <Btn onClick={() => openPath(`${HOME}/projects`)} icon={LuFolderOpen}>Projects</Btn>
        <Btn onClick={() => open("mail")} icon={LuMail}>Contact</Btn>
        <Btn onClick={() => open("terminal")} icon={LuTerminal}>Terminal</Btn>
        {profile.socials.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm transition hover:border-accent/60 hover:bg-white/5">
            <LuExternalLink size={14} /> {s.name}
          </a>
        ))}
      </div>
    </div>
  );
}

function Btn({ children, onClick, icon: Icon, primary }: { children: React.ReactNode; onClick: () => void; icon: React.ComponentType<{ size?: number }>; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={
        primary
          ? "flex items-center gap-2 rounded-lg bg-accent/85 px-3.5 py-2 text-sm text-parchment transition hover:bg-accent"
          : "flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm transition hover:border-accent/60 hover:bg-white/5"
      }
    >
      <Icon size={14} /> {children}
    </button>
  );
}
