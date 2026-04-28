"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const el = cursorRef.current;
    if (!el) return;

    let x = 0, y = 0;
    let tx = 0, ty = 0;
    let hovering = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hovering = !!(
        t.tagName === "A" || t.tagName === "BUTTON" ||
        t.closest("a") || t.closest("button") ||
        t.getAttribute("role") === "button"
      );
    };

    const tick = () => {
      // spring lerp — no React state, no re-renders
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      const size = hovering ? 48 : 32;
      const half = size / 2;
      el.style.transform = `translate(${x - half}px,${y - half}px)`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      rafId = requestAnimationFrame(tick);
    };

    el.style.display = "block";
    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{ display: "none" }}
      className="pointer-events-none fixed left-0 top-0 z-50 rounded-full mix-blend-difference bg-indigo-500/20 border border-indigo-500/50 will-change-transform"
    />
  );
}
