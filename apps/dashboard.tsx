"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import clsx from "clsx";
import { LuTable2, LuBarChart3 } from "react-icons/lu";
import { MONTHS, monthly, pipeline, productMix, regions } from "@/lib/sales-data";

// Reference data-viz palette, dark chart surface (validated: see dataviz skill references/palette.md)
const C = {
  surface: "#1a1a19",
  ink: "#f0efec",
  ink2: "#c3c2b7",
  muted: "#898781",
  grid: "#2c2c2a",
  base: "#383835",
  s1: "#3987e5", // categorical slot 1 (blue)
  s2: "#d95926", // categorical slot 2 (orange)
  s3: "#199e70", // categorical slot 3 (aqua)
  s4: "#c98500", // categorical slot 4 (yellow)
  good: "#0ca30c",
  critical: "#d03b3b",
};
const SERIES = [C.s1, C.s2, C.s3, C.s4];

const money = (k: number) => `$${k.toLocaleString("en-US")}K`;
const pct = (n: number) => `${n.toFixed(1)}%`;
const nice = (n: number) => n.toLocaleString("en-US");

/** Track an element's width so SVG charts render at true pixel size (crisp labels). */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Round a max value up to a clean axis top with 4 steps. */
function axisTop(max: number) {
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = Math.ceil(raw / mag) * mag;
  return { step, top: step * 4 };
}

type Period = 6 | 12;

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>(12);

  const slice = (arr: readonly number[]) => arr.slice(-period);
  const revenue = slice(monthly.revenue);
  const target = slice(monthly.target);
  const orders = slice(monthly.orders);
  const labels = MONTHS.slice(-period);

  const sum = (a: readonly number[]) => a.reduce((s, n) => s + n, 0);
  const totalRevenue = sum(revenue);
  const totalTarget = sum(target);
  const totalOrders = sum(orders);
  const attainment = (totalRevenue / totalTarget) * 100;
  const aov = (totalRevenue * 1000) / totalOrders;

  // Period-over-period only where a prior window exists (6-month view vs the 6 months before it)
  const prev = period === 6 ? monthly.revenue.slice(0, 6) : null;
  const delta = prev ? ((totalRevenue - sum(prev)) / sum(prev)) * 100 : null;

  const regionRows = [...regions].sort((a, b) => b.revenue - a.revenue);
  const regionTotal = sum(regions.map((r) => r.revenue));
  const productTotal = sum(productMix.map((p) => p.revenue));

  return (
    <div className="h-full overflow-y-auto bg-crypt p-5 text-bone sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-parchment">Sales performance</h1>
          <p className="mt-1 text-xs text-ash-400">Built with SQL, Laravel and Filament: a sample BI dashboard</p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-ash-300">Illustrative sample data</span>
      </header>

      {/* Filter row: one row above everything it scopes */}
      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Period">
        {([6, 12] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={clsx(
              "rounded-lg border px-3 py-1.5 text-xs transition",
              period === p ? "border-accent bg-accent/20 text-parchment" : "border-white/10 text-ash-300 hover:bg-white/5",
            )}
          >
            Last {p} months
          </button>
        ))}
      </div>

      {/* KPI tiles */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Revenue" value={money(totalRevenue)} delta={delta} note={prev ? "vs prior 6 months" : undefined} />
        <Kpi label="Target attainment" value={pct(attainment)} note={`Target ${money(totalTarget)}`} />
        <Kpi label="Orders" value={nice(totalOrders)} />
        <Kpi label="Average order value" value={`$${Math.round(aov).toLocaleString("en-US")}`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          className="lg:col-span-2"
          title="Monthly revenue vs target"
          table={
            <Table
              head={["Month", "Revenue", "Target", "Attainment"]}
              rows={labels.map((m, i) => [m, money(revenue[i]), money(target[i]), pct((revenue[i] / target[i]) * 100)])}
            />
          }
        >
          <LineChart
            labels={labels}
            series={[
              { name: "Revenue", color: C.s1, values: revenue },
              { name: "Target", color: C.s2, values: target },
            ]}
          />
        </Panel>

        <Panel
          title="Revenue by region"
          table={
            <Table
              head={["Region", "Revenue", "Share"]}
              rows={regionRows.map((r) => [r.name, money(r.revenue), pct((r.revenue / regionTotal) * 100)])}
            />
          }
        >
          <HBars
            rows={regionRows.map((r) => ({ label: r.name, value: r.revenue, share: (r.revenue / regionTotal) * 100 }))}
            format={(n) => money(n)}
            color={C.s1}
          />
        </Panel>

        <Panel
          title="Sales pipeline (count of deals)"
          table={
            <Table
              head={["Stage", "Deals", "Conversion from previous"]}
              rows={pipeline.map((p, i) => [p.stage, nice(p.count), i === 0 ? "—" : pct((p.count / pipeline[i - 1].count) * 100)])}
            />
          }
        >
          <HBars
            rows={pipeline.map((p, i) => ({
              label: p.stage,
              value: p.count,
              share: i === 0 ? 100 : (p.count / pipeline[i - 1].count) * 100,
              shareLabel: i === 0 ? "entry stage" : "of previous stage",
            }))}
            format={(n) => nice(n)}
            color={C.s1}
          />
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Revenue mix by product"
          table={
            <Table
              head={["Product", "Revenue", "Share"]}
              rows={productMix.map((p) => [p.name, money(p.revenue), pct((p.revenue / productTotal) * 100)])}
            />
          }
        >
          <Segmented parts={productMix.map((p) => ({ name: p.name, value: p.revenue }))} total={productTotal} />
        </Panel>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-ash-500">
        All figures are illustrative sample data, not from any employer or client. Use the table view on any panel to read exact values.
      </p>
    </div>
  );
}

