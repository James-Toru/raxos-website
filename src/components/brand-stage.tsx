"use client";

import { motion } from "framer-motion";
import { RaxosLogo, RaxosMark } from "@/components/raxos-logo";

export function BrandStage() {
  return (
    <motion.section className="brand-stage" aria-labelledby="raxos-positioning">
      <div className="radar-stage">
        <div className="radar-rings" aria-hidden="true" />
        <RaxosMark />
      </div>
      <RaxosLogo />
      <p id="raxos-positioning" className="positioning-line">
        STRUCTURE. CONTEXT. EXECUTION.
      </p>
      <article className="company-brief">
        <div className="brief-circuit" aria-hidden="true" />
        <div>
          <h1>
            <span>WE TURN COMPANY SIGNALS</span>
            <br />
            INTO REVIEWED, APPROVED,
            <br />
            ACTIONABLE WORK.
          </h1>
          <p>
            Raxos is the command layer connecting AI workflows, agents, tasks, and operators with
            the context required to execute.
          </p>
          <p className="operator-note">
            BUILT FOR OPERATORS <span aria-hidden="true">→</span>
          </p>
        </div>
      </article>
    </motion.section>
  );
}
