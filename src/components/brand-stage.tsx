"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RaxosLogo, RaxosMark } from "@/components/raxos-logo";

export function BrandStage() {
  const stageRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const towerDrift = useTransform(scrollYProgress, [0, 1], [0, 92]);
  const lockupDrift = useTransform(scrollYProgress, [0, 1], [0, -72]);

  return (
    <motion.section ref={stageRef} className="brand-stage" aria-labelledby="raxos-positioning">
      <motion.div
        className="tower-art"
        aria-hidden="true"
        style={{ y: reduceMotion ? 0 : towerDrift }}
      />
      <div className="hero-vignette" aria-hidden="true" />
      <motion.div
        className="brand-lockup"
        style={{ y: reduceMotion ? 0 : lockupDrift }}
      >
        <div className="radar-stage">
          <div className="radar-rings" aria-hidden="true" />
          <RaxosMark />
        </div>
        <RaxosLogo />
        <p className="brand-japanese"><span>ラクソス・コーポレーション</span></p>
        <p id="raxos-positioning" className="positioning-line">
          STRUCTURE.<br />CONTEXT.<br />EXECUTION.
        </p>
        <h1
          className="hero-statement glitch-statement"
          data-text="RAXOS BUILDS SYSTEMS TO OPERATE COMPANIES AS AUTONOMOUSLY AS POSSIBLE."
        >
          RAXOS BUILDS SYSTEMS TO<br />
          OPERATE COMPANIES AS<br />
          AUTONOMOUSLY AS POSSIBLE.
        </h1>
      </motion.div>
      <div className="scroll-readout" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span><i />
      </div>
    </motion.section>
  );
}
