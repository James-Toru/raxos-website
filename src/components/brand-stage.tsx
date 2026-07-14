"use client";

import { motion } from "framer-motion";
import { RaxosLogo } from "@/components/raxos-logo";

export function BrandStage() {
  return (
    <motion.section className="brand-stage" aria-labelledby="raxos-positioning">
      <RaxosLogo />
      <p id="raxos-positioning" className="positioning-line">
        STRUCTURE. CONTEXT. EXECUTION.
      </p>
    </motion.section>
  );
}
