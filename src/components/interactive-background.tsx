"use client";

import { useEffect, useRef } from "react";

type Particle = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  depth: number;
};

type Pulse = {
  x: number;
  y: number;
  born: number;
};

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const activeCanvas = canvas;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const activeContext = context;

    let frame = 0;
    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let pulses: Pulse[] = [];
    let lastFrame = 0;
    let backdrop: CanvasGradient | null = null;
    let beam: CanvasGradient | null = null;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    const frameInterval = reduceMotion ? 1000 / 12 : 1000 / 30;

    function reset() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = window.innerHeight;
      activeCanvas.width = Math.floor(width * dpr);
      activeCanvas.height = Math.floor(height * dpr);
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      backdrop = activeContext.createRadialGradient(
        width / 2,
        height * 0.44,
        0,
        width / 2,
        height * 0.44,
        Math.max(width, height) * 0.68,
      );
      backdrop.addColorStop(0, "rgba(145, 0, 8, 0.22)");
      backdrop.addColorStop(0.35, "rgba(26, 0, 3, 0.44)");
      backdrop.addColorStop(1, "rgba(0, 0, 0, 0)");

      beam = activeContext.createLinearGradient(0, height * 0.34, width, height * 0.34);
      beam.addColorStop(0, "rgba(255, 0, 0, 0)");
      beam.addColorStop(0.5, "rgba(255, 40, 40, 0.62)");
      beam.addColorStop(1, "rgba(255, 0, 0, 0)");

      const count = reduceMotion ? 38 : Math.min(132, Math.max(58, Math.floor(width / 12)));
      particles = Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const progress = index / count;
        const baseX = width / 2 + side * (width * (0.07 + Math.random() * 0.48));
        const baseY = height * (0.5 + Math.sin(progress * Math.PI * 4.4) * 0.14);
        const depth = 0.35 + Math.random() * 0.9;

        return {
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          phase: Math.random() * Math.PI * 2,
          size: 0.65 + Math.random() * 1.35,
          depth,
        };
      });
    }

    function drawRibbon(time: number, side: -1 | 1, offset: number) {
      const context = activeContext;
      context.beginPath();
      for (let i = 0; i <= 84; i += 1) {
        const progress = i / 84;
        const x = width / 2 + side * progress * width * 0.66;
        const pull = pointer.active ? (pointer.y - height * 0.52) * 0.04 * (1 - progress) : 0;
        const wave =
          Math.sin(progress * 9 + time * 0.0009 + offset) * 44 +
          Math.sin(progress * 17 - time * 0.0007 + offset) * 15;
        const y = height * 0.52 + wave * (0.28 + progress) + pull;

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
    }

    function drawConnections() {
      const context = activeContext;
      if (!pointer.active) {
        return;
      }

      for (let i = 0; i < particles.length; i += 2) {
        const particle = particles[i];
        const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);

        if (distance < 210) {
          context.beginPath();
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(particle.x, particle.y);
          context.strokeStyle = `rgba(255, 45, 52, ${0.18 * (1 - distance / 210)})`;
          context.lineWidth = 0.6;
          context.stroke();
        }
      }
    }

    function drawGrid(time: number) {
      const context = activeContext;
      const spacing = width < 700 ? 88 : 116;
      const driftX = pointer.active ? (pointer.x / width - 0.5) * 18 : Math.sin(time * 0.00035) * 8;
      const driftY = pointer.active ? (pointer.y / height - 0.5) * 14 : Math.cos(time * 0.0003) * 7;

      context.save();
      context.strokeStyle = "rgba(255, 28, 34, 0.055)";
      context.lineWidth = 1;

      for (let x = -spacing; x < width + spacing; x += spacing) {
        context.beginPath();
        context.moveTo(x + driftX, 0);
        context.lineTo(x - driftX, height);
        context.stroke();
      }

      for (let y = -spacing; y < height + spacing; y += spacing) {
        context.beginPath();
        context.moveTo(0, y + driftY);
        context.lineTo(width, y - driftY);
        context.stroke();
      }

      context.restore();
    }

    function render(time: number) {
      if (document.hidden) {
        animationId = window.requestAnimationFrame(render);
        return;
      }

      if (time - lastFrame < frameInterval) {
        animationId = window.requestAnimationFrame(render);
        return;
      }

      lastFrame = time;
      const context = activeContext;
      frame += 1;
      context.clearRect(0, 0, width, height);

      context.fillStyle = backdrop ?? "rgba(22,0,0,0.35)";
      context.fillRect(0, 0, width, height);
      drawGrid(time);

      context.save();
      context.globalCompositeOperation = "lighter";
      context.lineWidth = 1.15;
      context.strokeStyle = "rgba(255, 25, 34, 0.3)";
      drawRibbon(time, -1, 0);
      drawRibbon(time, 1, Math.PI);
      context.lineWidth = 0.5;
      context.strokeStyle = "rgba(255, 70, 74, 0.18)";
      drawRibbon(time + 1800, -1, 1.2);
      drawRibbon(time + 1800, 1, 2.4);

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      particles.forEach((particle) => {
        const distanceX = pointer.active ? particle.baseX - pointer.x : 0;
        const distanceY = pointer.active ? particle.baseY - pointer.y : 0;
        const distance = Math.hypot(distanceX, distanceY);
        const influence = pointer.active ? Math.max(0, 1 - distance / 310) : 0;
        const drift = Math.sin(time * 0.001 * particle.depth + particle.phase);

        particle.x =
          particle.baseX +
          drift * 22 * particle.depth +
          Math.sin(time * 0.00018 + particle.phase) * particle.vx * 90 +
          (distanceX / Math.max(distance, 1)) * influence * 58;
        particle.y =
          particle.baseY +
          Math.cos(time * 0.00075 * particle.depth + particle.phase) * 46 +
          Math.cos(time * 0.00016 + particle.phase) * particle.vy * 90 +
          (distanceY / Math.max(distance, 1)) * influence * 42;

        if (particle.x < -60 || particle.x > width + 60 || particle.y < -60 || particle.y > height + 60) {
          particle.x = particle.baseX;
          particle.y = particle.baseY;
        }

        const alpha = 0.16 + Math.sin(frame * 0.045 + particle.phase) * 0.12;
        context.fillStyle = `rgba(255, 31, 40, ${Math.max(0.055, alpha)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      drawConnections();

      pulses = pulses.filter((pulse) => time - pulse.born < 1050);
      pulses.forEach((pulse) => {
        const age = time - pulse.born;
        const progress = age / 1050;
        context.beginPath();
        context.arc(pulse.x, pulse.y, 24 + progress * 180, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255, 25, 34, ${0.22 * (1 - progress)})`;
        context.lineWidth = 1.2;
        context.stroke();
      });

      context.strokeStyle = beam ?? "rgba(255, 40, 40, 0.52)";
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(width * 0.24, height * 0.34);
      context.lineTo(width * 0.76, height * 0.34);
      context.stroke();
      context.restore();

      animationId = window.requestAnimationFrame(render);
    }

    function handlePointerMove(event: PointerEvent) {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      pointer.active = true;
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    }

    function handlePointerDown(event: PointerEvent) {
      if (reduceMotion) {
        return;
      }
      pulses.push({ x: event.clientX, y: event.clientY, born: performance.now() });
      if (pulses.length > 4) {
        pulses = pulses.slice(-4);
      }
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    reset();
    animationId = window.requestAnimationFrame(render);
    window.addEventListener("resize", reset);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", reset);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <>
      <div className="ambient-field" aria-hidden="true" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </>
  );
}
