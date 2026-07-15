# Wallpaper-Matched Logo System Design

## Objective

Reconstruct the website's standalone R emblem and RAXOS wordmark as responsive SVG vectors that match the shape, proportions, format, and restrained distressed finish shown in `raxos-wallpaper.jpeg`.

## Reference hierarchy

The supplied wallpaper is the visual source of truth. The reconstruction should prioritize, in order:

1. Overall silhouette and character geometry.
2. Relative proportions and spacing.
3. Chamfered cuts, internal negative space, and angular terminals.
4. Red dimensional lighting and restrained surface distress.

The reconstruction must not copy the wallpaper's surrounding glow, smoke, city detail, or black background into the logo artwork.

## Standalone R emblem

- Use a compact, nearly square silhouette like the wallpaper emblem.
- Widen the upper horizontal arm and tighten the internal black counter.
- Use the wallpaper's forward-facing upper bowl rather than the current elongated loop.
- Build the lower half from a strong descending diagonal and a shorter parallel return stroke.
- Keep all external corners sharply chamfered; avoid curves or rounded terminals.
- Preserve a clear, recognizable R silhouette at both the desktop hero size and mobile size.
- Retain shallow dimensional side faces, but reduce their depth so the emblem reads primarily as a crisp front-facing mark.

## RAXOS wordmark

- Redraw all five characters rather than approximating the reference with a font.
- Match the wallpaper's wide, low, geometric proportions and tight but readable spacing.
- Give each character clipped or chamfered outer corners.
- R: use the same visual language as the emblem, including the broad upper arm and decisive diagonal leg.
- A: use a triangular apex with an angular internal counter and stable wide stance.
- X: use balanced crossing diagonals with clipped terminals.
- O: use an octagonal outer silhouette and matching angular counter.
- S: use squared horizontal bands with clipped transitions instead of curves.
- Keep the wordmark optically centered beneath the emblem within the current brand stage.

## Surface treatment

- Use the existing deep-red-to-crimson face gradient as the base, adjusted only as needed to match the wallpaper's darker lower faces.
- Add a subtle procedural hexagonal/distressed texture clipped inside the front faces of both the emblem and wordmark.
- The texture must remain subordinate to the silhouettes: visible at desktop size, restrained at compact desktop, and nearly imperceptible on mobile.
- Use a small number of brighter facet planes to suggest the wallpaper's crystalline surface.
- Reduce the current soft outer glow and deep extrusion. Keep only a controlled red edge bloom and a shallow dark side face.
- Preserve crisp SVG edges without raster assets or embedded bitmap crops.

## Component and accessibility behavior

- Continue using `RaxosMark` for the standalone emblem and `RaxosLogo` for the wordmark.
- Preserve `role="img"`, the existing accessible labels, and the entrance animation behavior.
- Use document-unique SVG definition IDs so multiple logo instances cannot collide.
- Keep texture and highlight groups `aria-hidden`.
- Preserve reduced-motion behavior inherited from the existing motion configuration.

## Responsive behavior

### Desktop

- The emblem and wordmark should strongly resemble the wallpaper reference at first glance.
- Texture, facets, and shallow depth may be visible, but the silhouette remains dominant.
- Existing brand-stage placement and surrounding copy remain unchanged unless a small intrinsic SVG viewBox correction is required to prevent clipping.

### Compact desktop and mobile

- Preserve the exact same vector silhouettes.
- Reduce texture and facet opacity through existing responsive CSS rather than swapping assets.
- Do not introduce horizontal overflow or overlap the positioning line and company brief.

## Implementation boundary

Primary changes belong in `src/components/raxos-logo.tsx`, its tests, and the existing logo-specific CSS rules. Do not change the enquiry form, wallpaper treatment, interactive mesh, company copy, header, footer, API behavior, or dependencies.

## Acceptance criteria

- Side-by-side comparison at 1536 x 1024 shows the website emblem and wordmark matching the wallpaper's angular silhouettes and proportions.
- The emblem's upper arm, inner counter, and diagonal lower strokes visually align with the wallpaper reference.
- RAXOS uses a wider, lower character system with consistent chamfered geometry.
- Texture is visible but subordinate on desktop and does not reduce mobile legibility.
- No clipped paths, blurred duplicate faces, malformed paint-server references, or SVG ID collisions occur.
- The existing brand-stage geometry and surrounding content remain stable.
- Screenshots at 1536 x 1024, 1280 x 720, and 390 x 844 show no overlap or horizontal overflow.
- Existing logo tests plus new geometry and texture contracts pass, followed by the full test suite, lint, production build, and `git diff --check`.

## Non-goals

- Extracting or cropping raster logo pixels from the wallpaper.
- Changing the wallpaper, tower spotlight, form, copy, page layout, or brand-stage interaction.
- Creating alternate colorways, lockups, icons, favicons, or export packages.
- Merging the worktree into `main` without a separate user decision.
