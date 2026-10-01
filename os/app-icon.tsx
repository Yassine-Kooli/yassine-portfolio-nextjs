import clsx from "clsx";
import { apps, type AppId } from "@/lib/apps";

export default function AppIcon({ id, size = 44, className }: { id: AppId; size?: number; className?: string }) {
  const meta = apps[id];
  const Icon = meta.icon;
  return (
    <div
      className={clsx(
        "grid shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br text-bone shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_6px_16px_rgba(0,0,0,.6)]",
        meta.tint,
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.5} strokeWidth={1.6} />
    </div>
  );
}
