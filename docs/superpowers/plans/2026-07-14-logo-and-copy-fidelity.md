# Raxos Logo and Copy Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the Raxos emblem and wordmark as sharp custom SVG artwork and restore the supplied reference copy and desktop composition.

**Architecture:** Keep `RaxosMark` and `RaxosLogo` as independent SVG components in the existing logo module, with shared face, depth, facet, and glow concepts expressed through document-unique paint servers. Keep semantic copy in `BrandStage`; use the existing brand CSS in `globals.css` and desktop calibration layer in `fidelity.css` for sizing and placement.

**Tech Stack:** Next.js 16.2.10, React 19.2.7, TypeScript, inline SVG, Framer Motion 12, CSS, Vitest 4.

## Global Constraints

- The 1536 × 1024 interface reference is the source of truth for composition, copy, logo scale, and hierarchy.
- The two wallpapers are secondary references for angular geometry and crimson material only.
- Keep `STRUCTURE. CONTEXT. EXECUTION.` exactly unchanged.
- Keep the enquiry form, SMTP integration, interactive background, responsive structure, and slanted-border system functionally unchanged.
- Do not introduce a raster logo asset or a new package.
- Preserve reduced-motion behavior and accessible SVG labels.
- Target a 165 × 160 px emblem face and a 470 px wordmark at the desktop reference width.

---

## File Map

- Modify `src/components/raxos-logo.tsx`: custom emblem and wordmark paths, gradients, facets, glow, and motion groups.
- Modify `src/components/raxos-logo.test.ts`: structural contracts for the reconstructed native SVG.
- Modify `src/components/brand-stage.tsx`: exact reference information-card copy and controlled desktop line breaks.
- Modify `src/components/landing-structure.test.ts`: exact copy and desktop brand sizing contracts.
- Modify `src/app/globals.css`: shared mark/wordmark material, sharpness, responsive sizing, and text rhythm.
- Modify `src/app/fidelity.css`: 1536 × 1024 brand-stage calibration.

### Task 1: Restore exact reference copy

**Files:**
- Modify: `src/components/landing-structure.test.ts`
- Modify: `src/components/brand-stage.tsx`

**Interfaces:**
- Consumes: `BrandStage(): JSX.Element` and the existing `.company-brief` structure.
- Produces: exact approved copy strings for styling and visual comparison.

- [ ] **Step 1: Replace the operational-copy test with exact reference assertions**

```ts
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
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because `brand-stage.tsx` still contains the AI-workflows paragraph.

- [ ] **Step 3: Replace the company-card paragraph with the reference text**

```tsx
<p>
  Raxos is a company OS. A project-centered
  <br className="desktop-copy-break" /> operating layer for teams who demand
  <br className="desktop-copy-break" /> clarity, speed, and control.
</p>
```

Keep the existing heading and operator-note markup unchanged.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the copy restoration**

```bash
git add src/components/brand-stage.tsx src/components/landing-structure.test.ts
git commit -m "fix: restore reference brand copy"
```

### Task 2: Reconstruct the emblem and wordmark SVG

**Files:**
- Modify: `src/components/raxos-logo.test.ts`
- Modify: `src/components/raxos-logo.tsx`

**Interfaces:**
- Consumes: the existing `intro` variants and `transition` object.
- Produces: `RaxosMark(): JSX.Element` with `.mark-depth`, `.mark-face`, and `.mark-facet`; `RaxosLogo(): JSX.Element` with `.logo-depth`, `.logo-face`, `.logo-facet`, and `.logo-texture`.

- [ ] **Step 1: Replace obsolete geometry assertions with explicit layer contracts**

```ts
it("builds the reference emblem from two open angular ribbons", () => {
  expect(source).toContain('viewBox="0 0 240 220"');
  expect(source).toContain('className="mark-depth"');
  expect(source).toContain('className="mark-face"');
  expect(source).toContain('className="mark-facet"');
  expect(source).toContain('id="raxos-mark-highlight"');
  expect(source).toContain("M30 32H157L202 72V111L169 141H107");
  expect(source).toContain("M30 120H73L159 206H111Z");
  expect(source).not.toContain("204 220V181");
});

