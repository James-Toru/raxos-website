# Raxos Wordmark Spacing Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the RAXOS wordmark's A, O, and S to match the approved wallpaper-derived silhouettes and correct the X/O and O/S spacing without changing the overall logo width.

**Architecture:** Keep the existing `RaxosLogo` SVG component and layered `Wordmark`/`WordmarkFacets` helpers. Replace only the approved letter and facet paths, then use source-contract tests to lock their geometry and in-app browser screenshots to verify optical spacing and responsive stability.

**Tech Stack:** Next.js 16, React 19, TypeScript, Framer Motion, native SVG, Vitest, ESLint, in-app browser visual verification.

## Global Constraints

- Preserve the `0 0 1040 150` view box, `470 × 68` rendered dimensions, and first/last visual bounds.
- Do not change the R emblem, R or X geometry, animation, gradients, hex texture, accessibility, responsive behavior, or surrounding page layout.
- Keep the A outer legs continuous and render its shortened crossbar as a separate polygon with a wide left-side gap.
- Use a narrowed squared-octagonal O with no X/O overlap and visible space before S.
- Give S a chamfered upper-left shoulder, pointed upper terminal, angular inner returns, and clipped lower terminal.
- Introduce no new dependencies, assets, runtime state, component props, or data flow.

## File Structure

- Modify `src/components/raxos-logo.test.ts`: lock the approved A/O/S and matching facet paths and reject the superseded geometry.
- Modify `src/components/raxos-logo.tsx`: replace only A/O/S face/depth/texture geometry and their highlight facets.
- Create no production files. Store untracked QA screenshots under `.superpowers/sdd/`.

---

### Task 1: Implement the approved A, O, and S geometry test-first

**Files:**
- Modify: `src/components/raxos-logo.test.ts:19-31`
- Modify: `src/components/raxos-logo.tsx:31-74`

**Interfaces:**
- Consumes: existing internal `Wordmark` and `WordmarkFacets` React helpers.
- Produces: unchanged public exports `RaxosLogo(): JSX.Element` and `RaxosMark(): JSX.Element`.

- [ ] **Step 1: Replace the expected letter paths and add superseded-geometry assertions**

In `src/components/raxos-logo.test.ts`, replace `letterPaths` with:

```ts
const letterPaths = [
  "M12 20H150L184 48V72L158 95H105L184 130H132L74 104H50V130H12V65H142L154 55L142 44H12Z",
  "M213 130L279 20H327L397 130H352L301 51L255 130Z",
  "M298 82H324L337 104H284Z",
  "M415 20H466L518 58L570 20H621L550 74L625 130H572L518 91L465 130H412L486 74Z",
  "M678 20H790L818 48V102L790 130H678L650 102V48ZM696 47L678 63V87L696 103H772L790 87V63L772 47Z",
  "M856 20H1001L1024 43H895L881 55V63H990L1024 83V106L999 130H861L838 107H958L971 95H866L838 70V43Z",
  "M12 20H150L166 33H28Z",
  "M279 20H327L336 34H270Z",
  "M415 20H466L478 29H427Z",
  "M570 20H621L609 29H558Z",
  "M678 20H790L804 34H664Z",
  "M856 20H1001L1015 34H846Z",
];

const supersededLetterPaths = [
  "M210 130L274 20H324L395 130H349L334 104H267L252 130ZM286 55L272 82H319L304 55Z",
  "M648 20H791L824 49V101L791 130H648L616 101V49ZM679 47L658 64V86L679 103H760L781 86V64L760 47Z",
  "M852 20H1024V47H897L883 59H990L1024 83V106L997 130H826V103H955L968 92H858L826 68V45Z",
];
```

Add these assertions at the end of `it("uses five independently drawn stencil letters", ...)`:

```ts
for (const path of supersededLetterPaths) {
  expect(source).not.toContain(`d="${path}"`);
}
```

- [ ] **Step 2: Run the focused test and verify it fails for the old production paths**

Run:

```bash
npm test -- src/components/raxos-logo.test.ts
```

Expected: FAIL in `uses five independently drawn stencil letters` because the approved A/O/S paths are absent and the superseded paths are still present.

- [ ] **Step 3: Replace the A, O, and S wordmark paths**

In `src/components/raxos-logo.tsx`, keep the R and X groups byte-for-byte unchanged. Replace the A group body with two paths so the crossbar has a real left-side gap:

```tsx
<motion.g data-letter="A" variants={intro} transition={{ ...transition, delay: 0.09 }}>
  <path d="M213 130L279 20H327L397 130H352L301 51L255 130Z" />
  <path d="M298 82H324L337 104H284Z" />
</motion.g>
```

Replace the O group body with the narrowed squared-octagonal ring:

```tsx
<motion.g data-letter="O" variants={intro} transition={{ ...transition, delay: 0.23 }}>
  <path
    d="M678 20H790L818 48V102L790 130H678L650 102V48ZM696 47L678 63V87L696 103H772L790 87V63L772 47Z"
    fillRule="evenodd"
  />
</motion.g>
```

