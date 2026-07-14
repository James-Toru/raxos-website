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

  it("uses distinct desktop and mobile data-mesh profiles", () => {
    const background = source("src/components/interactive-background.tsx");

    expect(background).toContain("const DESKTOP_MESH_PROFILE");
    expect(background).toContain("layers: 13");
    expect(background).toContain("samples: 96");
    expect(background).toContain("particleCap: 168");
    expect(background).toContain("frameRate: 30");
    expect(background).toContain("const MOBILE_MESH_PROFILE");
    expect(background).toContain("layers: 6");
    expect(background).toContain("samples: 56");
    expect(background).toContain("particleCap: 72");
    expect(background).toContain("frameRate: 22");
  });

  it("draws a connected telemetry mesh with eased pointer influence", () => {
    const background = source("src/components/interactive-background.tsx");

    expect(background).toContain("function sampleRibbonPoint(");
    expect(background).toContain("function drawCrossConnections(");
    expect(background).toContain("function drawTelemetrySpikes(");
    expect(background).toContain("targetStrength");
    expect(background).toMatch(/pointer\.strength \+= \(pointer\.targetStrength - pointer\.strength\) \* 0\.08/);
    expect(background).toContain("pointer.targetStrength = 0");
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
    expect(fidelity).toContain("padding: 36px 50px 32px");
    expect(fidelity).toContain("margin: 0 0 27px");
    expect(fidelity).toContain("gap: 9px");
  });

  it("keeps the reference radar free of broad offset glow disks", () => {
    const global = source("src/app/globals.css");
    const radarTargetLayers = [...global.matchAll(/\.radar-stage::after\s*\{([\s\S]*?)\}/g)].map(
      (match) => match[1],
    );

    expect(radarTargetLayers.length).toBeGreaterThan(0);
    expect(radarTargetLayers.every((layer) => !layer.includes("box-shadow"))).toBe(true);
  });

  it("calibrates the reconstructed brand artwork to the desktop reference", () => {
    const global = source("src/app/globals.css");
    const fidelity = source("src/app/fidelity.css");
    expect(global).toContain(".raxos-mark .mark-face");
    expect(global).toContain(".raxos-mark .mark-depth");
    expect(global).toContain(".raxos-mark .mark-facet");
    expect(global).toContain(".raxos-logo .logo-facet");
    expect(global).toContain(".desktop-copy-break");
    expect(fidelity).toContain("width: 165px");
    expect(fidelity).toContain("height: 160px");
    expect(fidelity).toContain("width: 470px");
    expect(fidelity).toContain("height: 62px");
    expect(fidelity).toContain("margin-bottom: 11px");
    expect(fidelity).toContain("translateX(9px)");
  });

  it("keeps the sharp wordmark free of a bright outer glow fringe", () => {
    const global = source("src/app/globals.css");
    const logoRule = global.match(/\.raxos-logo\s*\{([\s\S]*?)\}/)?.[1];

    expect(logoRule).toBeDefined();
    const shadows = [...(logoRule ?? "").matchAll(/drop-shadow\((.*)\)/g)].map(
      (match) => match[1],
    );

    expect(shadows.length).toBeGreaterThan(0);
    expect(
      shadows.some((shadow) => {
        const offsets = shadow.match(/^\s*(-?[\d.]+)[a-z%]*\s+(-?[\d.]+)[a-z%]*/i);
        return offsets !== null && Number(offsets[2]) > 0;
      }),
    ).toBe(true);

    for (const shadow of shadows) {
      const offsets = shadow.match(/^\s*(-?[\d.]+)[a-z%]*\s+(-?[\d.]+)[a-z%]*/i);
      const rgb = shadow.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
      const hex = shadow.match(/#([\da-f]{3}|[\da-f]{6})(?:[\da-f]{2})?\b/i)?.[1];
      const channels = rgb
        ? rgb.slice(1, 4).map(Number)
        : hex
          ? (hex.length === 3 ? [...hex].map((channel) => channel.repeat(2)) : hex.match(/../g) ?? [])
              .map((channel) => Number.parseInt(channel, 16))
          : [];
      const isZeroOffset = offsets !== null && Number(offsets[1]) === 0 && Number(offsets[2]) === 0;
      const isBright = channels.length === 3 && Math.max(...channels) >= 200;

      expect(isZeroOffset && isBright).toBe(false);
    }
  });

  it("keeps the short-desktop wordmark proportional when its width responds", () => {
    const fidelity = source("src/app/fidelity.css");
    const shortDesktop = fidelity.match(
      /@media \(max-height: 850px\) and \(min-width: 1101px\) \{([\s\S]*?)(?=\n@media|$)/,
    )?.[1];
    const logoRule = shortDesktop?.match(/\.raxos-logo\s*\{([\s\S]*?)\}/)?.[1];

    expect(logoRule).toBeDefined();
    expect(logoRule).toMatch(/width:\s*min\(100%, 490px\)/);
    expect(logoRule).toMatch(/height:\s*auto/);
  });

  it("moves system status above the form border on short desktops", () => {
    const fidelity = source("src/app/fidelity.css");
    const start = fidelity.indexOf("@media (max-height: 850px) and (min-width: 1101px)");
    const end = fidelity.indexOf("\n@media", start + 1);
    const compactDesktop = fidelity.slice(start, end);
    expect(compactDesktop).toMatch(/\.system-status\s*\{[^}]*padding-top:\s*20px;/s);
  });

  it("includes the text-only header identity and three-part footer", () => {
    const chrome = source("src/components/interface-chrome.tsx");

    expect(chrome).not.toContain("header-emblem");
    expect(chrome).toContain("identity-copy");
    expect(chrome).toContain("RAXOS CORP.");
    expect(chrome).toContain("SYSTEM INTERFACE v2.4.7");
    expect(chrome).toContain("RAXOS CORP. ALL RIGHTS RESERVED.");
    expect(chrome).toContain("interface-secure");
  });

  it("draws a profile-driven layered lower data mesh", () => {
    const background = source("src/components/interactive-background.tsx");
    expect(background).toContain("verticalOffset = 0");
    expect(background).toContain("layer < meshProfile.layers");
    expect(background).toContain("drawCrossConnections(motionTime");
    expect(background).toContain("drawTelemetrySpikes(motionTime");
  });

  it("uses the tuned dense-flow mesh constants", () => {
    const background = source("src/components/interactive-background.tsx");
    const layerSpacing =
      background.match(/\(layer - \(meshProfile\.layers - 1\) \/ 2\) \* 24/g) ?? [];

    expect(background).toContain("pointer.y - height * 0.68");
    expect(background).toContain("y: height * 0.68");
    expect(layerSpacing).toHaveLength(2);
    expect(background).toContain("0.14 * meshProfile.opacityScale");
    expect(background).toContain("0.45 * meshProfile.opacityScale");
    expect(background).toContain('context.strokeStyle = "rgba(255, 28, 34, 0.025)"');
  });

  it("clips the data mesh to the lower viewport band", () => {
    const background = source("src/components/interactive-background.tsx");

    expect(background).toContain("const meshTop = height * (width < 700 ? 0.6 : 0.56)");
    expect(background).toContain("context.rect(0, meshTop, width, height - meshTop)");
    expect(background).toMatch(
      /context\.beginPath\(\);\s*context\.rect\(0, meshTop, width, height - meshTop\);\s*context\.clip\(\);/s,
    );
  });

  it("stacks the canvas inside the opaque frame and below foreground chrome", () => {
    const shell = source("src/components/landing-shell.tsx");
    const css = source("src/app/globals.css");
    const fidelity = source("src/app/fidelity.css");
    const chromeStart = shell.indexOf("<InterfaceChrome>");
    const background = shell.indexOf("<InteractiveBackground />", chromeStart);
    const scanlines = shell.indexOf('<div className="scanlines"', background);
    const foreground = shell.indexOf('<section className="command-grid"', scanlines);

    expect(chromeStart).toBeGreaterThan(-1);
    expect(background).toBeGreaterThan(chromeStart);
    expect(scanlines).toBeGreaterThan(background);
    expect(foreground).toBeGreaterThan(scanlines);
    expect(css).not.toMatch(/\.frame-fill\s*\{/);
    expect(css).toMatch(/\.interface-chrome > canvas\s*\{/);
    expect(fidelity).toMatch(/\.interface-chrome > canvas\s*\{/);
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
