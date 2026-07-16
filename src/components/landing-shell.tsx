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
        <InterfaceChrome>
          <InteractiveBackground />
          <div className="scanlines" aria-hidden="true" />
          <div className="poster-layout">
            <BrandStage />
            <section className="contact-deck" aria-label="Contact Raxos">
              <span className="deck-frame" aria-hidden="true" />
              <EnquiryForm />
            </section>
          </div>
        </InterfaceChrome>
      </main>
    </MotionConfig>
  );
}
