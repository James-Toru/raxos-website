# Raxos Command Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Raxos one-page site into a high-fidelity, responsive reproduction of the supplied crimson command-interface reference while preserving real Infomaniak SMTP enquiries.

**Architecture:** Keep the single Next.js App Router route and divide the visual system into a canvas background, reusable interface chrome, a focused brand stage, and the enquiry form. SVG and CSS provide crisp clipped geometry and telemetry details; the existing canvas provides lightweight pointer interaction; the server route remains isolated behind tested enquiry parsing and email construction.

**Tech Stack:** Next.js 16.2.10, React 19.2.7, TypeScript, Tailwind CSS 4, native SVG/canvas, Framer Motion 12, Lucide React, Nodemailer 9, Vitest 4.

## Global Constraints

- Visual fidelity to the supplied 1536 × 1024 reference is the primary acceptance criterion.
- Use near-black, charcoal, muted grey, crimson, and small hot-red highlights.
- Do not add WebGL, Three.js, a bitmap page background, a database, or additional marketing routes.
- Preserve `prefers-reduced-motion`, keyboard access, visible labels, semantic landmarks, and inline form status.
- Send Infomaniak mail from and to `sandbox@raxos.ai` using environment variables only.
- Never commit or print `SMTP_PASSWORD`.
- Preserve the existing untracked `tools/` directory and any unrelated user changes.

## File Map

- Create `src/components/interface-chrome.tsx`: outer viewport frame, header, vertical telemetry, and footer.
- Create `src/components/brand-stage.tsx`: begin with the positioning shell, then add the emblem/radar stage, wordmark, and company statement panel.
- Create `src/components/landing-structure.test.ts`: source-level contract for reference-specific page structure and copy.
- Modify `src/components/landing-shell.tsx`: compose the four visual layers.
- Modify `src/components/raxos-logo.tsx`: expose a separate Raxos emblem alongside the existing vector wordmark.
- Modify `src/components/raxos-logo.test.ts`: contract for both SVG artworks.
- Modify `src/components/enquiry-form.tsx`: reference-matching content, placeholders, field names, and secure-channel note.
- Modify `src/components/interactive-background.tsx`: tune the data-ribbon placement and expose reference-specific canvas behavior.
- Modify `src/app/globals.css`: implement the complete desktop composition, clipped panels, chrome, responsive rules, and reduced-motion behavior.
- Create `.env.example`: document safe Infomaniak variable names and non-secret values.
- Keep `src/lib/enquiry.ts`, `src/lib/enquiry.test.ts`, and `src/app/api/enquiry/route.ts` as the tested SMTP boundary unless verification exposes a defect.

---

### Task 1: Lock the reference-specific page contract

**Files:**
- Create: `src/components/landing-structure.test.ts`
- Modify: `src/components/landing-shell.tsx`
- Create: `src/components/interface-chrome.tsx`
- Create: `src/components/brand-stage.tsx`

**Interfaces:**
- Consumes: `InteractiveBackground`, `CustomCursor`, `EnquiryForm`, and `BrandStage` React components.
- Produces: `InterfaceChrome({ children }: PropsWithChildren)` and the top-level `.command-interface` composition.

- [ ] **Step 1: Write the failing structure test**

