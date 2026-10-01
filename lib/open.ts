import { getNode, type FsNode } from "@/lib/fs";
import { useMusic } from "@/store/music";
import { useWindows } from "@/store/windows";

/** Open a virtual-filesystem node with the right app, like double-clicking it. */
export function openPath(path: string, node: FsNode | null = getNode(path)) {
  const { open } = useWindows.getState();
  if (!node) return false;
  if (node.type === "dir") {
    open("files", { props: { path } });
  } else if (node.kind === "text") {
    open("text", { props: { path }, title: `${node.name} — Text Editor` });
  } else if (node.kind === "pdf") {
    open("pdf", { props: { path, src: node.src }, title: `${node.name} — Document Viewer` });
  } else if (node.kind === "audio" && node.trackIndex !== undefined) {
    useMusic.getState().play(node.trackIndex);
    open("music");
  } else if (node.kind === "app" && node.appId) {
    open(node.appId);
  }
  return true;
}
