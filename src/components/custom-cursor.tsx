"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }
    const activeCursor = cursor;

    let animationId = 0;
    let active = false;
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;

    function render() {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      activeCursor.style.transform = `translate3d(${currentX - 22}px, ${currentY - 22}px, 0)`;
      animationId = window.requestAnimationFrame(render);
    }

    function handleMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target instanceof Element
        ? event.target.closest("a, button, input, textarea, label")
        : null;
      activeCursor.dataset.target = target ? "true" : "false";

      if (readoutRef.current) {
        readoutRef.current.textContent = `${String(event.clientX).padStart(4, "0")}:${String(event.clientY).padStart(4, "0")}`;
      }

      if (!active) {
        active = true;
        activeCursor.dataset.active = "true";
      }
    }

    function handleDown() {
      activeCursor.dataset.pressed = "true";
    }

    function handleUp() {
      activeCursor.dataset.pressed = "false";
    }

    function handleLeave() {
      active = false;
      activeCursor.dataset.active = "false";
    }

    animationId = window.requestAnimationFrame(render);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      data-active="false"
      data-pressed="false"
      data-target="false"
    >
      <span className="cursor-core" />
      <i className="cursor-orbit" />
      <b className="cursor-brackets" />
      <em ref={readoutRef} className="cursor-readout">SYS//TRK</em>
    </div>
  );
}
