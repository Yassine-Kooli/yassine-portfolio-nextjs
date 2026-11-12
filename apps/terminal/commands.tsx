import type { ReactNode } from "react";
import { educationData, experiencesData, languagesData, profile, projectsData, skillsData } from "@/lib/data";
import { getNode, HOME, normalize, prettyPath, type FsNode } from "@/lib/fs";
import { openPath } from "@/lib/open";
import { apps, type AppId } from "@/lib/apps";
import { useSystem, type WallpaperId } from "@/store/system";
import { useWindows } from "@/store/windows";
import { wallpapers } from "@/os/wallpaper";

export type Ctx = {
  cwd: string;
  setCwd: (p: string) => void;
  clear: () => void;
  exit: () => void;
  history: string[];
};

type Command = { desc: string; usage?: string; hidden?: boolean; run: (args: string[], ctx: Ctx) => ReactNode };

const bootedAt = Date.now();

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-accent underline decoration-dotted underline-offset-2 hover:text-parchment">
    {children}
  </a>
);
const Dim = ({ children }: { children: ReactNode }) => <span className="text-ash-500">{children}</span>;
const H = ({ children }: { children: ReactNode }) => <div className="mt-1 font-semibold text-parchment">{children}</div>;
const Err = ({ children }: { children: ReactNode }) => <span className="text-[#e0736b]">{children}</span>;

function nodeLabel(n: FsNode) {
  if (n.type === "dir") return <span className="font-semibold text-[#8fa3bf]">{n.name}/</span>;
  if (n.kind === "pdf") return <span className="text-accent">{n.name}</span>;
  return <span className="text-bone">{n.name}</span>;
}

