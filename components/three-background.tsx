"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/theme-context";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    // Skip on mobile — saves battery and removes lag on low-end devices
    if (window.innerWidth < 768) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // never >1 — halves fill cost on retina

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const isDark = theme === "dark";
    const primaryColor = isDark ? new THREE.Color(0x818cf8) : new THREE.Color(0x4f46e5);
    const secondaryColor = isDark ? new THREE.Color(0x2dd4bf) : new THREE.Color(0x0d9488);
    // pre-allocate — no GC pressure in hot loop
    const blendedColor = new THREE.Color();

    const nodeCount = 50; // was 90 → O(n²) pairs: 1225 vs 4005
    const positions: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2
      ));
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        0
      ));
    }

    const dotGeometry = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(nodeCount * 3);
    positions.forEach((p, i) => {
      dotPositions[i * 3] = p.x;
      dotPositions[i * 3 + 1] = p.y;
      dotPositions[i * 3 + 2] = p.z;
    });
    dotGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: primaryColor,
      transparent: true,
      opacity: isDark ? 0.8 : 0.6,
    });
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dots);

    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = nodeCount * nodeCount;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineSegments = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.2,
    }));
    scene.add(lineSegments);

    const CONNECT_DIST = 1.6;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 30fps cap — halves GPU load vs uncapped rAF
    const TARGET_INTERVAL = 1000 / 30;
    let last = 0;
    let animId: number;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (now - last < TARGET_INTERVAL) return;
      last = now;

      for (let i = 0; i < nodeCount; i++) {
        positions[i].add(velocities[i]);
        if (Math.abs(positions[i].x) > 4) velocities[i].x *= -1;
        if (Math.abs(positions[i].y) > 3) velocities[i].y *= -1;
        dotPositions[i * 3] = positions[i].x;
        dotPositions[i * 3 + 1] = positions[i].y;
        dotPositions[i * 3 + 2] = positions[i].z;
      }
      dotGeometry.attributes.position.needsUpdate = true;

      let lineIdx = 0;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy); // skip z — cheaper
          if (dist < CONNECT_DIST) {
            const alpha = 1 - dist / CONNECT_DIST;
            const midX = (positions[i].x + positions[j].x) / 2;
            const midY = (positions[i].y + positions[j].y) / 2;
            const mouseDist = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
            const mouseInfluence = Math.max(0, 1 - mouseDist / 2);

            // reuse pre-allocated color object
            blendedColor.lerpColors(primaryColor, secondaryColor, mouseInfluence * 0.7);

            const base = lineIdx * 6;
            linePositions[base] = positions[i].x;
            linePositions[base + 1] = positions[i].y;
            linePositions[base + 2] = positions[i].z;
            linePositions[base + 3] = positions[j].x;
            linePositions[base + 4] = positions[j].y;
            linePositions[base + 5] = positions[j].z;

            lineColors[base] = blendedColor.r * alpha;
            lineColors[base + 1] = blendedColor.g * alpha;
            lineColors[base + 2] = blendedColor.b * alpha;
            lineColors[base + 3] = blendedColor.r * alpha;
            lineColors[base + 4] = blendedColor.g * alpha;
            lineColors[base + 5] = blendedColor.b * alpha;
            lineIdx++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIdx * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    const container = containerRef.current;
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      dotGeometry.dispose();
      dotMaterial.dispose();
      lineGeometry.dispose();
      renderer.dispose();
      if (container) {
        while (container.firstChild) container.removeChild(container.firstChild);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
