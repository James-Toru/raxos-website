"use client";

import { motion, MotionConfig } from "framer-motion";
import { CustomCursor } from "@/components/custom-cursor";
import { EnquiryForm } from "@/components/enquiry-form";
import { InteractiveBackground } from "@/components/interactive-background";
import { RaxosLogo } from "@/components/raxos-logo";

export function LandingShell() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-hidden bg-[#020202] text-zinc-100">
        <CustomCursor />
        <InteractiveBackground />
        <div className="scanlines" aria-hidden="true" />
        <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px] lg:gap-14">
            <motion.div
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="logo-stage">
                <RaxosLogo />
                <motion.div
                  className="logo-scan"
                  aria-hidden="true"
                  animate={{ x: ["-18%", "118%"], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <motion.div
                className="laser-line"
                aria-hidden="true"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.p
                className="mt-8 max-w-2xl text-balance text-2xl font-medium leading-relaxed tracking-[0.08em] text-zinc-200/90 sm:text-3xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.68 }}
              >
                The command layer where humans, AI agents, workflows, and
                automations coordinate company execution.
              </motion.p>
            </motion.div>
            <EnquiryForm />
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