it("uses five independently drawn stencil letters", () => {
  expect(source).toContain('viewBox="0 0 1104 172"');
  expect(source).toContain('data-letter="R"');
  expect(source).toContain('data-letter="A"');
  expect(source).toContain('data-letter="X"');
  expect(source).toContain('data-letter="O"');
  expect(source).toContain('data-letter="S"');
  expect(source).toContain('className="logo-facet"');
});
```

- [ ] **Step 2: Run the focused logo test and verify it fails**

Run: `npm test -- src/components/raxos-logo.test.ts`

Expected: FAIL because the current SVG does not expose the new layer classes or letter markers.

- [ ] **Step 3: Rebuild `RaxosMark` with two open ribbons**

Use these face silhouettes as the authoritative paths:

```tsx
<g className="mark-depth" transform="translate(7 8)">
  <path d="M30 32H157L202 72V111L169 141H107L78 112H156L176 94V82L155 63H67Z" />
  <path d="M30 120H73L159 206H111Z" />
  <path d="M116 141H169L202 171V207Z" />
</g>
<g className="mark-face">
  <path d="M30 32H157L202 72V111L169 141H107L78 112H156L176 94V82L155 63H67Z" />
  <path d="M30 120H73L159 206H111Z" />
  <path d="M116 141H169L202 171V207Z" />
</g>
<g className="mark-facet" aria-hidden="true">
  <path d="M30 32H157L176 49H49Z" />
  <path d="M176 49L202 72V111L176 94Z" />
  <path d="M30 120H73L91 138H48Z" />
</g>
```

Retain `aria-label="Raxos emblem"`, `motion.svg`, `viewBox="0 0 240 220"`, and the document-unique `raxos-mark-*` gradient/filter IDs. Add the facet gradient beside the existing mark gradients:

```tsx
<linearGradient id="raxos-mark-highlight" x1="0" x2="1" y1="0" y2="1">
  <stop offset="0%" stopColor="rgba(255,218,196,0.48)" />
  <stop offset="100%" stopColor="rgba(255,58,48,0.08)" />
</linearGradient>
```

- [ ] **Step 4: Rebuild the five wordmark letters as sharp stencil groups**

Replace `Wordmark` with five groups carrying `data-letter` attributes. Use these main face paths:

```tsx
<g data-letter="R"><path d="M38 39H176L199 60V83L178 102H121L199 137H145L88 110H75V137H38V78H151L161 69L151 60H38Z" /></g>
<g data-letter="A"><path d="M230 137L296 39H343L413 137H368L350 109H287L269 137ZM304 83H334L319 60Z" fillRule="evenodd" /></g>
<g data-letter="X"><path d="M450 39H502L550 75L598 39H650L580 87L654 137H601L550 101L500 137H447L520 87Z" /></g>
<g data-letter="O"><path d="M692 39H831L860 66V110L831 137H692L664 110V66ZM724 65L708 79V98L724 111H800L816 98V79L800 65Z" fillRule="evenodd" /></g>
<g data-letter="S"><path d="M905 39H1064V65H950L938 76H1029L1064 100V115L1039 137H879V111H995L1007 101H914L879 77V59Z" /></g>
```

Render the same letter set in four groups: `.logo-depth`, `.logo-face`, `.logo-facet`, and `.logo-texture`. The facet group uses a small set of top-edge polygons rather than duplicating the entire face. Preserve the `raxos-face`, `raxos-side`, `raxos-highlight`, `raxos-burn`, and `raxos-grain` IDs exactly once each.

- [ ] **Step 5: Run the focused logo test and verify it passes**

Run: `npm test -- src/components/raxos-logo.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the SVG reconstruction**

```bash
git add src/components/raxos-logo.tsx src/components/raxos-logo.test.ts
git commit -m "feat: reconstruct reference Raxos logo"
```

### Task 3: Calibrate material, scale, and text rhythm

**Files:**
- Modify: `src/components/landing-structure.test.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/fidelity.css`

**Interfaces:**
- Consumes: the SVG layer classes from Task 2 and `.desktop-copy-break` from Task 1.
- Produces: sharp crimson material styling and reference-width brand sizing.

- [ ] **Step 1: Add CSS contract assertions**

```ts
it("calibrates the reconstructed brand artwork to the desktop reference", () => {
  const global = source("src/app/globals.css");
  const fidelity = source("src/app/fidelity.css");
  expect(global).toContain(".raxos-mark .mark-face");
  expect(global).toContain(".raxos-mark .mark-depth");
  expect(global).toContain(".raxos-mark .mark-facet");
  expect(global).toContain(".raxos-logo .logo-facet");
  expect(global).toContain(".desktop-copy-break");
  expect(fidelity).toContain("width: 165px");
  expect(fidelity).toContain("width: 470px");
});
```

- [ ] **Step 2: Run the focused structure test and verify it fails**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because the new material selectors and exact mark width are absent.

- [ ] **Step 3: Replace legacy logo material selectors in `globals.css`**