const commands: Record<string, Command> = {
  help: {
    desc: "List available commands",
    run: () => (
      <div>
        <div className="mb-1 text-ash-400">Available commands:</div>
        <div className="grid grid-cols-[auto_1fr] gap-x-6">
          {Object.entries(commands)
            .filter(([, c]) => !c.hidden)
            .map(([name, c]) => (
              <div key={name} className="contents">
                <span className="text-accent">{c.usage ?? name}</span>
                <span className="text-ash-300">{c.desc}</span>
              </div>
            ))}
        </div>
        <div className="mt-2 text-ash-500">Tab completes, ↑/↓ walks history, Ctrl+L clears.</div>
      </div>
    ),
  },
  whoami: { desc: "Who this is", run: () => `${profile.name} — ${profile.role}, ${profile.location}.` },
  about: {
    desc: "Professional summary",
    run: () => (
      <div className="space-y-2">
        {profile.bio.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
        <Dim>Tip: `open about` shows the full profile.</Dim>
      </div>
    ),
  },
  neofetch: {
    desc: "Summary of this portfolio",
    run: () => {
      const mins = Math.floor((Date.now() - bootedAt) / 60000);
      const rows: [string, string][] = [
        ["Name", profile.name],
        ["Role", profile.role],
        ["Location", profile.location],
        ["Experience", `${profile.yearsOfExperience} years`],
        ["Focus", "SQL · data modelling · dashboards · reporting"],
        ["Stack", "Laravel · Filament · Livewire · PostgreSQL · MySQL"],
        ["Session", mins < 1 ? "just started" : `${mins} min${mins > 1 ? "s" : ""}`],
      ];
      return (
        <div>
          {rows.map(([k, v]) => (
            <div key={k}>
              <span className="inline-block w-24 text-accent">{k}</span>
              {v}
            </div>
          ))}
        </div>
      );
    },
  },
  ls: {
    desc: "List directory contents",
    usage: "ls [-a] [dir]",
    run: (args, { cwd }) => {
      const all = args.includes("-a") || args.includes("-la");
      const target = normalize(cwd, args.find((a) => !a.startsWith("-")));
      const node = getNode(target);
      if (!node) return <Err>ls: cannot access &apos;{args.find((a) => !a.startsWith("-"))}&apos;: No such file or directory</Err>;
      if (node.type === "file") return nodeLabel(node);
      const kids = node.children.filter((c) => all || !c.hidden);
      return (
        <div className="flex flex-wrap gap-x-6">
          {kids.map((c) => (
            <span key={c.name}>{nodeLabel(c)}</span>
          ))}
        </div>
      );
    },
  },
  cd: {
    desc: "Change directory",
    usage: "cd [dir]",
    run: (args, { cwd, setCwd }) => {
      const target = normalize(cwd, args[0]);
      const node = getNode(target);
      if (!node) return <Err>cd: no such file or directory: {args[0]}</Err>;
      if (node.type !== "dir") return <Err>cd: not a directory: {args[0]}</Err>;
      setCwd(target);
      return null;
    },
  },
  pwd: { desc: "Print working directory", run: (_, { cwd }) => cwd },
  cat: {
    desc: "Print a file",
    usage: "cat <file>",
    run: (args, { cwd }) => {
      if (!args[0]) return <Err>cat: missing file operand</Err>;
      const node = getNode(normalize(cwd, args[0]));
      if (!node) return <Err>cat: {args[0]}: No such file or directory</Err>;
      if (node.type === "dir") return <Err>cat: {args[0]}: Is a directory</Err>;
      if (node.kind !== "text") return <Dim>cat: {args[0]}: binary file — try `open {args[0]}`</Dim>;
      return <div className="whitespace-pre-wrap">{node.content}</div>;
    },
  },
  open: {
    desc: "Open a file, folder or app",
    usage: "open <file|app>",
    run: (args, { cwd }) => {
      const arg = args[0];
      if (!arg) return <Err>open: what shall I open? Try `open dashboard` or `open projects`.</Err>;
      if (arg in apps) {
        useWindows.getState().open(arg as AppId);
        return <Dim>Opening {apps[arg as AppId].title}…</Dim>;
      }
      const path = normalize(cwd, arg);
      if (openPath(path)) return <Dim>Opening {prettyPath(path)}…</Dim>;
      return <Err>open: {arg}: No such file, folder or app. Apps: {Object.keys(apps).join(", ")}</Err>;
    },
  },
  dashboard: {
    desc: "Open the BI dashboard (sample data)",
    run: () => {
      useWindows.getState().open("dashboard");
      return <Dim>Opening BI Dashboard… (illustrative sample data)</Dim>;
    },
  },
  projects: {
    desc: "Production projects",
    run: () => (
      <div className="space-y-2">
        {projectsData.map((p) => (
          <div key={p.slug}>
            <span className="font-semibold text-parchment">{p.title}</span> <Dim>[{p.type}]</Dim>
            <div className="text-ash-300">{p.description}</div>
            <div className="text-accent/90">{p.tags.join(" · ")}</div>
          </div>
        ))}
        <Dim>Details: `cat ~/projects/&lt;name&gt;.md` or `open projects`.</Dim>
      </div>
    ),
  },
  experience: {
    desc: "Work experience",
    run: () => (
      <div className="space-y-2">
        {experiencesData.map((e) => (
          <div key={e.slug}>
            <span className="font-semibold text-parchment">{e.title}</span> — {e.company}, {e.location} <Dim>({e.date})</Dim>
          </div>
        ))}
        <Dim>More: `ls ~/experience`.</Dim>
      </div>
    ),
  },
  education: {
    desc: "Degrees and training",
    run: () => (
      <div className="space-y-2">
        {educationData.map((e) => (
          <div key={e.slug}>
            <span className="font-semibold text-parchment">{e.title}</span>
            <div className="text-ash-300">
              {e.school} <Dim>({e.date})</Dim>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  skills: {
    desc: "Technical skills",
    run: () => (
      <div>
        {Object.entries(skillsData).map(([group, items]) => (
          <div key={group}>
            <H>{group}</H>
            <div className="text-ash-300">{items.join(" · ")}</div>
          </div>
        ))}
      </div>
    ),
  },
  languages: {
    desc: "Spoken languages",
    run: () => (
      <div>
        {languagesData.map((l) => (
          <div key={l.name}>
            <span className="font-semibold text-parchment">{l.name}</span>: {l.level}
            {"note" in l && <Dim> ({l.note})</Dim>}
          </div>
        ))}
      </div>
    ),
  },
  contact: {
    desc: "How to reach me",
    run: () => (
      <div>
        <div>
          Email: <A href={`mailto:${profile.email}`}>{profile.email}</A>
        </div>
        {profile.socials.map((s) => (
          <div key={s.name}>
            {s.name}: <A href={s.url}>{s.url}</A>
          </div>
        ))}
        <Dim>Or type `mail` to send a message.</Dim>
      </div>
    ),
  },
  mail: {
    desc: "Open the contact form",
    run: () => {
      useWindows.getState().open("mail");
      return <Dim>Opening contact form…</Dim>;
    },
  },
  cv: {
    desc: "Open my CV",
    run: () => {
      openPath(`${HOME}/CV.pdf`);
      return (
        <Dim>
          Opening CV.pdf… (or <A href={profile.cv}>download it</A>)
        </Dim>
      );
    },
  },
  wallpaper: {
    desc: "Change the wallpaper",
    usage: "wallpaper [name]",
    run: (args) => {
      const id = args[0] as WallpaperId;
      if (!id || !wallpapers.some((w) => w.id === id)) return <div>Usage: wallpaper [{wallpapers.map((w) => w.id).join("|")}]</div>;
      useSystem.getState().set({ wallpaper: id });
      return <Dim>Wallpaper set to {id}.</Dim>;
    },
  },
  echo: { desc: "Print text", usage: "echo <text>", run: (args) => args.join(" ") },
  date: { desc: "Print the date", run: () => new Date().toString() },
  history: { desc: "Command history", run: (_, { history }) => <div>{history.map((h, i) => <div key={i}><Dim>{String(i + 1).padStart(3)}</Dim>  {h}</div>)}</div> },
  clear: { desc: "Clear the screen", run: (_, { clear }) => (clear(), null) },
  exit: { desc: "Close the terminal", run: (_, { exit }) => (exit(), null) },
};

function tokenize(input: string) {
  return Array.from(input.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g), (m) => m[1] ?? m[2] ?? m[3]);
}

export const commandNames = Object.keys(commands);

export function run(input: string, ctx: Ctx): ReactNode {
  const [name, ...args] = tokenize(input);
  if (!name) return null;
  const cmd = commands[name.toLowerCase()];
  if (!cmd) return <Err>ysh: command not found: {name}. Type `help`.</Err>;
  return cmd.run(args, ctx);
}

/** Returns the completed input, or a list of candidates to print. */
export function complete(input: string, cwd: string): { value?: string; options?: string[] } {
  const parts = input.split(" ");
  if (parts.length === 1) {
    const matches = commandNames.filter((c) => !commands[c].hidden && c.startsWith(parts[0]));
    if (matches.length === 1) return { value: matches[0] + " " };
    return matches.length ? { options: matches } : {};
  }
  const last = parts[parts.length - 1];
  const slash = last.lastIndexOf("/");
  const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
  const prefix = slash >= 0 ? last.slice(slash + 1) : last;
  const dir = getNode(normalize(cwd, dirPart || "."));
  if (!dir || dir.type !== "dir") return {};
  const matches = dir.children.filter((c) => c.name.startsWith(prefix) && (prefix.startsWith(".") || !c.hidden));
  if (matches.length === 1) {
    const m = matches[0];
    parts[parts.length - 1] = dirPart + m.name + (m.type === "dir" ? "/" : "");
    return { value: parts.join(" ") };
  }
  return matches.length ? { options: matches.map((m) => m.name + (m.type === "dir" ? "/" : "")) } : {};
}
