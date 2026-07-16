"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RaxosMark } from "@/components/raxos-logo";

type BootPhase = "CORE HANDSHAKE" | "LINKING VISUAL FEED" | "DECODING TOWER ASSET" | "SYSTEMS ONLINE";

export function SiteBootSequence() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(4);
  const [phase, setPhase] = useState<BootPhase>("CORE HANDSHAKE");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    let completed = false;
    let exitTimer = 0;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const image = new Image();
    const imageReady = new Promise<void>((resolve) => {
      function decoded() {
        if (typeof image.decode === "function") {
          image.decode().catch(() => undefined).finally(resolve);
        } else {
          resolve();
        }
      }

      image.onload = decoded;
      image.onerror = () => resolve();
      image.src = "/raxos-tower.png";
      if (image.complete) decoded();
    });

    const minimumDisplay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, reduceMotion ? 220 : 1600);
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    const phaseTimers = [
      window.setTimeout(() => !cancelled && setPhase("LINKING VISUAL FEED"), 280),
      window.setTimeout(() => !cancelled && setPhase("DECODING TOWER ASSET"), 660),
    ];
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(91, current + 3 + Math.floor(Math.random() * 7)));
    }, reduceMotion ? 70 : 115);

    function completeBoot() {
      if (cancelled || completed) return;
      completed = true;
      window.clearInterval(progressTimer);
      setProgress(100);
      setPhase("SYSTEMS ONLINE");
      exitTimer = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        setVisible(false);
      }, reduceMotion ? 80 : 520);
    }

    Promise.all([imageReady, fontsReady, minimumDisplay]).then(completeBoot);
    const safetyTimer = window.setTimeout(completeBoot, 7000);

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
      phaseTimers.forEach(window.clearTimeout);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(exitTimer);
      window.clearInterval(progressTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="site-boot"
          data-phase={phase === "SYSTEMS ONLINE" ? "ready" : "loading"}
          initial={false}
          exit={{ opacity: 0, scale: 1.025, filter: "blur(8px) brightness(1.7)" }}
          transition={{ duration: reduceMotion ? .01 : .68, ease: [0.4, 0, 0.2, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`Raxos loading: ${phase}`}
        >
          <span className="site-boot-grid" aria-hidden="true" />
          <span className="site-boot-scan" aria-hidden="true" />
          <span className="site-boot-frame" aria-hidden="true" />

          <div className="site-boot-telemetry" aria-hidden="true">
            <span>RAXOS CORP // SECURE BOOT</span>
            <span>CHANNEL 00—INIT</span>
          </div>

          <div className="site-boot-core">
            <div className="site-boot-mark" aria-hidden="true">
              <span className="site-boot-orbit site-boot-orbit-a" />
              <span className="site-boot-orbit site-boot-orbit-b" />
              <RaxosMark />
            </div>

            <p className="site-boot-kicker">{"// INITIALIZING COMMAND LAYER"}</p>
            <h1 data-text="RAXOS SYSTEMS">RAXOS SYSTEMS</h1>
            <p className="site-boot-phase">{phase}<i /></p>

            <div
              className="site-boot-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="site-boot-readout" aria-hidden="true">
              <span>VISUAL ASSET // TOWER-01</span>
              <strong>{progress.toString().padStart(3, "0")}%</strong>
            </div>
          </div>

          <div className="site-boot-footer" aria-hidden="true">
            <span>ENCRYPTION // ACTIVE</span>
            <span>35.6895° N, 139.6917° E</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
