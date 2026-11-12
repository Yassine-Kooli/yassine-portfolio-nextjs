"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "@/components/three/use-three-scene";

const PARTICLES = 260;

function parseRgb(accent: string) {
  const [r, g, b] = accent.split(" ").map(Number);
  return new THREE.Color().setRGB((r ?? 99) / 255, (g ?? 102) / 255, (b ?? 241) / 255, THREE.SRGBColorSpace);
}

/** Wireframe 3D "core" for the About hero. Pointer-tilt, pauses off-screen. */
export default function Orb({ accent, className }: { accent: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const accentRef = useRef(accent);
  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  useThreeScene(
    ref,
    ({ scene }) => {
      const group = new THREE.Group();
      scene.add(group);

      const color = parseRgb(accentRef.current);
      const wireGeo = new THREE.IcosahedronGeometry(1.25, 1);
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(wireGeo),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 }),
      );
      group.add(wire);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.62, 3),
        new THREE.MeshStandardMaterial({ color: 0x0b0d10, emissive: color, emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.4 }),
      );
      group.add(core);
      wireGeo.dispose();

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const light = new THREE.PointLight(0xffffff, 40, 20);
      light.position.set(3, 3, 5);
      scene.add(light);

      // Orbiting particle ring with a little radial noise, so it reads as a field rather than a line
      const positions = new Float32Array(PARTICLES * 3);
      for (let i = 0; i < PARTICLES; i++) {
        const a = (i / PARTICLES) * Math.PI * 2;
        const r = 2.1 + (Math.random() - 0.5) * 0.35;
        const tilt = (Math.random() - 0.5) * 0.4;
        positions[i * 3] = Math.cos(a) * r;
        positions[i * 3 + 1] = tilt;
        positions[i * 3 + 2] = Math.sin(a) * r;
      }
      const ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const ring = new THREE.Points(
        ringGeo,
        new THREE.PointsMaterial({ color, size: 0.035, transparent: true, opacity: 0.9, sizeAttenuation: true }),
      );
      const ringTilt = new THREE.Group();
      ringTilt.rotation.x = 0.5;
      ringTilt.add(ring);
      scene.add(ringTilt);

      const target = { x: 0, y: 0 };
      const el = ref.current;
      const onMove = (e: PointerEvent) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
        target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
      };
      const onLeave = () => {
        target.x = 0;
        target.y = 0;
      };
      el?.addEventListener("pointermove", onMove);
      el?.addEventListener("pointerleave", onLeave);

      let lastAccent = accentRef.current;
      return {
        update(dt, t) {
          if (accentRef.current !== lastAccent) {
            lastAccent = accentRef.current;
            const c = parseRgb(lastAccent);
            (wire.material as THREE.LineBasicMaterial).color.copy(c);
            (ring.material as THREE.PointsMaterial).color.copy(c);
            (core.material as THREE.MeshStandardMaterial).emissive.copy(c);
          }
          group.rotation.y += dt * 0.35;
          group.rotation.x += (target.y - group.rotation.x) * Math.min(1, dt * 4);
          group.rotation.z += (target.x * 0.6 - group.rotation.z) * Math.min(1, dt * 4);
          core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);
          ringTilt.rotation.y = t * 0.5;
        },
        dispose() {
          el?.removeEventListener("pointermove", onMove);
          el?.removeEventListener("pointerleave", onLeave);
        },
      };
    },
    { ambient: true, fov: 38, cameraPosition: [0, 0, 6.2], background: undefined },
  );

  return <div ref={ref} aria-hidden className={className} />;
}
