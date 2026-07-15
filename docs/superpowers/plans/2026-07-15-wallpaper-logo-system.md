# Wallpaper-Matched Logo System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the standalone R emblem and RAXOS wordmark as crisp SVG vectors matching the supplied wallpaper's compact angular geometry and restrained distressed finish.

**Architecture:** Keep the existing `RaxosMark` and `RaxosLogo` component API, motion behavior, and brand-stage placement. Replace only their internal SVG geometry and material layers, then refine the existing logo-specific CSS for shallow depth, controlled glow, and responsive texture attenuation. Use source-contract tests to lock every path, paint server, texture layer, and accessibility invariant before browser comparison.

**Tech Stack:** Next.js 16, React 19, Framer Motion, native SVG paths/gradients/patterns/filters, CSS, Vitest, in-app browser visual verification.

## Global Constraints

- Work only in `/Users/james.mbugua/Documents/Raxos/.worktrees/wallpaper-experiment` on `codex/wallpaper-experiment`.
- `raxos-wallpaper.jpeg` is the visual source of truth; prioritize silhouette, proportions, spacing, chamfers, negative space, then surface treatment.
- Continue exporting `RaxosMark` and `RaxosLogo` with their existing accessible labels and entrance animation behavior.
- Preserve crisp native SVG artwork; do not crop, embed, trace, or generate a raster logo asset.
- Keep texture/highlight groups decorative and `aria-hidden`.
- Preserve the existing brand-stage position, surrounding copy, enquiry form, wallpaper spotlight, interactive mesh, header, footer, API behavior, and dependencies.
- Use the same vector silhouettes at every viewport; attenuate texture through CSS rather than swapping assets.
- Do not merge into `main` without a separate user decision.

---

### Task 1: Reconstruct the compact R emblem

**Files:**
- Modify: `src/components/raxos-logo.test.ts`
- Modify: `src/components/raxos-logo.tsx`

**Interfaces:**
- Consumes: the existing `RaxosMark()` export and its `.raxos-mark`, `.mark-depth`, `.mark-face`, and `.mark-facet` styling hooks.
- Produces: a compact `0 0 220 184` emblem with wallpaper-matched ribbon geometry plus a `.mark-texture` overlay.

- [ ] **Step 1: Replace the emblem path contract in the test**

Replace `emblemPaths` with:

```ts
const emblemPaths = [
  "M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z",
  "M18 91H66L159 176H111Z",
  "M116 111H170L202 139V176Z",
  "M18 18H163L180 33H35Z",
  "M180 33L202 53V82L180 72Z",
  "M18 91H66L82 106H34Z",
];
```

Update the emblem tests to require:

```ts
expect(source).toContain('viewBox="0 0 220 184"');
expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
expect(source).toContain('id="raxos-mark-hex"');
expect(source).toContain('className="mark-texture"');
expect(source).toContain('fill="url(#raxos-mark-hex)"');
expect(source).toContain('aria-hidden="true"');
```

Add `"raxos-mark-hex"` to the emblem paint-server ID assertion and `"mark-texture"` to the material-layer assertion.

- [ ] **Step 2: Run the emblem test and verify RED**

Run:

```bash
npm test -- src/components/raxos-logo.test.ts
```

Expected: failures for the old viewBox, old paths, missing hex pattern, and missing texture layer.

- [ ] **Step 3: Implement the compact emblem geometry**

In `RaxosMark`, change the SVG framing to:

```tsx
viewBox="0 0 220 184"
preserveAspectRatio="xMidYMid meet"
```

Add this pattern inside its `<defs>`:

```tsx
<pattern id="raxos-mark-hex" width="18" height="15.6" patternUnits="userSpaceOnUse">
  <path
    d="M4.5 0.8H13.5L17.5 7.8L13.5 14.8H4.5L0.5 7.8Z"
    fill="none"
    stroke="rgba(61,0,4,0.72)"
    strokeWidth="0.9"
  />
</pattern>
```

Replace the three face/depth paths with the first three `emblemPaths`, using `transform="translate(4 5)"` for `.mark-depth`. Replace the facet paths with the final three `emblemPaths`. After the facet group, add a decorative texture group that repeats the first three paths:

```tsx
<g className="mark-texture" fill="url(#raxos-mark-hex)" aria-hidden="true">
  <path d="M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z" />
  <path d="M18 91H66L159 176H111Z" />
  <path d="M116 111H170L202 139V176Z" />
</g>
```

- [ ] **Step 4: Verify the emblem contract**

Run:

```bash
npm test -- src/components/raxos-logo.test.ts
```

Expected: all logo tests pass.

- [ ] **Step 5: Commit the emblem reconstruction**

```bash
git add src/components/raxos-logo.tsx src/components/raxos-logo.test.ts
git commit -m "feat: reconstruct wallpaper emblem"
```

### Task 2: Reconstruct the RAXOS wordmark

