# Raxos Slanted Border System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render crisp asymmetric crimson diagonal borders on the outer frame, enquiry panel, company brief, and send button while preserving the existing reference-matched layout.

**Architecture:** Each target surface becomes a crimson clipped outer polygon containing an absolutely positioned near-black inset polygon. A shared `.polygon-fill` primitive provides the inset layer; component-specific CSS variables define outer and inner silhouettes without changing layout dimensions.

**Tech Stack:** Next.js 16.2, React 19, TypeScript, CSS custom properties and `clip-path`, Vitest, in-app browser screenshots.

## Global Constraints

- Preserve all current dimensions, content positions, responsiveness, and interactions.
- Desktop uses the full asymmetric reference geometry; tablet and mobile reduce cut sizes while retaining corner directions.
- The visible border remains one physical pixel at 1536×1024.
- Existing form behavior, accessibility, SMTP handling, typography, canvas interaction, and layout geometry do not change.

---

### Task 1: Layered polygon border primitive

**Files:**
- Modify: `src/components/landing-structure.test.ts`
- Modify: `src/components/interface-chrome.tsx`
- Modify: `src/components/brand-stage.tsx`
- Modify: `src/components/enquiry-form.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/fidelity.css`

**Interfaces:**
- Consumes: Existing `.interface-chrome`, `.company-brief`, `.enquiry-panel`, and `.enquiry-panel button` elements.
- Produces: A presentational `<span className="polygon-fill" aria-hidden="true" />` child and per-surface `--polygon-outer` / `--polygon-inner` variables.

- [ ] **Step 1: Write the failing source contract**

Add this test to `src/components/landing-structure.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts --reporter=dot`

Expected: FAIL because the four fill elements and polygon variables do not exist.

- [ ] **Step 3: Add the fill layers**

Add these presentational children as the first child of each target element:

```tsx
<span className="polygon-fill frame-fill" aria-hidden="true" />
<span className="polygon-fill brief-fill" aria-hidden="true" />
<span className="polygon-fill panel-fill" aria-hidden="true" />
<span className="polygon-fill button-fill" aria-hidden="true" />
```

Keep the button label and arrow above `.button-fill`. Define the shared fill layer:

```css
.polygon-fill {
  pointer-events: none;
  position: absolute;
  inset: 1px;
  z-index: 0;
  background: var(--polygon-fill, #050506);
  clip-path: var(--polygon-inner);
}
```

Define component-specific outer and inset polygons. The enquiry panel uses asymmetric 18px / 72px / 26px / 22px corner cuts; the frame uses 10px cuts; the brief uses 14px top-left and bottom-right cuts; the button uses 8px top-left and bottom-right cuts. Remove native borders, set each host background to its crimson border color, and put existing content at `z-index: 1`.

- [ ] **Step 4: Add responsive reductions**

At `max-width: 1100px`, reduce panel cuts to 14px / 36px / 18px / 16px and frame cuts to 7px. Preserve the diagonal direction and ensure form focus outlines remain unobstructed.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `npm test -- src/components/landing-structure.test.ts --reporter=dot`

Expected: all command-interface tests pass.

- [ ] **Step 6: Commit the border primitive**

```bash
git add src/components/landing-structure.test.ts src/components/interface-chrome.tsx src/components/brand-stage.tsx src/components/enquiry-form.tsx src/app/globals.css src/app/fidelity.css
git commit -m "feat: add layered slanted interface borders"
```

### Task 2: Visual fidelity loop and verification

**Files:**
- Modify if required: `src/app/fidelity.css`
- Create: `.superpowers/sdd/slanted-borders-final-1536x1024.jpg`

**Interfaces:**
- Consumes: Layered polygon variables from Task 1.
- Produces: A reference-sized final comparison render and verified CSS values.

- [ ] **Step 1: Capture the desktop render**

Open `http://localhost:3000`, set the viewport to 1536×1024, wait for fonts and canvas paint, and capture `.superpowers/sdd/slanted-borders-final-1536x1024.jpg`.

- [ ] **Step 2: Compare the four silhouettes**

Check the outer frame, enquiry panel, brief, and button against the supplied image. Specifically compare diagonal direction, diagonal length, one-pixel stroke continuity, and accent-line placement. Adjust only `--polygon-outer`, `--polygon-inner`, border color, and fill variables in `src/app/fidelity.css`.

- [ ] **Step 3: Repeat until visually aligned**

Recapture at 1536×1024 after every adjustment. Stop when all four diagonal silhouettes align with the reference without shifting content geometry.

- [ ] **Step 4: Run complete verification**

Run: `npm test`

Expected: 34 or more tests pass with zero failures.

Run: `npm run build`

Expected: Next.js production build exits successfully with routes `/` and `/api/enquiry`.

- [ ] **Step 5: Commit final fidelity adjustments**

```bash
git add src/app/fidelity.css
git commit -m "fix: refine slanted border fidelity"
```

