# Wallpaper Experiment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Blend the supplied Raxos city JPEG into the existing command interface while preserving every foreground position and behavior.

**Architecture:** Copy the original JPEG into `public/`, render one decorative wallpaper layer inside `InterfaceChrome` immediately before the existing interactive background, and composite it with responsive CSS gradients. The wallpaper stays below the Canvas 2D mesh and scanlines, requiring no new JavaScript behavior or dependency.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, static JPEG asset, Vitest

## Global Constraints

- Work only on `codex/wallpaper-experiment` in `.worktrees/wallpaper-experiment`; do not alter `main`.
- Preserve all current logo, text, form, border, footer, and spacing geometry.
- Keep the wallpaper below the interactive data mesh and scanlines.
- Use the supplied JPEG unchanged; do not regenerate it.
- Subdue the source image's embedded logo/wordmark so it does not compete with the live identity.
- Keep the tower visible on desktop, tablet, and mobile.
- Add no runtime dependency and no new pointer or reduced-motion behavior.

---

### Task 1: Add and tune the responsive wallpaper layer

**Files:**
- Create: `public/raxos-wallpaper.jpeg`
- Modify: `src/components/landing-shell.tsx:12-21`
- Modify: `src/app/globals.css:45-80,832-947`
- Modify: `src/app/fidelity.css:3-20,303-340`
- Modify: `src/components/landing-structure.test.ts`

**Interfaces:**
- Consumes: the existing `InterfaceChrome` child stacking contract and `/raxos-wallpaper.jpeg` public asset URL.
- Produces: a decorative `<div className="wallpaper-layer" aria-hidden="true" />` rendered before `<InteractiveBackground />`.

- [ ] **Step 1: Write failing asset and layer-contract tests**

Add these assertions to `src/components/landing-structure.test.ts`:

```ts
it("layers the supplied wallpaper below the interactive mesh", () => {
  const shell = source("src/components/landing-shell.tsx");
  const wallpaper = shell.indexOf('className="wallpaper-layer"');
  const background = shell.indexOf("<InteractiveBackground />");
  const scanlines = shell.indexOf('className="scanlines"');
  const foreground = shell.indexOf('className="command-grid"');

  expect(existsSync(join(process.cwd(), "public/raxos-wallpaper.jpeg"))).toBe(true);
  expect(shell).toContain('<div className="wallpaper-layer" aria-hidden="true" />');
  expect(wallpaper).toBeGreaterThan(-1);
  expect(background).toBeGreaterThan(wallpaper);
  expect(scanlines).toBeGreaterThan(background);
  expect(foreground).toBeGreaterThan(scanlines);
});

it("defines responsive charcoal wallpaper blending", () => {
  const css = source("src/app/globals.css");
  const fidelity = source("src/app/fidelity.css");

  expect(css).toMatch(/\.wallpaper-layer\s*\{[^}]*url\("\/raxos-wallpaper\.jpeg"\)/s);
  expect(css).toMatch(/\.wallpaper-layer\s*\{[^}]*pointer-events:\s*none/s);
  expect(css).toMatch(/\.wallpaper-layer\s*\{[^}]*z-index:\s*0/s);
  expect(css).toContain(".wallpaper-layer::after");
  expect(fidelity).toMatch(/@media \(min-width: 1101px\)[\s\S]*?\.wallpaper-layer\s*\{/);
  expect(css).toMatch(/@media \(max-width: 900px\)[\s\S]*?\.wallpaper-layer\s*\{/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because the public asset, wallpaper markup, and CSS rules do not exist.

- [ ] **Step 3: Copy the original asset into the worktree**

Copy without modifying or recompressing the source:

```bash
cp /Users/james.mbugua/Documents/Raxos/raxos-wallpaper.jpeg public/raxos-wallpaper.jpeg
```

Verify both files have the same SHA-256 digest:

```bash
shasum -a 256 /Users/james.mbugua/Documents/Raxos/raxos-wallpaper.jpeg public/raxos-wallpaper.jpeg
```

Expected: identical digests.

- [ ] **Step 4: Insert the decorative layer in the correct DOM order**

Change the `InterfaceChrome` children in `src/components/landing-shell.tsx` to:

```tsx
<InterfaceChrome>
  <div className="wallpaper-layer" aria-hidden="true" />
  <InteractiveBackground />
  <div className="scanlines" aria-hidden="true" />
  <section className="command-grid" aria-label="Raxos company introduction">
    <BrandStage />
    <EnquiryForm />
  </section>