```ts
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
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because the shell does not contain the command-interface composition and the chrome file does not exist.

- [ ] **Step 3: Add the interface chrome and shell composition**

Create `InterfaceChrome` with semantic decorative elements and `aria-hidden="true"` on non-content telemetry. Its visible labels must include `RAXOS CORP.`, `SYSTEM INTERFACE v2.4.7`, `SYSTEM STATUS`, `ONLINE`, `STRUCTURE`, `CONTEXT`, `EXECUTION`, `SECURE CHANNEL ESTABLISHED`, and `RX-OS-7F3C2A`.

Update `LandingShell` to use this exact hierarchy:

```tsx
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
```

Create an independently buildable initial `BrandStage` that Task 2 will expand:

```tsx
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
```

- [ ] **Step 4: Run the structure test and verify GREEN**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: 1 test passes.

- [ ] **Step 5: Commit the structural slice**

```bash
git add src/components/landing-structure.test.ts src/components/interface-chrome.tsx src/components/brand-stage.tsx src/components/landing-shell.tsx
git commit -m "feat: add Raxos command interface chrome"
```

---

### Task 2: Build the emblem, radar stage, and brand message

**Files:**
- Modify: `src/components/brand-stage.tsx`
- Modify: `src/components/raxos-logo.tsx`
- Modify: `src/components/raxos-logo.test.ts`

**Interfaces:**
- Consumes: `RaxosLogo()` and Framer Motion.
- Produces: `RaxosMark()` for the angular emblem and `BrandStage()` for the entire left column.

- [ ] **Step 1: Extend the SVG contract first**

Add these assertions to `src/components/raxos-logo.test.ts`:

```ts
it("exports a separate angular emblem for the radar stage", () => {
  expect(source).toContain("export function RaxosMark");
  expect(source).toContain('aria-label="Raxos emblem"');
  expect(source).toContain('viewBox="0 0 240 220"');
});
```

Extend `landing-structure.test.ts`:

```ts
it("uses the reference positioning and operational copy", () => {
  const brand = source("src/components/brand-stage.tsx");
  expect(brand).toContain("STRUCTURE. CONTEXT. EXECUTION.");
  expect(brand).toContain("WE TURN COMPANY SIGNALS");
  expect(brand).toContain("AI workflows, agents, tasks, and operators");
  expect(brand).toContain("BUILT FOR OPERATORS");
});
```

- [ ] **Step 2: Run both tests and verify RED**

Run: `npm test -- src/components/raxos-logo.test.ts src/components/landing-structure.test.ts`

Expected: FAIL because `RaxosMark` and the expanded brand-stage content do not exist.

- [ ] **Step 3: Implement the emblem and brand stage**

Add a native SVG `RaxosMark` using the same `raxos-face`, `raxos-side`, and glow definitions as the wordmark. The emblem should comprise two angular red paths forming a forward-driving `R` shape, with a dark internal cut and offset depth layer.

Create `BrandStage` with this component boundary:

```tsx
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
          <h1><span>WE TURN COMPANY SIGNALS</span><br />INTO REVIEWED, APPROVED,<br />ACTIONABLE WORK.</h1>
          <p>Raxos is the command layer connecting AI workflows, agents, tasks, and operators with the context required to execute.</p>
          <p className="operator-note">BUILT FOR OPERATORS <span aria-hidden="true">→</span></p>
        </div>
      </article>
    </motion.section>
  );
}
```

- [ ] **Step 4: Run both tests and verify GREEN**

Run: `npm test -- src/components/raxos-logo.test.ts src/components/landing-structure.test.ts`

Expected: all logo and structure tests pass.

- [ ] **Step 5: Commit the brand slice**

```bash
git add src/components/brand-stage.tsx src/components/raxos-logo.tsx src/components/raxos-logo.test.ts src/components/landing-structure.test.ts
git commit -m "feat: build Raxos radar brand stage"
```

---

### Task 3: Match the angular enquiry panel and preserve SMTP behavior

**Files:**
- Modify: `src/components/enquiry-form.tsx`
- Modify: `src/components/landing-structure.test.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: `POST /api/enquiry` with `{ name, email, company, message, website }`.
- Produces: the same JSON request shape and inline `idle | sending | sent | error` feedback states.

- [ ] **Step 1: Add the failing form-content contract**

