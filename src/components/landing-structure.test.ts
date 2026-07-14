import { existsSync, readFileSync } from "node:fs";
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

  it("uses the exact reference positioning and operational copy", () => {
    const brand = source("src/components/brand-stage.tsx");
    expect(brand).toContain("STRUCTURE. CONTEXT. EXECUTION.");
    expect(brand).toContain("WE TURN COMPANY SIGNALS");
    expect(brand).toContain("INTO REVIEWED, APPROVED,");
    expect(brand).toContain("ACTIONABLE WORK.");
    expect(brand).toContain("Raxos is a company OS. A project-centered");
    expect(brand).toContain("operating layer for teams who demand");
    expect(brand).toContain("clarity, speed, and control.");
    expect(brand).toContain("BUILT FOR OPERATORS");
    expect(brand).not.toContain("AI workflows, agents, tasks, and operators");
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
    expect(css).toContain("clip-path: var(--polygon-outer)");
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
      /render\(0, false\);\s*if \(!reduceMotion\) \{\s*animationId = window\.requestAnimationFrame\(render\);\s*\}/s,
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

  it("renders primary brand and contact content without waiting for animation frames", () => {
    const form = source("src/components/enquiry-form.tsx");
    const logo = source("src/components/raxos-logo.tsx");

    expect(form).not.toContain("initial={{ opacity: 0");
    expect(logo).not.toContain('initial="hidden"');
  });

  it("locks the desktop composition to the reference geometry", () => {
    const css = source("src/app/globals.css");

    expect(css).toContain("width: min(calc(100% - 80px), 1366px)");
    expect(css).toContain("grid-template-columns: minmax(0, 658px) minmax(480px, 520px)");
    expect(css).toContain("padding-top: 44px");
    expect(css).toContain("min-height: 254px");
    expect(css).toContain("min-height: 760px");
    expect(css).toContain("margin-top: 40px");
  });

  it("paints the interactive background before scheduling animation", () => {
    const background = source("src/components/interactive-background.tsx");
    expect(background).toContain("reset();\n    render(0, false);\n    if (!reduceMotion)");
  });

  it("loads the reference-fidelity override layer after global styles", () => {
    const layout = source("src/app/layout.tsx");
    const fidelityPath = join(process.cwd(), "src/app/fidelity.css");

    expect(layout).toContain('import "./fidelity.css"');
    expect(existsSync(fidelityPath)).toBe(true);
  });

  it("matches the reference radar scale and form inset rhythm", () => {
    const fidelity = source("src/app/fidelity.css");

    expect(fidelity).toContain("width: min(29vw, 430px)");
    expect(fidelity).toContain("margin-bottom: -90px");
    expect(fidelity).toContain("width: 39%");
    expect(fidelity).toContain("padding: 36px 50px 32px");
    expect(fidelity).toContain("margin: 0 0 27px");
    expect(fidelity).toContain("gap: 9px");
  });

  it("includes the reference header identity and three-part footer", () => {
    const chrome = source("src/components/interface-chrome.tsx");

    expect(chrome).toContain("header-emblem");
    expect(chrome).toContain("identity-copy");
    expect(chrome).toContain("RAXOS CORP. ALL RIGHTS RESERVED.");
    expect(chrome).toContain("interface-secure");
  });

  it("draws a layered lower data mesh", () => {
    const background = source("src/components/interactive-background.tsx");
    expect(background).toContain("verticalOffset = 0");
    expect(background).toContain("for (let layer = 0; layer < 9; layer += 1)");
  });

  it("builds crisp layered polygons for every clipped surface", () => {
    const chrome = source("src/components/interface-chrome.tsx");
    const brand = source("src/components/brand-stage.tsx");
    const form = source("src/components/enquiry-form.tsx");
    const css = source("src/app/globals.css");

    expect(chrome).toContain('className="polygon-fill frame-fill"');
    expect(brand).toContain('className="polygon-fill brief-fill"');
    expect(form).toContain('className="polygon-fill panel-fill"');
    expect(form).toContain('className="polygon-fill button-fill"');
    expect(css).toContain("--polygon-outer");
    expect(css).toContain("--polygon-inner");
    expect(css).toMatch(/\.polygon-fill\s*{[^}]*clip-path: var\(--polygon-inner\)/s);
  });
});
