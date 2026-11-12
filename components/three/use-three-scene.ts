"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SceneContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
};

/** Per-frame logic supplied by a scene. `dt` is clamped so tab switches never cause a jump. */
export type SceneHandle = {
  update: (dt: number, elapsed: number) => void;
  /** Called on resize, with the container size in CSS pixels. */
  resize?: (width: number, height: number) => void;
  dispose?: () => void;
};

type Options = {
  /** Pause the loop when false (e.g. the window is not focused). */
  active?: boolean;
  fov?: number;
  cameraPosition?: [number, number, number];
  lookAt?: [number, number, number];
  /**
   * Ambient scenes (wallpapers, decorative models) draw a single still frame when the
   * user prefers reduced motion. Games leave this off.
   */
  ambient?: boolean;
  /** Canvas background; leave undefined for a transparent canvas over CSS. */
  background?: number;
};

/**
 * Owns a WebGL canvas inside `containerRef`: sizing, a rAF loop that only runs while the
 * scene is visible, active and the tab is in the foreground, and full GPU cleanup on unmount.
 * `setup` runs once per mount; its handle is driven by the loop.
 */
export function useThreeScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  setup: (ctx: SceneContext) => SceneHandle,
  options: Options = {},
) {
  const { active = true, fov = 45, cameraPosition = [0, 0, 10], lookAt = [0, 0, 0], ambient = false, background } = options;

  // Keep the latest flags/setup in refs so the loop never restarts because of identity changes.
  const activeRef = useRef(active);
  const setupRef = useRef(setup);
  const optsRef = useRef({ fov, cameraPosition, lookAt, ambient, background });
  const runRef = useRef<(() => void) | null>(null);

  // Declared before the mount effect so the refs are current when the scene is built.
  useEffect(() => {
    activeRef.current = active;
    setupRef.current = setup;
    optsRef.current = { fov, cameraPosition, lookAt, ambient, background };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const o = optsRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: o.background === undefined });
    } catch {
      // WebGL unavailable (old browser, disabled GPU): the component keeps its CSS fallback.
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    if (o.background !== undefined) renderer.setClearColor(o.background, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(o.fov, 1, 0.1, 500);
    camera.position.set(...o.cameraPosition);
    camera.lookAt(...o.lookAt);

    const handle = setupRef.current({ scene, camera, renderer });

    const size = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      handle.resize?.(w, h);
      return { w, h };
    };
    size();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      handle.update(dt, elapsed);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const shouldRun = () => activeRef.current && visible && !document.hidden;
    const refresh = () => {
      if (ambient && reduced) {
        // Still frame only
        if (!raf) {
          handle.update(0, elapsed);
          renderer.render(scene, camera);
        }
        return;
      }
      if (shouldRun() && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun() && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    runRef.current = refresh;

    const ro = new ResizeObserver(() => size());
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    io.observe(container);
    document.addEventListener("visibilitychange", refresh);
    refresh();

    return () => {
      runRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      handle.dispose?.();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
    // Setup runs once per mount; flags are read through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-evaluate whether the loop should run when `active` changes.
  useEffect(() => {
    runRef.current?.();
  }, [active]);
}
