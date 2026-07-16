import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("Raxos scrollable command poster", () => {
  it("composes a poster hero followed by the contact deck", () => {
    const shell = source("src/components/landing-shell.tsx");

    expect(shell).toContain("poster-layout");
    expect(shell).toContain("<BrandStage />");
    expect(shell).toContain("contact-deck");
    expect(shell).toContain("deck-frame");
    expect(shell).toContain("<EnquiryForm />");
    expect(shell.indexOf("<BrandStage />")).toBeLessThan(shell.indexOf("<EnquiryForm />"));
  });

  it("uses the supplied portrait tower artwork", () => {
    const css = source("src/app/globals.css");

    expect(existsSync(join(process.cwd(), "public/raxos-tower.png"))).toBe(true);
    expect(existsSync(join(process.cwd(), "public/raxos-tower.avif"))).toBe(true);
    expect(existsSync(join(process.cwd(), "public/raxos-tower.webp"))).toBe(true);
    expect(css).toMatch(/\.tower-art\s*\{[^}]*url\("\/raxos-tower\.avif"\)/s);
    expect(css).toContain('url("/raxos-tower.webp") type("image/webp")');
    expect(css).toContain('url("/raxos-tower.png") type("image/png")');
    expect(css).toContain("background-position: 74% 24px");
    expect(css).toContain("background-size: min(72%, 760px) auto");
  });

  it("retains the core Raxos positioning copy", () => {
    const brand = source("src/components/brand-stage.tsx");

    expect(brand).toContain("STRUCTURE.");
    expect(brand).toContain("CONTEXT.");
    expect(brand).toContain("EXECUTION.");
    expect(brand).toContain("RAXOS BUILDS SYSTEMS TO");
    expect(brand).toContain("OPERATE COMPANIES AS");
    expect(brand).toContain("AUTONOMOUSLY AS POSSIBLE.");
  });

  it("reuses the custom Raxos mark and wordmark", () => {
    const brand = source("src/components/brand-stage.tsx");
    const chrome = source("src/components/interface-chrome.tsx");

    expect(brand).toContain("<RaxosMark />");
    expect(brand).toContain("<RaxosLogo />");
    expect(chrome).toContain("<RaxosMark />");
    expect(chrome).toContain("cyber-glyph-rail");
    expect(chrome).not.toContain("構造");
  });

  it("matches the reference contact language and fields", () => {
    const form = source("src/components/enquiry-form.tsx");

    expect(form).toContain("// INITIATE CONTACT");
    expect(form).toContain("INTERESTED");
    expect(form).toContain("RAXOS?");
    expect(form).toContain("GLOBAL BY DESIGN.");
    expect(form).toContain("SEND MESSAGE");
    expect(form).toContain("ALL COMMUNICATIONS ARE ENCRYPTED");
    expect(form).toContain("form-frame");
    expect(form).toContain('placeholder="Your Name"');
    expect(form).toContain('placeholder="you@company.com"');
    expect(form).toContain('placeholder="Your Company"');
    expect(form).toContain('placeholder="Tell us about your needs..."');
  });

  it("keeps validation ahead of the enquiry request", () => {
    const form = source("src/components/enquiry-form.tsx");
    const validationCall = form.indexOf("validateEnquiryFields(form)");
    const fetchCall = form.indexOf('fetch("/api/enquiry"');

    expect(form).toContain("noValidate");
    expect(form).toContain('"enquiry-form-title"');
    expect(form).toContain('"enquiry-modal-form-title"');
    expect(form).toContain("invalidField.focus()");
    expect(validationCall).toBeGreaterThan(-1);
    expect(fetchCall).toBeGreaterThan(validationCall);
  });

  it("provides clipped poster chrome and a two-column desktop form", () => {
    const css = source("src/app/globals.css");

    expect(css).toContain("--frame-outer: polygon(");
    expect(css).toContain("--frame-inner: polygon(");
    expect(css).toContain("min-height: 1484px");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) clamp(360px, 36vw, 500px)");
    expect(css).toContain("height: 560px");
    expect(css).toContain("--form-outer: polygon(");
    expect(css).toContain("position: fixed");
    expect(css).toContain(".deck-frame");
    expect(css).toContain(".form-frame");
  });

  it("stacks the contact form on narrow screens", () => {
    const css = source("src/app/globals.css");

    expect(css).toContain("@media (max-width: 800px)");
    expect(css).toMatch(/@media \(max-width: 800px\)[\s\S]*?\.enquiry-panel \{ display: block;/);
    expect(css).toContain("@media (max-width: 420px)");
  });

  it("keeps the functional mesh behind foreground chrome", () => {
    const shell = source("src/components/landing-shell.tsx");
    const css = source("src/app/globals.css");

    expect(shell).toContain("<InteractiveBackground />");
    expect(css).toMatch(/\.interface-chrome > canvas\s*\{[^}]*z-index: 0/s);
    expect(css).toMatch(/\.poster-layout\s*\{[^}]*z-index: 3/s);
  });

  it("honors reduced-motion preferences", () => {
    const css = source("src/app/globals.css");
    const background = source("src/components/interactive-background.tsx");

    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(background).toContain("render(0, false)");
    expect(background).toContain("if (!reduceMotion)");
  });

  it("adds restrained glitch and scroll-linked motion effects", () => {
    const brand = source("src/components/brand-stage.tsx");
    const css = source("src/app/globals.css");

    expect(brand).toContain("useScroll");
    expect(brand).toContain("useReducedMotion");
    expect(brand).toContain("glitch-statement");
    expect(css).toContain("@keyframes tower-signal-break");
    expect(css).toContain("@keyframes tower-storm-bursts");
    expect(css).toContain("@keyframes skyline-lightning");
    expect(css).toContain("@keyframes copy-glitch-a");
    expect(css).toContain("@keyframes scroll-pulse");
    expect(css).toContain("@keyframes online-pulse");
    expect(css).toContain("@keyframes glyph-current");
  });

  it("uses a layered cyberpunk tracking cursor", () => {
    const cursor = source("src/components/custom-cursor.tsx");
    const css = source("src/app/globals.css");

    expect(cursor).toContain("cursor-core");
    expect(cursor).toContain("cursor-orbit");
    expect(cursor).toContain("cursor-brackets");
    expect(cursor).toContain("cursor-readout");
    expect(cursor).toContain('data-target="false"');
    expect(css).toContain("@keyframes cursor-orbit");
  });

  it("adds an isolated cinematic contact sequence", () => {
    const shell = source("src/components/landing-shell.tsx");
    const cinematic = source("src/components/cinematic-contact.tsx");
    const css = source("src/app/globals.css");

    expect(shell).toContain("<CinematicContact />");
    expect(cinematic).toContain('"entering"');
    expect(cinematic).toContain('"aiming"');
    expect(cinematic).toContain('"firing"');
    expect(cinematic).toContain('"cracked"');
    expect(cinematic).toContain('"blackout"');
    expect(cinematic).toContain('"matrix"');
    expect(cinematic).toContain('"modal"');
    expect(cinematic).toContain('<EnquiryForm variant="modal" />');
    expect(cinematic).toContain("<PlaceholderOperative phase={phase} />");
    expect(cinematic).toContain('<CrackImage visible={showCracks} target={target} />');
    expect(cinematic).toContain('className="cinematic-crack-image"');
    expect(cinematic).toContain("<GlassMorphImpact visible={showCracks} target={target} />");
    expect(cinematic).toContain("<RedCodeRain");
    expect(cinematic).toContain("codeRainGlyphs");
    expect(cinematic).toContain('matrix: [5000, "modal"]');
    expect(cinematic).toContain('phase === "cracked" || phase === "blackout"');
    expect(cinematic).toContain("SYSTEM RECONSTRUCTION // RAXOS");
    expect(cinematic).toContain("OCULAR LOCK // YOU");
    expect(cinematic).toContain("trackViewer");
    expect(css).toContain(".cinematic-blackout");
    expect(css).toContain(".red-code-rain");
    expect(css).toContain("height: 100dvh");
    expect(css).toContain("overscroll-behavior: contain");
    expect(css).toContain("--trigger-shape: polygon(");
    expect(css).toContain(".cinematic-trigger::after");
  });

  it("preloads the tower behind a functional cyberpunk boot sequence", () => {
    const layout = source("src/app/layout.tsx");
    const shell = source("src/components/landing-shell.tsx");
    const boot = source("src/components/site-boot-sequence.tsx");
    const css = source("src/app/globals.css");

    expect(layout).toContain('href="/raxos-tower.avif"');
    expect(layout).toContain('type="image/avif"');
    expect(shell).toContain("<SiteBootSequence />");
    expect(boot).toContain('"/raxos-tower.avif"');
    expect(boot).toContain('"/raxos-tower.webp"');
    expect(boot).toContain('"/raxos-tower.png"');
    expect(boot).toContain("image.onerror");
    expect(boot).toContain("image.decode()");
    expect(boot).toContain("document.fonts?.ready");
    expect(boot).toContain('role="progressbar"');
    expect(css).toContain(".site-boot");
    expect(css).toContain("@keyframes site-boot-scan");
  });

  it("uses the supplied 3D operative, animation clips, and optimized rifle", () => {
    const cinematic = source("src/components/cinematic-contact.tsx");
    const operative = source("src/components/three-operative.tsx");

    expect(cinematic).toContain("<ThreeOperative phase={phase}");
    expect(cinematic).toContain("preloadOperativeAssets");
    expect(operative).toContain('new FBXLoader().loadAsync("/models/operative/firing-rifle.fbx")');
    expect(operative).toContain('fetch("/models/operative/run.json")');
    expect(operative).not.toContain('fetch("/models/operative/stop.json")');
    expect(operative).toContain('loadAsync("/models/operative/laser-rifle-optimized.glb")');
    expect(operative).toContain("new AnimationMixer(character)");
    expect(operative).toContain('getObjectByName("mixamorigRightHand")');
    expect(operative).toContain("setMeshoptDecoder(MeshoptDecoder)");
  });

  it("keeps the cinematic contact flow accessible and skippable", () => {
    const cinematic = source("src/components/cinematic-contact.tsx");
    const css = source("src/app/globals.css");

    expect(cinematic).toContain('aria-haspopup="dialog"');
    expect(cinematic).toContain('aria-modal="true"');
    expect(cinematic).toContain("SKIP SEQUENCE");
    expect(cinematic).toContain('event.key === "Escape"');
    expect(cinematic).toContain("useReducedMotion");
    expect(css).toContain('.cinematic-operative, .targeting-reticle { display: none; }');
    expect(css).toContain("--cinematic-modal-shape: polygon(");
    expect(css).toContain("--modal-corner-tr: 24px");
    expect(css).toContain("var(--modal-corner-tr) var(--modal-corner-tr)");
    expect(css).toContain("backdrop-filter: blur(2.1px)");
  });
});
