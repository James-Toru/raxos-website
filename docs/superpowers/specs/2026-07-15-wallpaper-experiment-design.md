# Wallpaper Experiment Design

## Goal

Create an isolated design option that blends the supplied Raxos city wallpaper into the existing one-page command interface without changing foreground layout, copy, form behavior, SMTP handling, or interaction contracts.

## Isolation

- All experiment work lives on `codex/wallpaper-experiment` in `.worktrees/wallpaper-experiment`.
- `main` remains unchanged unless the user later chooses to merge the experiment.
- The source JPEG will be copied into the experiment as `public/raxos-wallpaper.jpeg` once an accessible exported file is available.

## Composition

- Add a dedicated decorative wallpaper layer inside `InterfaceChrome`, after the opaque frame fill and before `InteractiveBackground`.
- Keep the wallpaper behind the animated Canvas 2D mesh, scanlines, header, telemetry, brand stage, brief, form, and footer.
- Preserve every existing foreground dimension and position.
- Use `background-size: cover` and bias the image toward the right so the illuminated tower remains visible around and behind the enquiry panel.
- Subdue the large logo and wordmark embedded in the wallpaper with a strong charcoal veil over the left side, preventing competition with the live SVG Raxos identity.
- Add top, bottom, edge, and form-side vignettes so the raster fades into the site's black/charcoal surface rather than appearing as a rectangular photograph.
- Retain a restrained amount of the source's red reflections beneath the interactive lower data mesh.

## Layer Contract

The visual stack from back to front is:

1. Existing opaque polygon frame fill.
2. New wallpaper layer.
3. Existing interactive data-mesh canvas.
4. Existing scanlines.
5. Existing foreground content and interface chrome.

The wallpaper is decorative, `aria-hidden`, non-interactive, and uses no additional JavaScript or runtime dependency.

## Responsive Behavior

- Desktop (`min-width: 1101px`): use full-bleed cover positioning with the tower weighted right, moderate wallpaper visibility, and the strongest left/form-side readability masks.
- Tablet: keep the tower visible while increasing the overall charcoal veil.
- Mobile (`max-width: 900px`): shift the crop toward the tower, lower wallpaper opacity, and use stronger top/bottom masks so the embedded source wordmark is mostly hidden and stacked content remains readable.
- The existing interactive mesh density, reduced-motion behavior, slanted borders, and form behavior remain unchanged.

## Asset Handling

- Use the supplied JPEG unchanged as the source asset; do not regenerate it.
- Keep the image's native aspect ratio and avoid upscaling beyond what `cover` requires.
- Add cache-friendly static delivery through Next.js `public/` assets.

## Testing and Verification

- Add source-level tests for asset presence, decorative semantics, DOM layer order, and desktop/mobile blend rules.
- Run focused tests, the full test suite, lint, and a production build.
- Verify screenshots at `1536 × 1024`, `1280 × 720`, and `390 × 844`.
- Compare foreground geometry against the current site to confirm it is unchanged.
- Confirm the tower is visible, the embedded wallpaper branding is subdued, the form remains readable, the interactive mesh remains visible, and browser logs contain no errors.

## Success Criteria

- The experiment reads as one seamless black/crimson interface rather than a webpage placed over a photograph.
- The supplied tower wallpaper adds cinematic depth without overpowering the current logo, copy, or enquiry form.
- Desktop and mobile crops remain intentional.
- `main` remains untouched until the user explicitly approves merging the experiment.