**Files:**
- Modify: `src/components/raxos-logo.test.ts`
- Modify: `src/components/raxos-logo.tsx`

**Interfaces:**
- Consumes: the existing `RaxosLogo()` export, `Wordmark`, `WordmarkFacets`, and wordmark material hooks.
- Produces: a wide, low, chamfered `0 0 1040 150` five-letter vector with a clipped hex texture layer.

- [ ] **Step 1: Replace the wordmark path contract**

Replace `letterPaths` with:

```ts
const letterPaths = [
  "M12 20H150L184 48V72L158 95H105L184 130H132L74 104H50V130H12V65H142L154 55L142 44H12Z",
  "M210 130L274 20H324L395 130H349L334 104H267L252 130ZM286 55L272 82H319L304 55Z",
  "M415 20H466L518 58L570 20H621L550 74L625 130H572L518 91L465 130H412L486 74Z",
  "M648 20H791L824 49V101L791 130H648L616 101V49ZM679 47L658 64V86L679 103H760L781 86V64L760 47Z",
  "M852 20H1024V47H897L883 59H990L1024 83V106L997 130H826V103H955L968 92H858L826 68V45Z",
  "M12 20H150L166 33H28Z",
  "M274 20H324L333 34H266Z",
  "M415 20H466L478 29H427Z",
  "M570 20H621L609 29H558Z",
  "M648 20H791L807 34H632Z",
  "M852 20H1024V34H839Z",
];
```

Update the wordmark test to require:

```ts
expect(source).toContain('viewBox="0 0 1040 150"');
expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
expect(source).toContain('id="raxos-word-hex"');
expect(source).toContain('<Wordmark className="logo-texture" fill="url(#raxos-word-hex)" />');
```

Add `"raxos-word-hex"` to the wordmark paint-server ID assertion.

- [ ] **Step 2: Run the logo test and verify RED**

Run:

```bash
npm test -- src/components/raxos-logo.test.ts
```

Expected: failures for the old wordmark viewBox, path set, aspect-ratio behavior, and texture fill.

- [ ] **Step 3: Implement the new stencil paths and texture paint interface**

Change the helper signature and root group to:

```tsx
function Wordmark({ className = "", fill }: { className?: string; fill?: string }) {
  return (
    <g className={className} fill={fill}>
```

Replace the R, A, X, O, and S face paths with the first five `letterPaths`. Replace `WordmarkFacets` with the final six paths. Change `RaxosLogo` to:

```tsx
viewBox="0 0 1040 150"
preserveAspectRatio="xMidYMid meet"
width="470"
height="68"
```

Add this pattern to the wordmark `<defs>`:

```tsx
<pattern id="raxos-word-hex" width="20" height="17.3" patternUnits="userSpaceOnUse">
  <path
    d="M5 0.8H15L19.5 8.65L15 16.5H5L0.5 8.65Z"
    fill="none"
    stroke="rgba(66,0,5,0.68)"
    strokeWidth="0.85"
  />
</pattern>
```

Render the wordmark layers as:

```tsx
<Wordmark className="logo-depth" />
<Wordmark className="logo-face" />
<WordmarkFacets />
<Wordmark className="logo-texture" fill="url(#raxos-word-hex)" />
```

- [ ] **Step 4: Verify focused and full component contracts**

Run:

```bash
npm test -- src/components/raxos-logo.test.ts
npm test -- src/components/landing-structure.test.ts
```

Expected: all logo tests and all landing-structure tests pass. If the landing test still expects `height="62"`, update that test first to require `height="68"`, verify RED, then retain the new SVG height.

- [ ] **Step 5: Commit the wordmark reconstruction**

```bash
git add src/components/raxos-logo.tsx src/components/raxos-logo.test.ts src/components/landing-structure.test.ts
git commit -m "feat: reconstruct wallpaper wordmark"
```

### Task 3: Refine logo material and responsive texture

**Files:**
- Modify: `src/components/landing-structure.test.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/fidelity.css`

**Interfaces:**
- Consumes: `.mark-texture`, `.logo-texture`, `.mark-depth`, `.logo-depth`, `.mark-facet`, and `.logo-facet` from Tasks 1 and 2.
- Produces: shallow depth, controlled edge bloom, and desktop/compact/mobile texture attenuation without geometry changes.

- [ ] **Step 1: Add failing material and responsive assertions**

Extend the logo material test in `src/components/landing-structure.test.ts` with:

```ts
expect(global).toMatch(/\.raxos-mark\s*\{[^}]*drop-shadow\(0 0 7px rgba\(255, 0, 9, 0\.48\)\)/s);
expect(global).toMatch(/\.raxos-logo\s*\{[^}]*drop-shadow\(0 5px 9px rgba\(75, 0, 5, 0\.24\)\)/s);
expect(global).toMatch(/\.mark-texture,\s*\.raxos-logo \.logo-texture\s*\{[^}]*opacity:\s*0\.38/s);
expect(fidelity).toMatch(/@media \(max-width: 1100px\)[\s\S]*?\.mark-texture,[\s\S]*?opacity:\s*0\.2/s);
expect(global).toMatch(/@media \(max-width: 900px\)[\s\S]*?\.mark-texture,[\s\S]*?opacity:\s*0\.1/s);
```