function Kpi({ label, value, delta, note }: { label: string; value: string; delta?: number | null; note?: string }) {
  const up = delta != null && delta >= 0;
  return (
    <div className="rounded-xl p-4" style={{ background: C.surface, boxShadow: "0 0 0 1px rgba(255,255,255,.06)" }}>
      <div className="text-xs text-ash-400">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold tracking-tight text-parchment">{value}</div>
      {delta != null && (
        <div className="mt-1 text-xs font-medium" style={{ color: up ? C.good : C.critical }}>
          {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% {note}
        </div>
      )}
      {delta == null && note && <div className="mt-1 text-xs text-ash-400">{note}</div>}
    </div>
  );
}

function Panel({ title, table, children, className }: { title: string; table: ReactNode; children: ReactNode; className?: string }) {
  const [tableOn, setTableOn] = useState(false);
  return (
    <section className={clsx("rounded-xl p-4", className)} style={{ background: C.surface, boxShadow: "0 0 0 1px rgba(255,255,255,.06)" }}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-parchment">{title}</h2>
        <button
          onClick={() => setTableOn((v) => !v)}
          aria-pressed={tableOn}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ash-300 transition hover:bg-white/5"
        >
          {tableOn ? <LuBarChart3 size={13} /> : <LuTable2 size={13} />}
          {tableOn ? "Chart" : "Table"}
        </button>
      </div>
      {tableOn ? table : children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b" style={{ borderColor: C.base }}>
            {head.map((h, i) => (
              <th key={h} className={clsx("py-2 pr-3 font-medium text-ash-400", i > 0 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b" style={{ borderColor: C.grid }}>
              {row.map((cell, i) => (
                <td key={i} className={clsx("py-2 pr-3 tabular-nums", i > 0 && "text-right")} style={{ color: C.ink2 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LineChart({ labels, series }: { labels: string[]; series: { name: string; color: string; values: readonly number[] }[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const H = 240;
  const pad = { t: 14, r: 56, b: 28, l: 56 };
  const innerW = Math.max(width - pad.l - pad.r, 40);
  const innerH = H - pad.t - pad.b;
  const { step, top } = axisTop(Math.max(...series.flatMap((s) => s.values)));
  const x = (i: number) => pad.l + (labels.length === 1 ? innerW / 2 : (i / (labels.length - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - (v / top) * innerH;
  const linePath = (vals: readonly number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const areaPath = (vals: readonly number[]) => `${linePath(vals)} L${x(vals.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  const onMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - pad.l) / innerW) * (labels.length - 1));
    setHover(Math.min(labels.length - 1, Math.max(0, i)));
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Legend: always shown for 2+ series; identity is never color alone */}
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-ash-300">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
      {width > 0 && (
        <svg
          role="img"
          aria-label={`Line chart: ${series.map((s) => s.name).join(" and ")} by month`}
          width={width}
          height={H}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          className="block select-none"
        >
          {/* Hairline gridlines and value axis (solid, recessive) */}
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <line x1={pad.l} x2={width - pad.r} y1={y(k * step)} y2={y(k * step)} stroke={k === 0 ? C.base : C.grid} strokeWidth={1} />
              <text x={pad.l - 8} y={y(k * step) + 4} textAnchor="end" fontSize={11} fill={C.muted}>
                ${k * step}K
              </text>
            </g>
          ))}
          {labels.map((m, i) => (
            <text key={m} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill={C.muted}>
              {m}
            </text>
          ))}
          {/* Area wash on the first series only, at ~10% */}
          <path d={areaPath(series[0].values)} fill={series[0].color} fillOpacity={0.1} />
          {series.map((s) => (
            <path key={s.name} d={linePath(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {/* Direct label at the endpoint, selectively (end value only) */}
          {series.map((s) => (
            <text key={`end-${s.name}`} x={x(labels.length - 1) + 8} y={y(s.values[s.values.length - 1]) + 4} fontSize={11} fill={C.ink2}>
              {money(s.values[s.values.length - 1])}
            </text>
          ))}
          {hover != null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + innerH} stroke={C.muted} strokeWidth={1} />
              {series.map((s) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={4} fill={s.color} stroke={C.surface} strokeWidth={2} />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover != null && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-white/10 bg-black/90 px-2.5 py-2 text-xs shadow-lg"
          style={{ left: Math.min(x(hover) + 12, width - 150), top: 36 }}
        >
          <div className="mb-1 font-semibold text-parchment">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-4 text-ash-300">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="tabular-nums text-bone">{money(s.values[hover])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HBars({
  rows,
  format,
  color,
}: {
  rows: { label: string; value: number; share: number; shareLabel?: string }[];
  format: (n: number) => string;
  color: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-2">
      {rows.map((r, i) => (
        <li
          key={r.label}
          tabIndex={0}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          className="relative grid grid-cols-[84px_1fr_auto] items-center gap-3 rounded px-1 py-0.5 outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <span className="truncate text-xs" style={{ color: C.ink2 }}>
            {r.label}
          </span>
          {/* Bar: <= 24px thick, 4px rounded data end, square at baseline */}
          <div className="h-3 min-w-[2px] rounded-r" style={{ width: `${(r.value / max) * 100}%`, background: color, borderRadius: "0 4px 4px 0" }} />
          <span className="text-xs tabular-nums" style={{ color: C.ink }}>
            {format(r.value)}
          </span>
          {hover === i && (
            <span className="pointer-events-none absolute -top-7 left-16 z-10 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-xs text-bone shadow-lg">
              {r.label}: {format(r.value)} · {pct(r.share)} {r.shareLabel ?? "of total"}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Segmented({ parts, total }: { parts: { name: string; value: number }[]; total: number }) {
  return (
    <div>
      {/* Thin segmented bar: one whole split into parts, 2px surface gap, no text */}
      <div className="flex h-2 gap-[2px] overflow-hidden rounded-full" role="img" aria-label="Product revenue mix">
        {parts.map((p, i) => (
          <div key={p.name} title={`${p.name}: ${money(p.value)}`} style={{ width: `${(p.value / total) * 100}%`, background: SERIES[i] }} />
        ))}
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {parts.map((p, i) => (
          <li key={p.name} className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-xs hover:bg-white/5">
            <span className="flex items-center gap-2 text-ash-300">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: SERIES[i] }} />
              {p.name}
            </span>
            <span className="tabular-nums text-bone">
              {money(p.value)} · {pct((p.value / total) * 100)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
