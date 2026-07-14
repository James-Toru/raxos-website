# Task 1 Report: Responsive interactive data mesh

## Status

Automated implementation and verification complete. Final browser screenshot comparison and visual tuning are handed off to the controller.

## Starting point

- Worktree: `/Users/james.mbugua/Documents/Raxos/.worktrees/interactive-data-mesh`
- Required starting HEAD: `95199011c7ac6443c19fb9873de2133dc7f9d10f`
- Initial worktree status: clean

## Changed files

- `src/components/landing-structure.test.ts`
- `src/components/interactive-background.tsx`

No foreground layout files were changed. The build-generated `next-env.d.ts` drift was restored before commit.

## Implementation

- Added explicit desktop and mobile mesh profiles controlling layers, sampling, particle caps, transverse/spike density, frame rate, and opacity.
- Selected the responsive profile during canvas reset while retaining the existing 1.25 DPR cap.
- Extracted `sampleRibbonPoint` so ribbons, cross-connections, and telemetry spikes use the same geometry and pointer deformation.
- Added profile-driven transverse connections and deterministic telemetry spikes.
- Replaced fixed nine-layer rendering with responsive 13-layer desktop and six-layer mobile meshes using 30px spacing.
- Replaced binary pointer activity with eased position and strength targets; particle displacement, connection opacity, grid drift, and ribbon lift respond smoothly to strength.
- Preserved the existing 1050ms click-pulse lifetime and four-pulse cap.

## TDD evidence

### RED

Command: `npm test -- src/components/landing-structure.test.ts`

Result: exit 1. Three expected contract tests failed because the profiles, shared sampler, cross-connections, telemetry spikes, eased pointer strength, and profile-driven layer loop were absent. The other 20 tests passed.

### GREEN

Command: `npm test -- src/components/landing-structure.test.ts`

Result: exit 0. One file passed; all 23 tests passed.

## Final verification

- `npm test`: exit 0; 3 files and 40 tests passed.
- `npm run lint`: exit 0; no lint errors reported.
- `npm run build`: exit 0; Next.js compiled, type-checked, and generated all routes. It emitted the known multiple-lockfile workspace-root warning.
- `git diff --check`: exit 0; no whitespace errors.
- Scope check: only the two required implementation files are modified; `next-env.d.ts` matches HEAD.

## Self-review

- Desktop profile uses the exact 13/96/168/30 values; mobile uses 6/56/72/22.
- Responsive frame throttling and particle counts are recalculated on resize.
- All mesh surface features consume the same profile and ribbon sampler, preventing geometry drift between longitudinal lines, transverse lines, and spikes.
- Pointer leave eases strength toward zero rather than snapping geometry; pointer move eases toward one.
- Reduced-motion behavior remains static and does not start an animation loop.
- Existing pulse lifetime/cap, canvas component interface, event cleanup, and DPR cap remain intact.
- Foreground layout and unrelated files are untouched.

## Commit

- Subject: `feat: intensify interactive data mesh`
- SHA: `0f70f54d38c4a69c0b9d025256a36802268c76ae`

## Browser handoff

The controller should inspect 1536 x 1024, 1280 x 720, and 390 x 844 before and after pointer movement, confirm the desktop field is denser/brighter while foreground text and borders remain dominant, confirm mobile is lighter and smooth, compare the desktop landscape to the reference, and verify zero error-level browser logs. Any final tuning should be limited to mesh opacity, vertical base, and line spacing.

## Concerns

No automated implementation concerns. Visual density, reference fidelity, and runtime console behavior require the controller's browser verification.

## Reviewer-finding fix

### Root cause verification

- The 13-layer desktop mesh used 30px vertical offsets around a 64% viewport-height base without a clip. At 720px tall, the top layer plus wave amplitude could render into approximately the upper third of the canvas; at 1024px it could render above the intended lower field.
- The live controller screenshot `.superpowers/sdd/mesh-1536-before-tuning.jpg` showed no readable data landscape. Source inspection confirmed the canvas is below `.frame-fill`, while the inherited outer-frame polygon fill was 96–98% opaque, compositing away almost all mesh contrast.

### Fixes

- Added an explicit canvas clip from 56% viewport height to the bottom on desktop, constraining mesh geometry to the lower 44% at both target desktop sizes. Mobile clips from 60% to the bottom and retains its existing 0.64 opacity profile.
- Scoped the clip to ribbons, cross-connections, telemetry spikes, particles, and pointer connections. Existing click pulses and the beam remain outside the mesh-only clip.
- Added a `.frame-fill`-specific gradient that remains 82% opaque at the top but uses 38–48% opacity through the lower field. Company-brief and enquiry-panel fills remain unchanged at 92–99% opacity, preserving foreground dominance and all geometry.
- Added source regression contracts for both the lower-band canvas clip and frame-specific transparent integration.

### Fix TDD evidence

Lower-band RED command: `npm test -- src/components/landing-structure.test.ts`

