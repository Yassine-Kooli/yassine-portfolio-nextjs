"use client";

import Image from "next/image";
import { LuBriefcase, LuBarChart3, LuDownload, LuExternalLink, LuGithub, LuGraduationCap, LuLinkedin, LuMail, LuMapPin, LuTerminal } from "react-icons/lu";
import { educationData, experiencesData, languagesData, profile, projectsData, skillsData } from "@/lib/data";
import { HOME } from "@/lib/fs";
import { openPath } from "@/lib/open";
import { useWindows } from "@/store/windows";

const CORE_SKILLS = ["Analytics & BI", "Databases", "Data integration & automation", "Visualisation"] as const;
const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  GitHub: LuGithub,
  LinkedIn: LuLinkedin,
};

export default function About() {
  const { open } = useWindows.getState();

  return (
    <div className="h-full overflow-y-auto bg-crypt text-bone">
      {/* Hero */}
      <header className="border-b border-white/5 px-6 pb-8 pt-10 sm:px-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image src={profile.avatar} alt={profile.name} fill sizes="96px" className="object-cover" priority />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{profile.role}</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">{profile.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ash-300">
              <LuMapPin size={14} /> {profile.location}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-parchment">{profile.tagline}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Btn primary onClick={() => openPath(`${HOME}/CV.pdf`)} icon={LuDownload}>Download CV</Btn>
          <Btn onClick={() => open("mail")} icon={LuMail}>Contact</Btn>
          <Btn onClick={() => open("dashboard")} icon={LuBarChart3}>BI dashboard</Btn>
          <Btn onClick={() => open("terminal")} icon={LuTerminal}>Terminal</Btn>
          {profile.socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.name] ?? LuExternalLink;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm transition hover:border-accent/60 hover:bg-white/5"
              >
                <Icon size={14} /> {s.name}
              </a>
            );
          })}
        </div>
      </header>

      {/* Key figures (all from the CV) */}
      <dl className="grid grid-cols-3 border-b border-white/5 text-center">
        {[
          [profile.yearsOfExperience, "years building data-driven apps"],
          [`${projectsData.length}`, "production products"],
          [`${educationData.length}`, "degrees (BI and software engineering)"],
        ].map(([n, l]) => (
          <div key={l} className="flex flex-col-reverse border-r border-white/5 px-2 py-5 last:border-r-0">
            <dt className="text-xs text-ash-400">{l}</dt>
            <dd className="font-display text-2xl font-semibold text-parchment">{n}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          {/* Profile */}
          <section className="space-y-4 text-[15px] leading-relaxed text-ash-300">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">Profile</h2>
            {profile.bio.map((b, i) => (
              <p key={i}>{b}</p>
            ))}
          </section>

          {/* Experience */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">Experience</h2>
            <ol className="space-y-6 border-l border-white/10 pl-5">
              {experiencesData.map((e) => (
                <li key={e.slug} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                  <div className="flex items-center gap-2 font-semibold text-parchment">
                    <LuBriefcase size={14} className="text-accent" /> {e.title}
                  </div>
                  <div className="text-xs text-ash-400">
                    {e.company} · {e.location} · {e.date}
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ash-300">
                    {e.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ash-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          {/* Projects */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">Selected production projects</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {projectsData.map((p) => {
                const Tag = p.link ? "a" : "div";
                const linkProps = p.link ? { href: p.link, target: "_blank", rel: "noreferrer" } : {};
                return (
                <Tag
                  key={p.slug}
                  {...linkProps}
                  className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-accent/50 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-parchment">{p.title}</span>
                    {p.link && <LuExternalLink size={13} className="text-ash-500 group-hover:text-accent" />}
                  </div>
                  <div className="mt-0.5 text-xs text-ash-400">{p.type}</div>
                  <p className="mt-2 text-sm leading-relaxed text-ash-300">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-ash-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </Tag>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">Core skills</h2>
            <div className="space-y-4">
              {CORE_SKILLS.map((group) => (
                <div key={group}>
                  <div className="mb-2 text-xs text-ash-400">{group}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsData[group].map((skill) => (
                      <span key={skill} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-bone">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">Education</h2>
            <div className="space-y-4">
              {educationData.map((e) => (
                <div key={e.slug} className="flex gap-2.5">
                  <LuGraduationCap size={15} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <div className="text-sm font-semibold text-parchment">{e.title}</div>
                    <div className="text-xs text-ash-400">{e.school}</div>
                    <div className="text-xs text-ash-500">{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ash-400">Languages</h2>
            <ul className="space-y-1.5 text-sm">
              {languagesData.map((l) => (
                <li key={l.name} className="flex justify-between gap-3">
                  <span className="text-parchment">{l.name}</span>
                  <span className="text-right text-xs text-ash-400">
                    {l.level}
                    {"note" in l ? ` · ${l.note}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
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
          ? "flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
          : "flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2 text-sm transition hover:border-accent/60 hover:bg-white/5"
      }
    >
      <Icon size={14} /> {children}
    </button>
  );
}
