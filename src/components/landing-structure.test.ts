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

  it("uses inline shared validation and an accessible form name", () => {
    const form = source("src/components/enquiry-form.tsx");
    const validationCall = form.indexOf("validateEnquiryFields(form)");
    const fetchCall = form.indexOf('fetch("/api/enquiry"');

    expect(form).toContain("noValidate");
    expect(form).toContain('id="enquiry-form-title"');
    expect(form).toContain('aria-labelledby="enquiry-form-title"');
    expect(form).toContain('name="name"');
    expect(form).toContain('name="email"');
    expect(form).toContain('name="message"');
    expect(form).toContain("invalidField.focus()");
    expect(validationCall).toBeGreaterThan(-1);
    expect(fetchCall).toBeGreaterThan(validationCall);
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

  it("uses opaque panel copy colors with accessible contrast", () => {
    const css = source("src/app/globals.css");

    expect(css).toMatch(/\.form-intro\s*{[^}]*color: #cfd0d3;/s);
    expect(css).toMatch(/\.security-note\s*{[^}]*color: #bfc0c4;/s);
  });

  it("renders reduced-motion canvas frames without starting an animation loop", () => {
    const background = source("src/components/interactive-background.tsx");

    expect(background).toContain("function render(time: number, scheduleNext = true)");
    expect(background).toMatch(
      /if \(reduceMotion\) \{\s*render\(0, false\);\s*\} else \{\s*animationId = window\.requestAnimationFrame\(render\);\s*\}/s,
    );
    expect(background).toMatch(
      /function handleResize\(\) \{\s*reset\(\);\s*if \(reduceMotion\) \{\s*render\(0, false\);\s*\}\s*\}/s,
    );
    expect(background).toContain('window.addEventListener("resize", handleResize)');
  });

  it("keeps repository lint scoped away from generated worktree artifacts", () => {
    const eslintConfig = source("eslint.config.mjs");
    expect(eslintConfig).toContain('".worktrees/**"');
  });
});
