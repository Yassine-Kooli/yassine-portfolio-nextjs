"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "@/components/three/use-three-scene";

const COUNT = 34; // bars per side
const SPACING = 1.25;
const BG = 0x0b0d10;

/** Animated 3D bar field used as the BI-themed wallpaper. Ambient: single frame when reduced motion. */
export default function BarsScene({ accent }: { accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const accentRef = useRef(accent);
  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  useThreeScene(
    ref,
    ({ scene, camera }) => {
      scene.background = new THREE.Color(BG);
      scene.fog = new THREE.Fog(BG, 38, 80);

      const geometry = new THREE.BoxGeometry(0.8, 1, 0.8);
      const material = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.15 });
      const mesh = new THREE.InstancedMesh(geometry, material, COUNT * COUNT);
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(-12, 24, 10);
      scene.add(key);

      const dummy = new THREE.Object3D();
      const base = new THREE.Color();
      const bright = new THREE.Color();
      const tint = new THREE.Color();
      const tmp = new THREE.Color();
      const white = new THREE.Color(0xffffff);
      let lastAccent = "";
      const half = ((COUNT - 1) * SPACING) / 2;

      camera.position.set(0, 22, 40);
      camera.lookAt(0, 0, 0);
      // The field tilts slightly toward the pointer, like a real desk object would
      const pointer = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX / window.innerWidth - 0.5;
        pointer.y = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onMove);

      return {
        update(_dt, t) {
          if (accentRef.current !== lastAccent) {
            lastAccent = accentRef.current;
            const [r, g, b] = lastAccent.split(" ").map(Number);
            tint.setRGB((r ?? 99) / 255, (g ?? 102) / 255, (b ?? 241) / 255, THREE.SRGBColorSpace);
            base.copy(tint).multiplyScalar(0.28);
            bright.copy(tint).lerp(white, 0.25);
          }

          let i = 0;
          for (let x = 0; x < COUNT; x++) {
            for (let z = 0; z < COUNT; z++) {
              const px = x * SPACING - half;
              const pz = z * SPACING - half;
              // Two travelling waves + a slow swell give a readable, data-like rhythm
              const wave = Math.sin(px * 0.42 + t * 1.1) + Math.cos(pz * 0.36 - t * 0.8);
              const swell = Math.sin(Math.hypot(px, pz) * 0.22 - t * 0.6) * 0.5;
              const h = Math.max(0.6, 2.2 + wave * 1.5 + swell * 2.2);
              dummy.position.set(px, h / 2, pz);
              dummy.scale.set(1, h, 1);
              dummy.updateMatrix();
              mesh.setMatrixAt(i, dummy.matrix);
              mesh.setColorAt(i, tmp.copy(base).lerp(bright, Math.min(1, h / 7)));
              i++;
            }
          }
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

          // Gentle orbit with pointer parallax
          const angle = -Math.PI / 4 + t * 0.03 + pointer.x * 0.25;
          const radius = 42;
          camera.position.set(Math.sin(angle) * radius * 0.7, 20 + pointer.y * 4, Math.cos(angle) * radius * 0.7);
          camera.lookAt(0, 0, 0);
        },
        dispose() {
          window.removeEventListener("pointermove", onMove);
        },
      };
    },
    { ambient: true, fov: 42, cameraPosition: [0, 22, 40], background: BG },
  );

  return <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden" />;
}
