# Tower Spotlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the supplied tower unmistakably visible in a feathered desktop center channel while keeping both sides dark and preserving every foreground surface and interaction.

**Architecture:** Keep the existing wallpaper DOM layer and stacking order. Replace only its desktop gradient, filter, and opacity treatment with a center-window composition; retain the current responsive layer as the compact/mobile fallback. Lock the desktop composition in the existing source-contract test, then validate real rendering at the three approved viewports.

**Tech Stack:** Next.js 16, React 19, CSS gradients and filters, Vitest source-contract tests, in-app browser screenshot verification.

## Global Constraints

- Work only in `/Users/james.mbugua/Documents/Raxos/.worktrees/wallpaper-experiment` on `codex/wallpaper-experiment`.
- Do not change foreground markup, form behavior, panel opacity, component geometry, z-index ordering, cursor behavior, or dependencies.
- Keep the tower centered in the open channel between the left brand stage and the right enquiry panel.
- Apply near-black veils over the left approximately 35% and right approximately 30% of the viewport.
- Keep the supplied JPEG byte-for-byte unchanged.
- Keep the existing wallpaper → interactive mesh → scanlines → foreground stacking.
- Keep mobile non-repeating with zero horizontal overflow.
- Do not merge into `main` without a separate user decision.

---

### Task 1: Lock and implement the desktop center window

**Files:**
- Modify: `src/components/landing-structure.test.ts`
- Modify: `src/app/fidelity.css`

**Interfaces:**
- Consumes: the existing `.wallpaper-layer` and `.wallpaper-layer::after` elements and the supplied `/raxos-wallpaper.jpeg` background.
- Produces: a desktop-only center-window visual contract under `@media (min-width: 1101px)`; compact and mobile rules remain the fallback.

- [ ] **Step 1: Write the failing desktop treatment test**

Extend `defines responsive charcoal wallpaper blending` in `src/components/landing-structure.test.ts` with assertions for the approved center window:

```ts
expect(fidelity).toMatch(
  /@media \(min-width: 1101px\)[\s\S]*?\.wallpaper-layer\s*\{[^}]*rgba\(1, 1, 2, 0\.94\)[^}]*rgba\(1, 1, 2, 0\.08\)[^}]*rgba\(1, 1, 2, 0\.9\)/s,
);
expect(fidelity).toMatch(
  /@media \(min-width: 1101px\)[\s\S]*?\.wallpaper-layer\s*\{[^}]*filter:\s*saturate\(0\.95\) contrast\(1\.18\) brightness\(0\.92\)[^}]*opacity:\s*0\.9/s,
);
expect(fidelity).toMatch(
  /@media \(min-width: 1101px\)[\s\S]*?\.wallpaper-layer::after\s*\{[^}]*transparent 45% 64%/s,
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/components/landing-structure.test.ts
```

Expected: one failure in `defines responsive charcoal wallpaper blending` because the current desktop layer has no approved center-window gradients or filter values; the other 28 tests pass.

- [ ] **Step 3: Implement the minimal desktop spotlight CSS**

Replace the desktop `.wallpaper-layer` rule in `src/app/fidelity.css` with:

```css
.wallpaper-layer {
  background-image:
    linear-gradient(
      90deg,
      rgba(1, 1, 2, 0.94) 0%,
      rgba(1, 1, 2, 0.84) 30%,
      rgba(1, 1, 2, 0.18) 43%,
      rgba(1, 1, 2, 0.08) 58%,
      rgba(1, 1, 2, 0.28) 69%,
      rgba(1, 1, 2, 0.9) 100%
    ),
    linear-gradient(180deg, rgba(0, 0, 0, 0.24) 0%, transparent 32%, rgba(0, 0, 0, 0.08) 68%, rgba(0, 0, 0, 0.68) 100%),
    url("/raxos-wallpaper.jpeg");
  background-position: calc(50% - 260px) center;
  filter: saturate(0.95) contrast(1.18) brightness(0.92);
  opacity: 0.9;
}

.wallpaper-layer::after {
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.42) 0 28%, transparent 45% 64%, rgba(0, 0, 0, 0.48) 78% 100%),
    radial-gradient(ellipse at 55% 46%, transparent 0 30%, rgba(0, 0, 0, 0.12) 56%, rgba(0, 0, 0, 0.46) 100%);
}
```

