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

type MeshProfile = {
  layers: number;
  samples: number;
  particleCap: number;
  crossStep: number;
  spikeStep: number;
  frameRate: number;
  opacityScale: number;
};

const DESKTOP_MESH_PROFILE: MeshProfile = {
  layers: 13,
  samples: 96,
  particleCap: 168,
  crossStep: 6,
  spikeStep: 11,
  frameRate: 30,
  opacityScale: 1,
};

const MOBILE_MESH_PROFILE: MeshProfile = {
  layers: 6,
  samples: 56,
  particleCap: 72,
  crossStep: 10,
  spikeStep: 18,
  frameRate: 22,
  opacityScale: 0.64,
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
    const pointer = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      strength: 0,
      targetStrength: 0,
    };
    let meshProfile = DESKTOP_MESH_PROFILE;
    let frameInterval = 1000 / meshProfile.frameRate;

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
        height * 0.58,
        0,
        width / 2,
        height * 0.58,
        Math.max(width, height) * 0.68,
      );
      backdrop.addColorStop(0, "rgba(118, 0, 8, 0.08)");
      backdrop.addColorStop(0.35, "rgba(18, 0, 3, 0.14)");
      backdrop.addColorStop(1, "rgba(0, 0, 0, 0)");

      beam = activeContext.createLinearGradient(0, height * 0.47, width, height * 0.47);
      beam.addColorStop(0, "rgba(255, 0, 0, 0)");
      beam.addColorStop(0.5, "rgba(255, 40, 40, 0.18)");
      beam.addColorStop(1, "rgba(255, 0, 0, 0)");

      meshProfile = width < 700 ? MOBILE_MESH_PROFILE : DESKTOP_MESH_PROFILE;
      frameInterval = 1000 / meshProfile.frameRate;
      const count = reduceMotion
        ? Math.min(38, meshProfile.particleCap)
        : Math.min(meshProfile.particleCap, Math.max(48, Math.floor(width / 9)));
      particles = Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const progress = index / count;
        const baseX = width / 2 + side * (width * (0.07 + Math.random() * 0.48));
        const baseY = height * (0.61 + Math.sin(progress * Math.PI * 4.4) * 0.1);
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

    function sampleRibbonPoint(
      time: number,
      side: -1 | 1,
      offset: number,
      verticalOffset: number,
      progress: number,
    ) {
      const x = width / 2 + side * progress * width * 0.68;
      const pointerFalloff = Math.max(0, 1 - Math.abs(x - pointer.x) / 360);
      const pointerLift =
        (pointer.y - height * 0.64) * 0.045 * pointerFalloff * pointer.strength;
      const wave =
        Math.sin(progress * 9 + time * 0.0009 + offset) * 34 +
        Math.sin(progress * 17 - time * 0.0007 + offset) * 12;

      return {
        x,
        y: height * 0.64 + wave * (0.24 + progress * 0.72) + pointerLift + verticalOffset,
      };
    }

    function drawRibbon(time: number, side: -1 | 1, offset: number, verticalOffset = 0) {
      const context = activeContext;
      context.beginPath();
      for (let i = 0; i <= meshProfile.samples; i += 1) {
        const progress = i / meshProfile.samples;
        const point = sampleRibbonPoint(time, side, offset, verticalOffset, progress);

        if (i === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      }
      context.stroke();
    }

    function drawCrossConnections(time: number, side: -1 | 1) {
      const context = activeContext;
      context.save();
      context.strokeStyle = `rgba(255, 38, 44, ${0.09 * meshProfile.opacityScale})`;
      context.lineWidth = 0.42;

      for (
        let sample = meshProfile.crossStep;
        sample < meshProfile.samples;
        sample += meshProfile.crossStep
      ) {
        const progress = sample / meshProfile.samples;
        context.beginPath();
        for (let layer = 0; layer < meshProfile.layers; layer += 1) {
          const verticalOffset = (layer - (meshProfile.layers - 1) / 2) * 30;
          const point = sampleRibbonPoint(
            time + layer * 180,
            side,
            layer * 0.39,
            verticalOffset,
            progress,
          );
          if (layer === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.stroke();
      }

      context.restore();
    }

    function drawTelemetrySpikes(time: number) {
      const context = activeContext;
      context.save();
      context.lineWidth = 0.7;

      for (
        let index = meshProfile.spikeStep;
        index < meshProfile.samples;
        index += meshProfile.spikeStep
      ) {
        const side: -1 | 1 = index % 2 === 0 ? -1 : 1;
        const progress = index / meshProfile.samples;
        const point = sampleRibbonPoint(time, side, index * 0.17, 0, progress);
        const heightScale = 18 + ((index * 13) % 58);
        context.strokeStyle = `rgba(255, 48, 52, ${0.12 * meshProfile.opacityScale})`;
        context.beginPath();
        context.moveTo(point.x, point.y + 8);
        context.lineTo(point.x, point.y - heightScale);
        context.stroke();
        context.fillStyle = `rgba(255, 68, 72, ${0.32 * meshProfile.opacityScale})`;
        context.fillRect(point.x - 1, point.y - heightScale - 2, 2, 2);
      }

      context.restore();
    }

    function drawConnections() {
      const context = activeContext;

      for (let i = 0; i < particles.length; i += 2) {
        const particle = particles[i];
        const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);

        if (distance < 210 && pointer.strength > 0) {
          context.beginPath();
          context.moveTo(pointer.x, pointer.y);
          context.lineTo(particle.x, particle.y);
          context.strokeStyle = `rgba(255, 45, 52, ${0.18 * (1 - distance / 210) * pointer.strength})`;
          context.lineWidth = 0.6;
          context.stroke();
        }
      }
    }

    function drawGrid(time: number) {
      const context = activeContext;
      const spacing = width < 700 ? 88 : 116;
      const idleDriftX = Math.sin(time * 0.00035) * 8;
      const idleDriftY = Math.cos(time * 0.0003) * 7;
      const driftX =
        idleDriftX * (1 - pointer.strength) +
        (pointer.x / width - 0.5) * 18 * pointer.strength;
      const driftY =
        idleDriftY * (1 - pointer.strength) +
        (pointer.y / height - 0.5) * 14 * pointer.strength;

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

    function render(time: number, scheduleNext = true) {
      if (document.hidden && scheduleNext) {
        animationId = window.requestAnimationFrame(render);
        return;
      }

      if (scheduleNext && time - lastFrame < frameInterval) {
        animationId = window.requestAnimationFrame(render);
        return;
      }

      lastFrame = time;
      const motionTime = reduceMotion ? 0 : time;
      const context = activeContext;
      frame += 1;
      context.clearRect(0, 0, width, height);

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.08;

      context.fillStyle = backdrop ?? "rgba(22,0,0,0.35)";
      context.fillRect(0, 0, width, height);
      drawGrid(motionTime);

      context.save();
      context.globalCompositeOperation = "lighter";
      for (let layer = 0; layer < meshProfile.layers; layer += 1) {
        const verticalOffset = (layer - (meshProfile.layers - 1) / 2) * 30;
        context.lineWidth = layer % 3 === 0 ? 0.82 : 0.44;
        context.strokeStyle = `rgba(255, ${28 + layer * 2}, ${34 + layer * 2}, ${(0.07 + layer * 0.007) * meshProfile.opacityScale})`;
        drawRibbon(motionTime + layer * 180, -1, layer * 0.39, verticalOffset);
        drawRibbon(motionTime + layer * 180, 1, Math.PI + layer * 0.39, verticalOffset);
      }
      context.lineWidth = 1.15;
      context.strokeStyle = `rgba(255, 25, 34, ${0.3 * meshProfile.opacityScale})`;
      drawRibbon(motionTime, -1, 0);
      drawRibbon(motionTime, 1, Math.PI);
      context.lineWidth = 0.5;
      context.strokeStyle = `rgba(255, 70, 74, ${0.18 * meshProfile.opacityScale})`;
      drawRibbon(motionTime + 1800, -1, 1.2);
      drawRibbon(motionTime + 1800, 1, 2.4);
      drawCrossConnections(motionTime, -1);
      drawCrossConnections(motionTime, 1);
      drawTelemetrySpikes(motionTime);

      particles.forEach((particle) => {
        const distanceX = particle.baseX - pointer.x;
        const distanceY = particle.baseY - pointer.y;
        const distance = Math.hypot(distanceX, distanceY);
        const influence = Math.max(0, 1 - distance / 310) * pointer.strength;
        const drift = Math.sin(motionTime * 0.001 * particle.depth + particle.phase);

        particle.x =
          particle.baseX +
          drift * 22 * particle.depth +
          Math.sin(motionTime * 0.00018 + particle.phase) * particle.vx * 90 +
          (distanceX / Math.max(distance, 1)) * influence * 26;
        particle.y =
          particle.baseY +
          Math.cos(motionTime * 0.00075 * particle.depth + particle.phase) * 34 +
          Math.cos(motionTime * 0.00016 + particle.phase) * particle.vy * 90 +
          (distanceY / Math.max(distance, 1)) * influence * 20;

        if (particle.x < -60 || particle.x > width + 60 || particle.y < -60 || particle.y > height + 60) {
          particle.x = particle.baseX;
          particle.y = particle.baseY;
        }

        const alpha = 0.16 + Math.sin((reduceMotion ? 0 : frame * 0.045) + particle.phase) * 0.1;
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
      context.moveTo(width * 0.27, height * 0.47);
      context.lineTo(width * 0.73, height * 0.47);
      context.stroke();
      context.restore();

      if (scheduleNext) {
        animationId = window.requestAnimationFrame(render);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      pointer.targetStrength = 1;
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
      pointer.targetStrength = 0;
    }

    function handleResize() {
      reset();
      if (reduceMotion) {
        render(0, false);
      }
    }

    reset();
    render(0, false);
    if (!reduceMotion) {
      animationId = window.requestAnimationFrame(render);
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
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