- [ ] **Step 2: Run the landing test and verify RED**

Run:

```bash
npm test -- src/components/landing-structure.test.ts
```

Expected: failures for the old glow values and missing responsive texture rules.

- [ ] **Step 3: Implement the material rules**

In `src/app/globals.css`, set:

```css
.raxos-mark {
  filter: drop-shadow(0 0 7px rgba(255, 0, 9, 0.48));
}

.raxos-logo {
  filter: drop-shadow(0 5px 9px rgba(75, 0, 5, 0.24));
}

.raxos-mark .mark-depth,
.raxos-logo .logo-depth {
  opacity: 0.58;
}

.raxos-mark .mark-facet,
.raxos-logo .logo-facet {
  opacity: 0.38;
}

.raxos-mark .mark-texture,
.raxos-logo .logo-texture {
  mix-blend-mode: multiply;
  opacity: 0.38;
}
```

Remove the old solid `fill`, grain-filter, and `opacity: 0.28` declarations from `.raxos-logo .logo-texture`; its fill now comes from the SVG pattern.

Inside `@media (max-width: 1100px)` in `src/app/fidelity.css`, add:

```css
.raxos-mark .mark-texture,
.raxos-logo .logo-texture {
  opacity: 0.2;
}
```

Inside `@media (max-width: 900px)` in `src/app/globals.css`, add:

```css
.raxos-mark .mark-texture,
.raxos-logo .logo-texture {
  opacity: 0.1;
}
```

- [ ] **Step 4: Run focused and full automated verification**

Run:

```bash
npm test -- src/components/landing-structure.test.ts
npm test
npm run lint
git diff --check
```

Expected: focused tests pass, 46/46 or the new higher total passes, lint exits 0, and diff check exits 0.

- [ ] **Step 5: Commit the material treatment**

```bash
git add src/app/globals.css src/app/fidelity.css src/components/landing-structure.test.ts
git commit -m "style: match wallpaper logo materials"
```

### Task 4: Verify visual fidelity and responsive stability

**Files:**
- Modify only if screenshot evidence requires bounded logo tuning: `src/components/raxos-logo.tsx`, `src/app/globals.css`, `src/app/fidelity.css`, and their existing tests
- Evidence: `.superpowers/sdd/wallpaper-logo-1536x1024.jpg`
- Evidence: `.superpowers/sdd/wallpaper-logo-1280x720.jpg`
- Evidence: `.superpowers/sdd/wallpaper-logo-390x844.jpg`

**Interfaces:**
- Consumes: the completed vector geometry and responsive material treatment from Tasks 1–3.
- Produces: auditable browser evidence that both logo elements match the wallpaper reference without layout regressions.

- [ ] **Step 1: Capture 1536 x 1024 after entrance animation settles**

Record the `.raxos-mark` and `.raxos-logo` rectangles, page width, and screenshot. Compare against the wallpaper reference and verify:

- The R emblem is compact and nearly square with the broad upper arm, tight counter, and parallel lower diagonals.
- RAXOS is wide, low, consistently chamfered, and optically centered.
- Texture is visible but subordinate; glow and extrusion are restrained.
- Tower spotlight, form, copy, and interactive mesh remain visually unchanged.

- [ ] **Step 2: Capture 1280 x 720**

Verify the same silhouettes remain crisp, neither logo overlaps the positioning line or company brief, and `scrollWidth === clientWidth`.

- [ ] **Step 3: Capture 390 x 844**

Verify the silhouette remains recognizable, texture is nearly imperceptible, and `scrollWidth === clientWidth === 390` with zero application error-level console entries.

- [ ] **Step 4: Apply bounded tuning only if a criterion fails**

Change one variable at a time: SVG viewBox padding, path coordinate, facet opacity, texture opacity, or drop-shadow value. Update the exact source-contract test first, verify RED, apply the corresponding implementation change, then verify GREEN. Do not change brand-stage layout, surrounding copy, form, or wallpaper.

- [ ] **Step 5: Run final verification**

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Expected: all tests pass, lint/build/diff checks exit 0, and the tracked worktree is clean after restoring any build-generated `next-env.d.ts` drift.

- [ ] **Step 6: Commit visual tuning only if tracked files changed**

```bash
git add src/components/raxos-logo.tsx src/components/raxos-logo.test.ts src/components/landing-structure.test.ts src/app/globals.css src/app/fidelity.css
git commit -m "fix: refine wallpaper logo fidelity"
```