Add to `landing-structure.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the form contract and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL on the new reference copy and placeholders.

- [ ] **Step 3: Reshape the form without changing its request contract**

Keep `handleSubmit`, `updateField`, the honeypot, fetch URL, JSON body, and state machine intact. Replace the presentational hierarchy with:

```tsx
<motion.form className="enquiry-panel" onSubmit={handleSubmit}>
  <div className="panel-glow" aria-hidden="true" />
  <p className="form-eyebrow">// INITIATE CONTACT</p>
  <h2>INTERESTED IN<br /><span>RAXOS?</span></h2>
  <p className="form-intro">Leave your details and our team will reach out to you.</p>
  <div className="title-mark" aria-hidden="true" />
  {/* existing honeypot */}
  {/* NAME, EMAIL, COMPANY, MESSAGE labels and controlled fields */}
  <motion.button type="submit" disabled={status === "sending"}>
    <span>{status === "sending" ? "SENDING MESSAGE" : "SEND MESSAGE"}</span>
    <ArrowRight aria-hidden="true" size={18} />
  </motion.button>
  <p className="security-note"><LockKeyhole aria-hidden="true" size={14} /> ALL COMMUNICATIONS ARE ENCRYPTED</p>
  {/* existing role=status output */}
</motion.form>
```

Use the placeholders from the failing test while retaining visible uppercase labels and autocomplete attributes.

Create `.env.example` with only safe values:

```dotenv
SMTP_HOST=smtp.infomaniak.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_USER=sandbox@raxos.ai
SMTP_PASSWORD=
CONTACT_FROM=Raxos Website <sandbox@raxos.ai>
CONTACT_TO=sandbox@raxos.ai
```

- [ ] **Step 4: Verify form structure and existing mail behavior**

Run: `npm test -- src/components/landing-structure.test.ts src/lib/enquiry.test.ts`

Expected: all structure, validation, honeypot, sanitization, and email-construction tests pass.

- [ ] **Step 5: Commit the contact slice**

```bash
git add .env.example src/components/enquiry-form.tsx src/components/landing-structure.test.ts
git commit -m "feat: match Raxos contact console"
```

---

### Task 4: Implement the high-fidelity visual system

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/interactive-background.tsx`
- Modify: `src/components/landing-structure.test.ts`

**Interfaces:**
- Consumes: the class names established by Tasks 1–3.
- Produces: the 1536 × 1024 desktop composition, responsive stacking below 900px, and reduced-motion/coarse-pointer fallbacks.

- [ ] **Step 1: Add a failing stylesheet contract**

