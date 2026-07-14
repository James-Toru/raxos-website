"use client";

import { MotionConfig } from "framer-motion";
import { BrandStage } from "@/components/brand-stage";
import { CustomCursor } from "@/components/custom-cursor";
import { EnquiryForm } from "@/components/enquiry-form";
import { InteractiveBackground } from "@/components/interactive-background";
import { InterfaceChrome } from "@/components/interface-chrome";

export function LandingShell() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="command-interface">
        <CustomCursor />
        <InteractiveBackground />
        <div className="scanlines" aria-hidden="true" />
        <InterfaceChrome>
          <section className="command-grid" aria-label="Raxos company introduction">
            <BrandStage />
            <EnquiryForm />
          </section>
        </InterfaceChrome>
      </main>
    </MotionConfig>
  );
}
