import type { ReactNode } from "react";
import { experiencesData, profile, projectsData, skillsData } from "@/lib/data";
import { getNode, HOME, normalize, prettyPath, type FsNode } from "@/lib/fs";
import { openPath } from "@/lib/open";
import { apps, type AppId } from "@/lib/apps";
import { playlist, sections } from "@/lib/playlist";
import { useMusic } from "@/store/music";
import { useSystem, type WallpaperId } from "@/store/system";
import { useWindows } from "@/store/windows";
import { wallpapers } from "@/os/wallpaper";
import MatrixRain from "@/apps/terminal/matrix-rain";

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
const H = ({ children }: { children: ReactNode }) => <div className="mt-1 font-bold text-parchment">{children}</div>;
const Err = ({ children }: { children: ReactNode }) => <span className="text-[#d0584f]">{children}</span>;

function nodeLabel(n: FsNode) {
  if (n.type === "dir") return <span className="font-bold text-[#8aa6b8]">{n.name}/</span>;
  if (n.kind === "pdf") return <span className="text-[#c98a6b]">{n.name}</span>;
  if (n.kind === "audio") return <span className="text-[#b07ab8]">{n.name}</span>;
  return <span className="text-bone">{n.name}</span>;
}

const fortunes = [
  "Your code compiles on the first try. Something is terribly wrong.",
  "The fog will lift. The bugs will not.",
  "Every merge conflict is a small funeral.",
  "In the forest of legacy code, every tree is a god class.",
  "Deprecated, like the summer.",
  "A migration you forgot to run waits for you in production.",
  "The night is long, and the queue workers are longer.",
  "N+1 queries walk among us.",
  "He who commits on Friday shall debug on Saturday.",
];

