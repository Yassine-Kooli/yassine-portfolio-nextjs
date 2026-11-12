"use client";

import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps";
import type { WindowProps } from "@/store/windows";
import About from "@/apps/about";
import Terminal from "@/apps/terminal/terminal";
import Files from "@/apps/files";
import TextViewer from "@/apps/text-viewer";
import PdfViewer from "@/apps/pdf-viewer";
import Dashboard from "@/apps/dashboard";
import Mail from "@/apps/mail";
import Settings from "@/apps/settings";

export type AppProps = { windowId: string; props: WindowProps; active: boolean };

const registry: Record<AppId, ComponentType<AppProps>> = {
  about: About,
  dashboard: Dashboard,
  terminal: Terminal,
  files: Files,
  text: TextViewer,
  pdf: PdfViewer,
  mail: Mail,
  settings: Settings,
};

export default function AppView({ appId, ...rest }: AppProps & { appId: AppId }) {
  const Component = registry[appId];
  return <Component {...rest} />;
}
