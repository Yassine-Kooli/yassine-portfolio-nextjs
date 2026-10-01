import { experiencesData, profile, projectsData, skillsData } from "@/lib/data";
import { playlist, sections } from "@/lib/playlist";
import type { AppId } from "@/lib/apps";

export type FsFile = {
  type: "file";
  name: string;
  kind: "text" | "pdf" | "audio" | "app";
  content?: string;
  src?: string;
  trackIndex?: number;
  appId?: AppId;
  hidden?: boolean;
};
export type FsDir = { type: "dir"; name: string; children: FsNode[]; hidden?: boolean };
export type FsNode = FsFile | FsDir;

export const HOME = `/home/${profile.handle}`;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const projectFile = (p: (typeof projectsData)[number]): FsFile => ({
  type: "file",
  kind: "text",
  name: `${p.slug}.md`,
  content: [
    `# ${p.title}`,
    `> ${p.type}`,
    "",
    p.description,
    "",
    "## Highlights",
    ...p.features.map((f) => `- ${f}`),
    "",
    "## Stack",
    p.tags.join(" · "),
    ...(p.link ? ["", `Link: ${p.link}`] : []),
  ].join("\n"),
});

const experienceFile = (e: (typeof experiencesData)[number]): FsFile => ({
  type: "file",
  kind: "text",
  name: `${e.slug}.md`,
  content: [`# ${e.title}`, `> ${e.location} — ${e.date}`, "", e.description].join("\n"),
});

const root: FsDir = {
  type: "dir",
  name: "",
  children: [
    {
      type: "dir",
      name: "home",
      children: [
        {
          type: "dir",
          name: profile.handle,
          children: [
            {
              type: "file",
              kind: "text",
              name: "about.md",
              content: [`# ${profile.name}`, `> ${profile.role} — ${profile.location}`, "", ...profile.bio.flatMap((b) => [b, ""])].join("\n"),
            },
            {
              type: "file",
              kind: "text",
              name: "skills.md",
              content: [
                "# Skills",
                "",
                ...Object.entries(skillsData).flatMap(([group, items]) => [`## ${group}`, items.join(" · "), ""]),
              ].join("\n"),
            },
            {
              type: "file",
              kind: "text",
              name: "contact.md",
              content: [
                "# Contact",
                "",
                `- Email: ${profile.email}`,
                ...profile.socials.map((s) => `- ${s.name}: ${s.url}`),
                "",
                "Or open the Mail app and send a raven.",
              ].join("\n"),
            },
            { type: "file", kind: "pdf", name: "CV.pdf", src: profile.cv },
            { type: "dir", name: "projects", children: projectsData.map(projectFile) },
            { type: "dir", name: "experience", children: experiencesData.map(experienceFile) },
            {
              type: "dir",
              name: "music",
              children: sections.map((section) => ({
                type: "dir",
                name: slug(section),
                children: playlist.flatMap((t, i) =>
                  t.section === section ? [{ type: "file", kind: "audio", name: `${slug(`${t.artist} ${t.title}`)}.spotify`, trackIndex: i } as FsFile] : [],
                ),
              })),
            },
            {
              type: "file",
              kind: "text",
              name: ".grimoire",
              hidden: true,
              content: [
                "# You found the grimoire",
                "",
                "Terminal incantations few mortals know:",
                "",
                "- `summon` — call something from the dark",
                "- `fortune` — receive a bleak prophecy",
                "- `sudo rm -rf /` — go on, try it",
                "- `matrix` — wrong genre, but fine",
              ].join("\n"),
            },
          ],
        },
      ],
    },
    {
      type: "dir",
      name: "etc",
      children: [
        {
          type: "file",
          kind: "text",
          name: "os-release",
          content: 'NAME="YassineOS"\nVERSION="1.0 (Ghost)"\nID=yassineos\nPRETTY_NAME="YassineOS 1.0"\nHOME_URL="https://yassine-kooli.vercel.app/"',
        },
      ],
    },
  ],
};

export function normalize(cwd: string, input = "~"): string {
  let path = input.trim() || "~";
  if (path === "~" || path.startsWith("~/")) path = HOME + path.slice(1);
  else if (!path.startsWith("/")) path = `${cwd}/${path}`;
  const parts: string[] = [];
  for (const seg of path.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

export function getNode(path: string): FsNode | null {
  if (path === "/") return root;
  let node: FsNode = root;
  for (const seg of path.split("/").filter(Boolean)) {
    if (node.type !== "dir") return null;
    const next: FsNode | undefined = node.children.find((c) => c.name === seg);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function prettyPath(path: string) {
  return path === HOME ? "~" : path.startsWith(HOME + "/") ? "~" + path.slice(HOME.length) : path;
}

export function joinPath(dir: string, name: string) {
  return dir === "/" ? `/${name}` : `${dir}/${name}`;
}