const SKULL = String.raw`
      ______
   .-"      "-.
  /            \
 |              |
 |,  .-.  .-.  ,|
 | )(__/  \__)( |
 |/     /\     \|
 (_     ^^     _)
  \__|IIIIII|__/
   | \IIIIII/ |
   \          /
    '--------'`;

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
        <div className="mt-2 text-ash-500">Tab completes, ↑/↓ walks history, Ctrl+L clears. Some commands are hidden…</div>
      </div>
    ),
  },
  whoami: { desc: "Who is this", run: () => `${profile.handle} — ${profile.name}, ${profile.role} based in ${profile.location}.` },
  about: {
    desc: "A few words about me",
    run: () => (
      <div className="space-y-2">
        {profile.bio.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
        <Dim>Tip: `open about` shows the profile window.</Dim>
      </div>
    ),
  },
  neofetch: {
    desc: "System information",
    run: () => {
      const mins = Math.floor((Date.now() - bootedAt) / 60000);
      const rows: [string, string][] = [
        ["OS", "YassineOS 1.0 (Ghost) x86_64"],
        ["Host", profile.name],
        ["Kernel", "6.6.6-doom"],
        ["Uptime", mins < 1 ? "just risen" : `${mins} min${mins > 1 ? "s" : ""}`],
        ["Shell", "ysh 1.0"],
        ["Resolution", `${window.innerWidth}x${window.innerHeight}`],
        ["Theme", "Black Metal [dark]"],
        ["Role", profile.role],
        ["Experience", `${profile.yearsOfExperience} years`],
        ["Stack", "Laravel · Filament · Livewire · Alpine · Tailwind"],
        ["Location", profile.location],
      ];
      return (
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <pre className="text-accent">{SKULL}</pre>
          <div className="pt-3">
            <div>
              <span className="font-bold text-accent">{profile.handle}</span>@<span className="font-bold text-accent">yassineos</span>
            </div>
            <div className="text-ash-500">-----------------</div>
            {rows.map(([k, v]) => (
              <div key={k}>
                <span className="font-bold text-accent">{k}</span>: {v}
              </div>
            ))}
            <div className="mt-2 flex">
              {["#050505", "#3a0b0b", "#a01818", "#5c7840", "#c46220", "#7d7676", "#d9d1c1", "#efe8d8"].map((c) => (
                <span key={c} className="h-4 w-6" style={{ background: c }} />
              ))}
            </div>
          </div>
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
          {all && (
            <>
              <span className="font-bold text-[#8aa6b8]">./</span>
              <span className="font-bold text-[#8aa6b8]">../</span>
            </>
          )}
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
      if (!arg) return <Err>open: what shall I open? Try `open projects` or `open music`.</Err>;
      if (arg in apps) {
        useWindows.getState().open(arg as AppId);
        return <Dim>Opening {apps[arg as AppId].title}…</Dim>;
      }
      const path = normalize(cwd, arg);
      if (openPath(path)) return <Dim>Opening {prettyPath(path)}…</Dim>;
      return <Err>open: {arg}: No such file, folder or app. Apps: {Object.keys(apps).join(", ")}</Err>;
    },
  },
  projects: {
    desc: "Things I've built",
    run: () => (
      <div className="space-y-2">
        {projectsData.map((p) => (
          <div key={p.slug}>
            <span className="font-bold text-parchment">{p.title}</span> <Dim>[{p.type}]</Dim>
            <div className="text-ash-300">{p.description}</div>
            <div className="text-accent/90">{p.tags.join(" · ")}</div>
          </div>
        ))}
        <Dim>Details: `cat ~/projects/&lt;name&gt;.md` or `open projects`.</Dim>
      </div>
    ),
  },
  experience: {
    desc: "Where I've worked",
    run: () => (
      <div className="space-y-2">
        {experiencesData.map((e) => (
          <div key={e.slug}>
            <span className="font-bold text-parchment">{e.title}</span> — {e.location} <Dim>({e.date})</Dim>
          </div>
        ))}
        <Dim>More: `ls ~/experience`.</Dim>
      </div>
    ),
  },
  skills: {
    desc: "My arsenal",
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
        <Dim>Or type `mail` to send a raven.</Dim>
      </div>
    ),
  },
  mail: {
    desc: "Open the Mail app",
    run: () => {
      useWindows.getState().open("mail");
      return <Dim>The raven awaits your message…</Dim>;
    },
  },
  cv: {
    desc: "Open my résumé",
    run: () => {
      openPath(`${HOME}/CV.pdf`);
      return (
        <Dim>
          Opening CV.pdf… (or <A href={profile.cv}>download it</A>)
        </Dim>
      );
    },
  },
  play: {
    desc: "Play music (optionally a track number)",
    usage: "play [n]",
    run: (args) => {
      if (!playlist.length) return <Err>No tracks in the playlist.</Err>;
      const n = args[0] ? Number(args[0]) - 1 : undefined;
      if (n !== undefined && !(n >= 0 && n < playlist.length)) return <Err>play: track must be 1-{playlist.length}</Err>;
      ensurePlayer();
      useMusic.getState().play(n);
      const t = playlist[n ?? useMusic.getState().index];
      return (
        <div>
          ♫ Now playing: {t.artist} — {t.title}
          <div className="text-ash-500">Streaming via Spotify — log in there for full tracks, otherwise you get 30s previews.</div>
        </div>
      );
    },
  },
  pause: { desc: "Pause music", run: () => (useMusic.getState().pause(), "Silence.") },
  next: { desc: "Next track", run: () => (ensurePlayer(), useMusic.getState().next(), np()) },
  prev: { desc: "Previous track", run: () => (ensurePlayer(), useMusic.getState().prev(), np()) },
  playlist: {
    desc: "Show the playlist",
    run: () => (
      <div>
        {sections.map((section) => (
          <div key={section} className="mb-1">
            <H>{section}</H>
            {playlist.map((t, i) =>
              t.section === section ? (
                <div key={t.spotifyId}>
                  <span className="text-accent">{String(i + 1).padStart(2)}</span> {t.artist} — {t.title} <Dim>({t.album})</Dim>
                </div>
              ) : null,
            )}
          </div>
        ))}
        <Dim>`play &lt;n&gt;` to play a track.</Dim>
      </div>
    ),
  },
  wallpaper: {
    desc: "Change the wallpaper",
    usage: "wallpaper [name]",
    run: (args) => {
      const id = args[0] as WallpaperId;
      if (!id || !wallpapers.some((w) => w.id === id)) return <div>Usage: wallpaper [{wallpapers.map((w) => w.id).join("|")}]</div>;
      useSystem.getState().set({ wallpaper: id });
      return <Dim>The scenery shifts…</Dim>;
    },
  },
  echo: { desc: "Print text", usage: "echo <text>", run: (args) => args.join(" ") },
  date: { desc: "Print the date", run: () => new Date().toString() },
  history: { desc: "Command history", run: (_, { history }) => <div>{history.map((h, i) => <div key={i}><Dim>{String(i + 1).padStart(3)}</Dim>  {h}</div>)}</div> },
  clear: { desc: "Clear the screen", run: (_, { clear }) => (clear(), null) },
  exit: { desc: "Close the terminal", run: (_, { exit }) => (exit(), null) },

  // hidden
  np: { desc: "", hidden: true, run: () => np() },
  uname: { desc: "", hidden: true, run: (a) => (a.includes("-a") ? "YassineOS 6.6.6-doom #1 SMP PREEMPT_DARK x86_64 GNU/Linux" : "YassineOS") },
  hostname: { desc: "", hidden: true, run: () => "yassineos" },
  fortune: { desc: "", hidden: true, run: () => <span className="italic text-bone">“{fortunes[Math.floor(Math.random() * fortunes.length)]}”</span> },
  summon: {
    desc: "",
    hidden: true,
    run: () => {
      useSystem.getState().set({ wallpaper: "void" });
      if (playlist.length) {
        ensurePlayer();
        useMusic.getState().play();
      }
      return (
        <div className="text-accent">
          <pre>{String.raw`    )      )      )
   (  )   (  )   (  )
    ||     ||     ||
   _||_   _||_   _||_`}</pre>
          <div className="mt-1 italic">Something stirs in the fog…</div>
        </div>
      );
    },
  },
  sudo: {
    desc: "",
    hidden: true,
    run: (args) => {
      if (args.join(" ").startsWith("rm -rf")) {
        return (
          <div>
            <div className="text-[#d0584f]">removing /home/yassine/projects… removing /etc/hope… removing /usr/share/light…</div>
            <div className="mt-1">Just kidding. Nothing burns here but the candles. 🕯️</div>
          </div>
        );
      }
      return `${profile.handle} is not in the sudoers file. This incident will be reported.`;
    },
  },
  rm: { desc: "", hidden: true, run: () => <Err>rm: permission denied — this system is read-only, like a tombstone.</Err> },
  matrix: { desc: "", hidden: true, run: () => <MatrixRain /> },
  vim: { desc: "", hidden: true, run: () => "You entered vim. There is no escape. (just kidding — you never left the shell)" },
};

// The Spotify embed lives in the Music window, so playback needs it open.
function ensurePlayer() {
  const { windows, open, focus, activeId } = useWindows.getState();
  if (windows.some((w) => w.appId === "music")) return;
  open("music");
  if (activeId) focus(activeId); // keep typing in the terminal
}

function np() {
  const { index, playing } = useMusic.getState();
  const t = playlist[index];
  return t ? `${playing ? "♫" : "❚❚"} ${t.artist} — ${t.title}` : "Nothing playing.";
}

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