</InterfaceChrome>
```

- [ ] **Step 5: Add the base wallpaper composition**

Add to `src/app/globals.css` after the canvas rule:

```css
.wallpaper-layer {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background-image:
    linear-gradient(90deg, rgba(1, 1, 2, 0.9) 0%, rgba(1, 1, 2, 0.72) 34%, rgba(1, 1, 2, 0.38) 62%, rgba(1, 1, 2, 0.58) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 28%, rgba(0, 0, 0, 0.18) 62%, rgba(0, 0, 0, 0.78) 100%),
    url("/raxos-wallpaper.jpeg");
  background-position: 62% center;
  background-size: cover;
  filter: saturate(0.82) contrast(1.08) brightness(0.78);
  opacity: 0.54;
}

.wallpaper-layer::after {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 76% 44%, transparent 0 22%, rgba(0, 0, 0, 0.22) 52%, rgba(0, 0, 0, 0.5) 100%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.38), transparent 46%, rgba(0, 0, 0, 0.28));
  content: "";
}
```

The later Canvas 2D and scanline siblings remain above the wallpaper by DOM order and their existing z-index rules.

- [ ] **Step 6: Add desktop, tablet, and mobile refinements**

Inside the existing `@media (min-width: 1101px)` block in `src/app/fidelity.css`, add:

```css
.wallpaper-layer {
  background-position: 62% center;
  opacity: 0.56;
}
```

Inside the existing `@media (max-width: 1100px)` block in `src/app/fidelity.css`, add:

```css
.wallpaper-layer {
  background-position: 66% center;
  filter: saturate(0.76) contrast(1.08) brightness(0.68);
  opacity: 0.44;
}
```

Inside the existing `@media (max-width: 900px)` block in `src/app/globals.css`, add:

```css
.wallpaper-layer {
  position: absolute;
  background-image:
    linear-gradient(90deg, rgba(1, 1, 2, 0.86), rgba(1, 1, 2, 0.5)),
    linear-gradient(180deg, rgba(0, 0, 0, 0.48), transparent 28%, rgba(0, 0, 0, 0.82) 84%),
    url("/raxos-wallpaper.jpeg");
  background-position: 72% top;
  background-size: auto max(100svh, 760px);
  filter: saturate(0.7) contrast(1.04) brightness(0.6);
  opacity: 0.34;
}
```

- [ ] **Step 7: Verify GREEN**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: PASS with all landing structure tests passing.

Run: `npm test`

Expected: all test files and tests pass.

- [ ] **Step 8: Refine visually against the supplied mockup**

Start the worktree dev server and capture `1536 × 1024`, `1280 × 720`, and `390 × 844` screenshots. Compare each with the current `main` layout and the supplied mockup.

Tune only:

- wallpaper `background-position`;
- wallpaper `opacity`;
- gradient alpha values;
- wallpaper `filter` brightness, saturation, and contrast.

Required result:

- foreground rectangles and typography retain their original coordinates;
- the tower is legible on desktop without reducing form contrast;
- the source image's embedded logo/wordmark is subdued behind the left veil;
- the animated lower data mesh remains visible over the city/reflections;
- mobile uses an intentional tower crop with no horizontal overflow;
- zero error-level console entries.

- [ ] **Step 9: Run final verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run lint`

Expected: exit 0 with no lint errors.

Run: `npm run build`

Expected: successful Next.js production build. Restore any generated `next-env.d.ts` change before committing.

Run: `git diff --check`

Expected: exit 0 with no whitespace errors.

- [ ] **Step 10: Commit the experiment**

```bash
git add public/raxos-wallpaper.jpeg src/components/landing-shell.tsx src/app/globals.css src/app/fidelity.css src/components/landing-structure.test.ts
git commit -m "feat: add cinematic wallpaper experiment"
```