```css
.raxos-mark .mark-depth {
  fill: url("#raxos-mark-side");
  opacity: 0.78;
}

.raxos-mark .mark-face {
  fill: url("#raxos-mark-face");
}

.raxos-mark .mark-facet {
  fill: url("#raxos-mark-highlight");
  opacity: 0.46;
}

.raxos-logo .logo-depth {
  fill: url("#raxos-side");
  opacity: 0.78;
}

.raxos-logo .logo-face {
  fill: url("#raxos-face");
}

.raxos-logo .logo-facet {
  fill: url("#raxos-highlight");
  opacity: 0.46;
}

.raxos-logo .logo-texture {
  fill: rgba(7, 0, 0, 0.22);
  filter: url("#raxos-grain");
  mix-blend-mode: multiply;
  opacity: 0.28;
}

.desktop-copy-break {
  display: initial;
}
```

Set the logo filter to `drop-shadow(0 0 3px rgba(255, 15, 24, 0.55)) drop-shadow(0 7px 12px rgba(75, 0, 5, 0.32))`. Remove selectors for `.logo-ember`, `.logo-glint`, and `.logo-void`, because the new silhouettes encode negative space directly.

- [ ] **Step 4: Set desktop dimensions in `fidelity.css`**

Inside `@media (min-width: 1101px)`, set:

```css
.raxos-mark {
  width: 165px;
}

.raxos-logo {
  width: 470px;
}

.positioning-line {
  margin: 24px 0 55px;
}
```

Keep the existing radar width, card width, form placement, and slanted polygons unchanged. In the mobile media block, add `.desktop-copy-break { display: none; }` so the paragraph wraps naturally.

- [ ] **Step 5: Run focused and full tests**

Run: `npm test -- src/components/landing-structure.test.ts src/components/raxos-logo.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all test files PASS.

- [ ] **Step 6: Commit the styling calibration**

```bash
git add src/app/globals.css src/app/fidelity.css src/components/landing-structure.test.ts
git commit -m "fix: calibrate reference brand styling"
```

### Task 4: Screenshot refinement and final verification

**Files:**
- Modify: `src/components/raxos-logo.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/fidelity.css`
- Verify: `src/components/brand-stage.tsx`

**Interfaces:**
- Consumes: the complete brand reconstruction from Tasks 1–3.
- Produces: a browser-verified reference render with no runtime errors.

- [ ] **Step 1: Start a clean development server**

Stop an existing Raxos dev process gracefully. Remove only the generated `.next` directory if the live stylesheet does not contain `.mark-face`. Run `npm run dev` and confirm `http://localhost:3000` is ready.

- [ ] **Step 2: Capture the desktop reference viewport**

Open `http://localhost:3000/?logo-refinement=1`, set the browser viewport to 1536 × 1024, wait for `domcontentloaded`, and save a viewport screenshot to:

`/Users/james.mbugua/Documents/Raxos/.superpowers/sdd/logo-copy-final-1536x1024.png`

- [ ] **Step 3: Compare and iterate one variable at a time**

Compare against the supplied interface reference in this order:

1. Emblem silhouette and 165 × 160 px face footprint.
2. Wordmark 470 px width, letter proportions, and horizontal center.
3. Vertical gaps from emblem to wordmark, tagline, and information card.
4. Crimson brightness, extrusion width, facet visibility, and glow sharpness.
5. Exact paragraph wrapping and heading rhythm.

For each mismatch, change only the responsible SVG path or CSS declaration, reload, and take a new screenshot. Stop when further changes are below a two-pixel positional difference or are caused by raster texture in the supplied reference.

- [ ] **Step 4: Check responsive behavior**

At 390 × 844, verify the mark and wordmark fit without horizontal overflow, the paragraph has no forced desktop breaks, and the enquiry form remains usable.

- [ ] **Step 5: Check runtime errors**

Inspect the final browser tab's error-level console logs.

Expected: zero application or hydration errors.

- [ ] **Step 6: Run final verification**

Run: `npm test`

Expected: all test files PASS.

Run: `npm run build`

Expected: Next.js production build exits 0 with the `/` and `/api/enquiry` routes generated successfully.

Run: `git diff --check`

Expected: no output.

- [ ] **Step 7: Commit any screenshot-loop adjustments**

```bash
git add src/components/raxos-logo.tsx src/components/brand-stage.tsx src/app/globals.css src/app/fidelity.css src/components/raxos-logo.test.ts src/components/landing-structure.test.ts
git commit -m "fix: refine Raxos brand fidelity"
```

Do not stage `.next`, screenshots, `.env.local`, or the unrelated untracked `tools/` directory.