Add to `landing-structure.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the stylesheet contract and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because the new frame, radar, and responsive selectors are absent.

- [ ] **Step 3: Replace the generic landing styles with the reference system**

Implement these exact layout invariants in `globals.css`:

- `.command-interface`: `min-height: 100svh`, near-black background, technical monospace stack, and hidden horizontal overflow.
- `.command-frame`: fixed visual frame inset approximately `18px 14px`, clipped 10px corners, thin `rgba(220, 12, 20, .78)` border treatment, and safe content padding.
- `.command-grid`: centered two-column grid `minmax(0, 1.15fr) minmax(420px, .85fr)` with the form aligned right.
- `.brand-stage`: centered upper logo/radar composition with the company brief anchored below.
- `.radar-stage`: square stage capped near 360px with concentric rings, crosshairs, target points, and the emblem centered.
- `.raxos-logo`: desktop width capped near 520px with restrained red drop shadow.
- `.company-brief`: clipped bordered panel capped near 450px with a narrow circuit illustration column.
- `.enquiry-panel`: clipped tall panel capped near 520px, charcoal translucent fill, fine red border, and tight form rhythm matching the reference.
- Form fields: 42–48px height, subtle borders, squared 4px corners, right-side red icons, and crimson focus state.
- Submit button: full-width crimson gradient, uppercase monospace text, and angular corner accents.
- Header/footer/telemetry: compact 10–12px labels, generous letter spacing, muted grey text, and small red marks.
- At `max-width: 900px`: one-column flow, ordinary document height, reduced radar size, compact chrome, hidden vertical telemetry, and no fixed footer overlap.
- At `prefers-reduced-motion: reduce`: disable scanning, ring rotation, and nonessential transitions.

Tune `InteractiveBackground` so ribbons concentrate across the lower middle like the reference, pointer displacement remains subtle, clicks emit pulses, and the canvas carries `aria-hidden="true"`. Keep the current device-pixel-ratio and particle-count caps.

- [ ] **Step 4: Run tests and static checks**

Run: `npm test`

Expected: all tests pass.

Run: `npm run lint`

Expected: exit 0 with no ESLint errors.

- [ ] **Step 5: Commit the complete visual system**

```bash
git add src/app/globals.css src/components/interactive-background.tsx src/components/landing-structure.test.ts
git commit -m "feat: reproduce Raxos command interface visuals"
```

---

### Task 5: Browser fidelity pass and production verification

**Files:**
- Modify as required by observed defects: `src/app/globals.css`, `src/components/interface-chrome.tsx`, `src/components/brand-stage.tsx`, `src/components/enquiry-form.tsx`, `src/components/interactive-background.tsx`
- Test: `src/components/landing-structure.test.ts`, `src/components/raxos-logo.test.ts`, `src/lib/enquiry.test.ts`

**Interfaces:**
- Consumes: the completed one-page site and supplied reference image.
- Produces: verified desktop/mobile rendering and a production-buildable application.

- [ ] **Step 1: Run the full automated verification baseline**

Run: `npm test && npm run lint && npm run build`

Expected: every command exits 0; Next.js reports a successful production build containing `/` and `/api/enquiry`.

- [ ] **Step 2: Start the application for browser inspection**

Run: `npm run dev`

Expected: Next.js reports a local URL and remains running for browser checks.

- [ ] **Step 3: Inspect the 1536 × 1024 desktop composition against the reference**

Use the in-app browser at `1536 × 1024`. Verify and correct each item:

- Thin clipped viewport frame and technical header/footer are visible without clipping.
- Brand occupies the left side and the enquiry panel the right in the same proportions as the reference.
- Emblem is centered inside radar rings; RAXOS wordmark dominates the left column.
- Company brief sits below the wordmark rather than replacing it.
- Contact panel headline, divider, fields, button, and security note match the reference hierarchy.
- Crimson remains controlled; large areas stay near-black/charcoal.
- Fine data ribbons remain behind content and respond smoothly to pointer movement.
- At least the main content fits in the 1024px viewport without accidental page chrome overlap.

For every discovered defect, first add or tighten a structural assertion when practical, run it to observe failure, apply the smallest markup/CSS correction, and rerun it to green.

- [ ] **Step 4: Inspect responsive and accessibility behavior**

Check at `390 × 844` and `768 × 1024`:

- No horizontal scrolling.
- Brand, brief, and form stack in a deliberate order.
- Labels and form controls remain readable and tappable.
- Decorative telemetry does not obscure content.
- Keyboard tab order follows the form fields and submit button.
- Status feedback is visible after client-side invalid submission.
- With reduced motion enabled, the page remains coherent and nonessential motion stops or is reduced.

Apply red-green corrections for any issue that can be expressed as a stable contract.

- [ ] **Step 5: Verify without exposing credentials**

Confirm `.env*` files other than `.env.example` remain ignored:

Run: `git status --short --ignored | sed -n '1,120p'`

Expected: local environment files, if present, appear with `!!` and are not staged; `tools/` remains untouched.

Do not print environment values. If SMTP credentials are configured locally, submit one browser enquiry to confirm the API returns success. If they are not configured, verify the expected inline failure state without adding a password to source or shell history.

- [ ] **Step 6: Run fresh final verification and commit fixes**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, lint exits 0, and the production build succeeds.

```bash
git add src/app/globals.css src/components/interface-chrome.tsx src/components/brand-stage.tsx src/components/enquiry-form.tsx src/components/interactive-background.tsx src/components/landing-structure.test.ts src/components/raxos-logo.tsx src/components/raxos-logo.test.ts .env.example
git commit -m "fix: refine Raxos reference fidelity"
```

Skip the final commit when the browser pass produces no tracked changes.
