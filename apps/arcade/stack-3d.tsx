"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { useThreeScene } from "@/components/three/use-three-scene";

const H = 0.5; // block height
const START = 3; // base block size
const RANGE = 4.6; // how far a sliding block travels either side of the tower
const GRAVITY = 16;
const BEST_KEY = "yassineos-stack-best";

type Status = "ready" | "playing" | "over";
type Block = { mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>; size: { x: number; z: number } };
type Piece = { mesh: Block["mesh"]; vel: THREE.Vector3; spin: THREE.Vector3 };

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
};
const saveBest = (n: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {}
};

/**
 * Stack 3D: a Three.js tower game. Tap (or Space) to drop the sliding block.
 * Overlap is cut off, perfect drops keep their full width. Pauses when the window is inactive.
 */
export default function Stack3D({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const tapRef = useRef<() => void>(() => {});
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [perfect, setPerfect] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        tapRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useThreeScene(
    ref,
    ({ scene, camera }) => {
      const root = new THREE.Group();
      scene.add(root);
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const sun = new THREE.DirectionalLight(0xffffff, 1.1);
      sun.position.set(5, 10, 7);
      scene.add(sun);

      const unitBox = new THREE.BoxGeometry(1, 1, 1);
      const edges = new THREE.EdgesGeometry(unitBox);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });

      const makeBlock = (index: number, size: { x: number; z: number }): Block => {
        const hue = (200 + index * 14) % 360;
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(hue / 360, 0.62, 0.56),
          roughness: 0.45,
          metalness: 0.1,
        });
        const mesh = new THREE.Mesh(unitBox, mat);
        mesh.add(new THREE.LineSegments(edges, edgeMat));
        mesh.scale.set(size.x, H, size.z);
        root.add(mesh);
        return { mesh, size };
      };

      const disposeMesh = (mesh: THREE.Mesh) => {
        root.remove(mesh);
        (mesh.material as THREE.Material).dispose();
      };

      // Game state (kept out of React; React only mirrors what the HUD needs)
      let stack: Block[] = [];
      let pieces: Piece[] = [];
      let current: Block | null = null;
      let axis: "x" | "z" = "x";
      let phase = 0;
      let count = 0;
      let st: Status = "ready";
      let camY = 0;
      let bestLocal = readBest();
      let perfectId = 0;

      const top = () => stack[stack.length - 1];
      const speed = () => Math.min(5.4, 1.7 + count * 0.12);

      const spawn = () => {
        const t = top();
        const index = stack.length;
        axis = index % 2 === 1 ? "x" : "z";
        current = makeBlock(index, { ...t.size });
        current.mesh.position.set(t.mesh.position.x, index * H, t.mesh.position.z);
        phase = 0;
      };

      const reset = () => {
        stack.forEach((b) => disposeMesh(b.mesh));
        pieces.forEach((p) => disposeMesh(p.mesh));
        if (current) disposeMesh(current.mesh);
        stack = [];
        pieces = [];
        current = null;
        count = 0;
        camY = 0;
        const base = makeBlock(0, { x: START, z: START });
        base.mesh.position.set(0, 0, 0);
        stack.push(base);
        spawn();
        st = "ready";
        setStatus("ready");
        setScore(0);
        setPerfect(null);
      };

      const spawnPiece = (from: Block["mesh"], a: "x" | "z", center: number, length: number, otherSize: number, side: number) => {
        const size = a === "x" ? { x: length, z: otherSize } : { x: otherSize, z: length };
        const b = makeBlock(stack.length, size);
        b.mesh.position.set(from.position.x, from.position.y, from.position.z);
        b.mesh.position[a] = center;
        pieces.push({
          mesh: b.mesh,
          vel: new THREE.Vector3(a === "x" ? side * 0.8 : 0, 0.6, a === "z" ? side * 0.8 : 0),
          spin: new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2),
        });
      };

      const fail = () => {
        const cur = current!;
        pieces.push({
          mesh: cur.mesh,
          vel: new THREE.Vector3(axis === "x" ? 0.6 : 0, 0.8, axis === "z" ? 0.6 : 0),
          spin: new THREE.Vector3(1.4, 0, 1.1),
        });
        current = null;
        st = "over";
        setStatus("over");
        if (count > bestLocal) {
          bestLocal = count;
          saveBest(count);
          setBest(count);
        }
      };

      const tap = () => {
        if (st === "over") {
          reset();
          return;
        }
        if (!current) return;
        if (st === "ready") {
          st = "playing";
          setStatus("playing");
        }

        const t = top();
        const a = axis;
        const cur = current;
        const topC = t.mesh.position[a];
        const topS = t.size[a];
        const curC = cur.mesh.position[a];
        const curS = cur.size[a];
        const lo = Math.max(topC - topS / 2, curC - curS / 2);
        const hi = Math.min(topC + topS / 2, curC + curS / 2);
        const overlap = hi - lo;

        if (overlap <= 0.02) {
          fail();
          return;
        }

        const isPerfect = Math.abs(curC - topC) < 0.07;
        const otherSize = a === "x" ? cur.size.z : cur.size.x;
        if (!isPerfect) {
          const leftCut = lo - (curC - curS / 2);
          const rightCut = curC + curS / 2 - hi;
          if (leftCut > 0.01) spawnPiece(cur.mesh, a, curC - curS / 2 + leftCut / 2, leftCut, otherSize, -1);
          if (rightCut > 0.01) spawnPiece(cur.mesh, a, hi + rightCut / 2, rightCut, otherSize, 1);
        }

        const newSize = isPerfect ? topS : overlap;
        const newCenter = isPerfect ? topC : (lo + hi) / 2;
        if (a === "x") cur.size.x = newSize;
        else cur.size.z = newSize;
        cur.mesh.scale.set(cur.size.x, H, cur.size.z);
        cur.mesh.position[a] = newCenter;
        stack.push(cur);
        current = null;

        count++;
        setScore(count);
        if (isPerfect) {
          perfectId++;
          setPerfect(perfectId);
        } else setPerfect(null);
        if (count > bestLocal) {
          bestLocal = count;
          saveBest(count);
          setBest(count);
        }
        spawn();
      };
      tapRef.current = tap;

      reset();
      st = "ready";

      return {
        update(dt) {
          // Sliding block
          if (current && st !== "over") {
            phase += dt * speed();
            const t = top();
            const off = Math.sin(phase) * RANGE;
            const p = current.mesh.position;
            if (axis === "x") {
              p.x = t.mesh.position.x + off;
              p.z = t.mesh.position.z;
            } else {
              p.z = t.mesh.position.z + off;
              p.x = t.mesh.position.x;
            }
          }

          // Cut-off pieces tumble away
          pieces = pieces.filter((p) => {
            p.vel.y -= GRAVITY * dt;
            p.mesh.position.addScaledVector(p.vel, dt);
            p.mesh.rotation.x += p.spin.x * dt;
            p.mesh.rotation.z += p.spin.z * dt;
            if (p.mesh.position.y < camY - 14) {
              disposeMesh(p.mesh);
              return false;
            }
            return true;
          });

          // Camera follows the tower
          const focus = Math.max(0, (stack.length - 1) * H - 1.2);
          camY += (focus - camY) * Math.min(1, dt * 3);
          camera.position.set(9, camY + 6.5, 9);
          camera.lookAt(0, camY, 0);
        },
        dispose() {
          tapRef.current = () => {};
          edges.dispose();
          edgeMat.dispose();
        },
      };
    },
    { active, fov: 40, cameraPosition: [9, 6.5, 9], lookAt: [0, 0, 0] },
  );

  const hint = status === "over" ? "Tap or press Space to try again" : "Tap or press Space to drop the block";

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden bg-gradient-to-b from-[#121a2b] to-[#07090d]"
      onPointerDown={() => tapRef.current()}
    >
      <div ref={ref} aria-hidden className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 font-display text-sm tracking-wide text-ash-300">
        <span>Stack <span className="tabular-nums text-parchment">{score}</span></span>
        <span>Best <span className="tabular-nums text-parchment">{best}</span></span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-14 flex justify-center">
        <AnimatePresence>
          {perfect !== null && status === "playing" && (
            <motion.span
              key={perfect}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-full bg-accent/25 px-3 py-1 text-xs font-medium text-accent ring-1 ring-accent/40"
            >
              Perfect
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {status === "over" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35">
          <div className="text-center">
            <div className="text-3xl font-semibold text-parchment">Game over</div>
            <div className="mt-2 text-sm text-ash-300">{score} {score === 1 ? "block" : "blocks"} stacked</div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-ash-400">{hint}</div>
    </div>
  );
}