This makes the O's visible horizontal bounds `650..818`, leaving 25 SVG units after X (`625`) and 20 SVG units before S (`838`).

Replace the S group body with:

```tsx
<motion.g data-letter="S" variants={intro} transition={{ ...transition, delay: 0.3 }}>
  <path d="M856 20H1001L1024 43H895L881 55V63H990L1024 83V106L999 130H861L838 107H958L971 95H866L838 70V43Z" />
</motion.g>
```

- [ ] **Step 4: Align the A, O, and S highlight facets with the new silhouettes**

In `WordmarkFacets`, keep the R and X facet paths unchanged and replace the A/O/S facet paths with:

```tsx
<g data-letter="A">
  <path d="M279 20H327L336 34H270Z" />
</g>
```

```tsx
<g data-letter="O">
  <path d="M678 20H790L804 34H664Z" />
</g>
```

```tsx
<g data-letter="S">
  <path d="M856 20H1001L1015 34H846Z" />
</g>
```

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
npm test -- src/components/raxos-logo.test.ts
```

Expected: all `RaxosLogo` tests PASS, including unique paint-server IDs, material layers, accessible labels, approved paths, and rejected superseded paths.

- [ ] **Step 6: Inspect the focused diff for accidental scope expansion**

Run:

```bash
git diff -- src/components/raxos-logo.tsx src/components/raxos-logo.test.ts
git diff --check
```

Expected: only A/O/S and their facet paths plus corresponding test data changed; no whitespace errors.

- [ ] **Step 7: Commit the geometry refinement**

```bash
git add src/components/raxos-logo.tsx src/components/raxos-logo.test.ts
git commit -m "style: refine Raxos wordmark geometry"
```

### Task 2: Verify optical fidelity and responsive stability

**Files:**
- Modify only if screenshot evidence shows a mismatch with an acceptance criterion: `src/components/raxos-logo.tsx`, `src/components/raxos-logo.test.ts`
- Create untracked QA artifacts: `.superpowers/sdd/wordmark-refinement-1536x1024.png`, `.superpowers/sdd/wordmark-refinement-390x844.png`

**Interfaces:**
- Consumes: the updated `RaxosLogo` rendered by the existing landing page at `http://localhost:3000/`.
- Produces: verified desktop and mobile renders with no public API changes.

- [ ] **Step 1: Start or confirm the isolated worktree development server**

Run:

```bash
npm run dev
```

Expected: Next.js reports a local URL. If port 3000 is already serving this exact worktree, reuse it instead of starting a duplicate process.

- [ ] **Step 2: Capture and inspect the desktop render**

Use the in-app browser to open `http://localhost:3000/`, set the viewport to `1536 × 1024`, wait for the logo intro animation to settle, and save a viewport screenshot to:

```text
.superpowers/sdd/wordmark-refinement-1536x1024.png
```

Compare the rendered wordmark with `raxos-wallpaper.jpeg` and confirm all of the following:

- The A has continuous outer legs and a clearly visible gap between its left diagonal and floating crossbar.
- The O is squared/octagonal, optically centered, and does not collide with X or S.
- The S has the approved chamfered upper-left shoulder, pointed top terminal, angular inner returns, and clipped lower terminal.
- R and X shapes, first/last wordmark bounds, material layers, logo scale, and surrounding layout are unchanged.

- [ ] **Step 3: Capture and inspect the mobile render**

Set the viewport to `390 × 844`, reload, wait for the intro animation to settle, and save a viewport screenshot to:

```text
.superpowers/sdd/wordmark-refinement-390x844.png
```

Confirm the complete wordmark remains visible, the A gap and S silhouette remain legible, texture/facet attenuation still works, and the page has no horizontal overflow.

- [ ] **Step 4: Apply bounded visual corrections only when an acceptance check fails**

For a failed silhouette or spacing check, edit only the responsible A/O/S `d` value and its matching facet in `src/components/raxos-logo.tsx`, copy the exact new `d` value into `letterPaths` in `src/components/raxos-logo.test.ts`, then rerun:

```bash
npm test -- src/components/raxos-logo.test.ts
```

Expected: PASS after each bounded correction. Do not change CSS, dimensions, R/X paths, paint servers, or layout to compensate for letter geometry.

- [ ] **Step 5: Run the complete verification suite**

Run each command separately:

```bash
npm test
npm run lint
npm run build
git diff --check
git status --short
```

Expected:

- All Vitest tests PASS.
- ESLint exits 0 with no errors.
- Next.js production build exits 0.
- `git diff --check` prints nothing.
- `git status --short` is clean unless Task 2 produced a bounded tracked correction.

- [ ] **Step 6: Commit screenshot-driven corrections only if tracked files changed**

If Task 2 changed the two tracked logo files, run:

```bash
git add src/components/raxos-logo.tsx src/components/raxos-logo.test.ts
git commit -m "fix: tune refined wordmark spacing"
```

If no tracked file changed, do not create an empty commit. Do not stage `.superpowers/sdd/` screenshots.
