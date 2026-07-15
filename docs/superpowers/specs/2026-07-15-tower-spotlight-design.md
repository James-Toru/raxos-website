# Tower Spotlight Design

## Objective

Make the supplied architectural tower unmistakably visible on desktop while preserving the existing Raxos foreground layout, form readability, and interactive background behavior. The result should match the approved reference composition: dark opaque sides framing a clearer central tower channel.

## Approved composition

- Keep the tower centered in the open channel between the left brand stage and the right enquiry panel.
- Create a feathered central visibility window rather than a rectangular spotlight.
- Apply near-black veils over the left approximately 35% and right approximately 30% of the viewport.
- Keep the center materially brighter and more contrast-rich than the sides so the tower silhouette, facade detail, and red illuminated marks are immediately legible.
- Suppress the wallpaper's duplicate left-side logo and wordmark beneath the left veil.
- Keep the enquiry panel opaque; the tower must not depend on showing through form controls or panel surfaces.
- Preserve the existing red interactive mesh above the wallpaper and below scanlines/foreground content.

## Implementation boundary

The treatment remains isolated to `.wallpaper-layer` and `.wallpaper-layer::after`. It may change wallpaper position, opacity, filter, and gradient stops. It must not change foreground markup, form behavior, panel opacity, component geometry, z-index ordering, cursor behavior, or dependencies.

## Responsive behavior

### Desktop: 1101px and wider

- The tower is the dominant background landmark in the central channel.
- Side veils protect the brand stage and enquiry panel.
- The transition from dark sides to the clear center is soft and cinematic.
- Foreground anchor rectangles remain identical to the current experiment baseline.

### Compact desktop and tablet

- Retain a visible central architectural crop without introducing horizontal overflow.
- Preserve form contrast and keep the tower from colliding visually with field labels and controls.

### Mobile

- Use a quieter architectural crop behind the hero and upper content.
- Do not force the full tower into the narrow layout or weaken the stacked content panels.
- Preserve the existing non-repeating background and zero horizontal overflow.

## Acceptance criteria

- At 1536 x 1024 and 1280 x 720, the tower is clearly recognizable without close inspection.
- The left wallpaper branding remains subordinate to the real Raxos identity.
- The enquiry panel and all form controls retain their current contrast and geometry.
- The interactive mesh remains visible.
- At 390 x 844, the page has no horizontal overflow and the background does not repeat.
- Browser diagnostics contain no application error-level entries.
- Automated tests lock the approved desktop crop and veil treatment.
- Full tests, lint, production build, and `git diff --check` pass.

## Non-goals

- Replacing or regenerating the supplied wallpaper.
- Making the enquiry panel translucent.
- Reworking foreground copy, logos, borders, spacing, or responsive layout.
- Merging the experiment into `main` without a separate user decision.