Output: exit 1; 1 failed and 23 passed across 24 tests. `clips the data mesh to the lower viewport band` failed because `meshTop`, `context.rect(...)`, and `context.clip()` were absent.

Lower-band GREEN command: `npm test -- src/components/landing-structure.test.ts`

Output: exit 0; 1 file passed and 24/24 tests passed.

Frame-integration RED command: `npm test -- src/components/landing-structure.test.ts`

Output: exit 1; 1 failed and 24 passed across 25 tests. `reveals the canvas mesh through the outer interface frame` failed because no frame-specific transparent gradient existed.

Frame-integration GREEN command: `npm test -- src/components/landing-structure.test.ts`

Output: exit 0; 1 file passed and 25/25 tests passed.

### Fix final verification

- Command: `npm test`
  - Output: exit 0; 3 files passed and 42/42 tests passed.
- Command: `npm run lint`
  - Output: exit 0; ESLint reported no errors.
- Command: `npm run build`
  - Output: exit 0; Next.js compiled successfully, completed TypeScript checking, generated 4/4 static pages, and finalized optimization. The known multiple-lockfile workspace-root warning was emitted.
- Command: `git diff --check`
  - Output: exit 0; no whitespace errors.
- Build-generated `next-env.d.ts` drift was restored before commit.

### Fix self-review

- The desktop clip uses a height ratio rather than fixed pixels, so both 1536 x 1024 and 1280 x 720 retain the same lower-44% band.
- The mobile profile remains lower-density, lower-frame-rate, and opacity-scaled, with a lower-40% clip.
- The transparency override targets only `.frame-fill`; panel fills, text, foreground geometry, responsive layout, pointer easing, reduced motion, pulse behavior, and dependencies are unchanged.

### Fix commit

- Subject: `fix: reveal lower data mesh`

### Remaining controller check

Re-capture the target desktop and mobile viewports to confirm the newly visible lower field matches the desired reference balance and that no error-level console entries occur.

### Fix concerns

No automated concerns. Final visual balance remains a controller browser check.

## Second integration fix: correct canvas stacking

### Controller evidence and root cause

The controller screenshot `.superpowers/sdd/mesh-1536-revealed.jpg` showed that the frame-transparency override exposed the interface chrome's red parent border background across the full page, producing a crimson wash while the low-alpha mesh remained faint. The renderer was still outside `InterfaceChrome`, so it painted before the opaque frame fill. Changing fill opacity addressed the covering layer but exposed the wrong layer beneath it.

### Integration correction

- Removed the `.frame-fill` transparency override, restoring the original 96–98% opaque inner frame.
- Moved `<InteractiveBackground />` inside `<InterfaceChrome>`, before the foreground `.command-grid`, so the canvas paints after the frame fill but remains under the foreground z-index layers.
- Moved `.scanlines` alongside the nested canvas and after it in DOM order, preserving the scanline overlay.
- Updated the canvas selectors in both `globals.css` and `fidelity.css` from `.command-interface > canvas` to `.interface-chrome > canvas` without changing any canvas geometry or opacity values.
- Replaced the invalid transparency regression with an integration contract covering DOM order, opaque frame restoration, and both nested canvas selectors.
- Preserved the lower-band renderer clip and all renderer behavior; `interactive-background.tsx` has no diff in this correction.

### Integration TDD evidence

RED command: `npm test -- src/components/landing-structure.test.ts`

Output: exit 1; 1 failed and 24 passed across 25 tests. `stacks the canvas inside the opaque frame and below foreground chrome` failed because `<InteractiveBackground />` could not be found after `<InterfaceChrome>`.

GREEN command: `npm test -- src/components/landing-structure.test.ts`

Output: exit 0; 1 file passed and 25/25 tests passed.

### Integration final verification

- Command: `npm test`
  - Output: exit 0; 3 files passed and 42/42 tests passed.
- Command: `npm run lint`
  - Output: exit 0; ESLint reported no errors.
- Command: `npm run build`
  - Output: exit 0; Next.js compiled successfully, completed TypeScript checking, generated 4/4 static pages, and finalized optimization. The known multiple-lockfile workspace-root warning was emitted.
- Command: `git diff --check`
  - Output: exit 0; no whitespace errors.
- Build-generated `next-env.d.ts` drift was restored before commit.

### Integration self-review

- DOM and z-index order is now opaque frame fill (z0, earlier sibling), ambient/canvas (z0, later sibling), scanlines (z1), `.command-grid` (z4), and header/footer chrome (z9).
- Only component nesting and selector ownership changed; foreground dimensions, spacing, clipping polygons, and canvas rendering geometry remain unchanged.
- The lower-band clip, mobile opacity profile, pointer easing, reduced-motion behavior, pulse lifetime/cap, and event cleanup remain unchanged.

### Integration commit

- Subject: `fix: stack data mesh inside frame`

### Remaining controller check

Re-capture desktop and mobile viewports to confirm the restored dark frame, visible lower mesh, preserved scanline overlay, and zero error-level console entries.

### Integration concerns

No automated concerns. Final visual balance remains a controller browser check.
