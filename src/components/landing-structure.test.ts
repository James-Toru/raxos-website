import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("Raxos command interface", () => {
  it("composes the reference chrome, brand stage, and contact panel", () => {
    const shell = source("src/components/landing-shell.tsx");
    const chromePath = join(process.cwd(), "src/components/interface-chrome.tsx");

    expect(shell).toContain("command-interface");
    expect(shell).toContain("<InterfaceChrome>");
    expect(shell).toContain("<BrandStage />");
    expect(shell).toContain("<EnquiryForm />");
    expect(existsSync(chromePath)).toBe(true);

    if (!existsSync(chromePath)) return;
    const chrome = readFileSync(chromePath, "utf8");
    expect(chrome).toContain("RAXOS CORP.");
    expect(chrome).toContain("SYSTEM STATUS");
    expect(chrome).toContain("SECURE CHANNEL ESTABLISHED");
    expect(chrome).toContain("STRUCTURE");
    expect(chrome).toContain("CONTEXT");
    expect(chrome).toContain("EXECUTION");
  });

  it("uses the reference positioning and operational copy", () => {
    const brand = source("src/components/brand-stage.tsx");
    expect(brand).toContain("STRUCTURE. CONTEXT. EXECUTION.");
    expect(brand).toContain("WE TURN COMPANY SIGNALS");
    expect(brand).toContain("AI workflows, agents, tasks, and operators");
    expect(brand).toContain("BUILT FOR OPERATORS");
  });

  it("matches the reference contact-panel language and field set", () => {
    const form = source("src/components/enquiry-form.tsx");
    expect(form).toContain("// INITIATE CONTACT");
    expect(form).toContain("INTERESTED IN");
    expect(form).toContain("RAXOS?");
    expect(form).toContain("Leave your details and our team will reach out to you.");
    expect(form).toContain("SEND MESSAGE");
    expect(form).toContain("ALL COMMUNICATIONS ARE ENCRYPTED");
    expect(form).toContain('placeholder="Your Name"');
    expect(form).toContain('placeholder="you@company.com"');
    expect(form).toContain('placeholder="Your Company"');
    expect(form).toContain('placeholder="Tell us about your needs..."');
  });

  it("defines the clipped desktop frame and responsive fidelity rules", () => {
    const css = source("src/app/globals.css");
    expect(css).toContain(".command-frame");
    expect(css).toContain(".command-grid");
    expect(css).toContain(".radar-rings");
    expect(css).toContain(".company-brief");
    expect(css).toContain("clip-path: polygon");
    expect(css).toContain("@media (max-width: 900px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps repository lint scoped away from generated worktree artifacts", () => {
    const eslintConfig = source("eslint.config.mjs");
    expect(eslintConfig).toContain('".worktrees/**"');
  });
});
