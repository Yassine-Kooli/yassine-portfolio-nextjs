"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/theme-context";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const isDark = theme === "dark";
    const primaryColor = isDark ? new THREE.Color(0x818cf8) : new THREE.Color(0x4f46e5);
    const secondaryColor = isDark ? new THREE.Color(0x2dd4bf) : new THREE.Color(0x0d9488);

    // Nodes
    const nodeCount = 90;
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

    // Node dots
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

    // Lines
    const lineGeometry = new THREE.BufferGeometry();
    const maxLines = nodeCount * nodeCount;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMaterial = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.3 : 0.2,
    }));
    scene.add(lineMaterial);

    const CONNECT_DIST = 1.6;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Update node positions
      for (let i = 0; i < nodeCount; i++) {
        positions[i].add(velocities[i]);
        if (Math.abs(positions[i].x) > 4) velocities[i].x *= -1;
        if (Math.abs(positions[i].y) > 3) velocities[i].y *= -1;

        dotPositions[i * 3] = positions[i].x;
        dotPositions[i * 3 + 1] = positions[i].y;
        dotPositions[i * 3 + 2] = positions[i].z;
      }
      dotGeometry.attributes.position.needsUpdate = true;

      // Draw lines between close nodes + mouse proximity glow
      let lineIdx = 0;
      const mouseVec = new THREE.Vector3(mouseX, mouseY, 0);

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = positions[i].distanceTo(positions[j]);
          if (dist < CONNECT_DIST) {
            const alpha = 1 - dist / CONNECT_DIST;

            // Color blend based on mouse proximity
            const midX = (positions[i].x + positions[j].x) / 2;
            const midY = (positions[i].y + positions[j].y) / 2;
            const mouseDist = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
            const mouseInfluence = Math.max(0, 1 - mouseDist / 2);

            const color = new THREE.Color().lerpColors(primaryColor, secondaryColor, mouseInfluence * 0.7);

            linePositions[lineIdx * 6] = positions[i].x;
            linePositions[lineIdx * 6 + 1] = positions[i].y;
            linePositions[lineIdx * 6 + 2] = positions[i].z;
            linePositions[lineIdx * 6 + 3] = positions[j].x;
            linePositions[lineIdx * 6 + 4] = positions[j].y;
            linePositions[lineIdx * 6 + 5] = positions[j].z;

            lineColors[lineIdx * 6] = color.r * alpha;
            lineColors[lineIdx * 6 + 1] = color.g * alpha;
            lineColors[lineIdx * 6 + 2] = color.b * alpha;
            lineColors[lineIdx * 6 + 3] = color.r * alpha;
            lineColors[lineIdx * 6 + 4] = color.g * alpha;
            lineColors[lineIdx * 6 + 5] = color.b * alpha;
            lineIdx++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIdx * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

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