Do not alter any other desktop foreground rule or the `max-width: 1100px` fallback.

- [ ] **Step 4: Run focused and full automated verification**

Run:

```bash
npm test -- src/components/landing-structure.test.ts
npm test
npm run lint
git diff --check
```

Expected: 29/29 focused tests and 46/46 full tests pass; lint and diff checks exit 0.

- [ ] **Step 5: Commit the automated implementation**

```bash
git add src/app/fidelity.css src/components/landing-structure.test.ts
git commit -m "feat: add focused tower spotlight"
```

### Task 2: Verify and refine the real rendering

**Files:**
- Modify only if visual tuning is required: `src/app/fidelity.css`
- Test only if a tuned constant changes: `src/components/landing-structure.test.ts`
- Evidence: `.superpowers/sdd/tower-spotlight-1536x1024.jpg`
- Evidence: `.superpowers/sdd/tower-spotlight-1280x720.jpg`
- Evidence: `.superpowers/sdd/tower-spotlight-390x844.jpg`

**Interfaces:**
- Consumes: the Task 1 desktop center-window CSS and existing responsive fallbacks.
- Produces: browser evidence that the approved composition works without geometry or behavior regressions.

- [ ] **Step 1: Start or reuse the worktree development server**

Run:

```bash
npm run dev -- --webpack
```

Expected: the worktree is available at `http://localhost:3000`.

- [ ] **Step 2: Capture and inspect 1536 x 1024**

Capture the viewport after the entrance animation settles. Record computed wallpaper position, filter, opacity, page width, and the rectangles for `.interface-header`, `.brand-stage`, `.raxos-logo`, `.company-brief`, `.enquiry-panel`, and `.interface-footer`.

Expected:

- Tower facade and red marks are immediately recognizable in the center channel.
- The left 35% and right 30% read as darker than the center.
- Wallpaper branding does not compete with the foreground logo.
- Foreground rectangles match the existing baseline recorded in `.superpowers/sdd/task-1-report.md`.
- The interactive mesh remains visible across the lower third.

- [ ] **Step 3: Capture and inspect 1280 x 720**

Expected: the tower remains clearly visible in the center, the form retains strong contrast, and `scrollWidth === clientWidth`.

- [ ] **Step 4: Capture and inspect 390 x 844**

Expected: the existing quieter mobile crop remains, `scrollWidth === clientWidth === 390`, the wallpaper does not repeat, and there are zero application error-level console entries.

- [ ] **Step 5: Tune only if a screenshot fails an acceptance criterion**

Change one of these at a time in the desktop rules only: horizontal gradient stops, desktop opacity, `brightness()`, `contrast()`, or radial-gradient center. Update the exact test constant first, verify RED, then make the matching CSS change and verify GREEN. Do not change foreground CSS.

- [ ] **Step 6: Run final verification**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
shasum -a 256 /Users/james.mbugua/Documents/Raxos/raxos-wallpaper.jpeg public/raxos-wallpaper.jpeg
git status --short
```

Expected: 46/46 tests pass; lint, build, and diff checks exit 0; both hashes remain `4f035737ef92294c143184de5c3f5ba3df2449a057b520ec69601f3bd72a75e0`; the worktree is clean after restoring any build-generated `next-env.d.ts` drift.

- [ ] **Step 7: Commit visual tuning only if Task 2 changed tracked files**

```bash
git add src/app/fidelity.css src/components/landing-structure.test.ts
git commit -m "fix: refine tower spotlight balance"
```
