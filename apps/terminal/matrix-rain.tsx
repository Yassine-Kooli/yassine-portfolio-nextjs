"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = 160;
    const cols = Math.floor(canvas.width / 12);
    const drops = Array.from({ length: cols }, () => Math.random() * -20);
    const chars = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ01";
    const t = setInterval(() => {
      ctx.fillStyle = "rgba(13,12,12,.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#a01818";
      ctx.font = "12px monospace";
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 12, y * 12);
        drops[i] = y * 12 > canvas.height && Math.random() > 0.95 ? 0 : y + 1;
      });
    }, 50);
    const stop = setTimeout(() => clearInterval(t), 6000);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, []);
  return <canvas ref={ref} className="h-40 w-full" />;
}
