# Raxos Logo and Copy Fidelity Design

## Objective

Refine the existing one-page Raxos interface so its central brand presentation matches the supplied reference image as closely as practical at 1536 × 1024. The reference interface image is the source of truth for composition, text, logo scale, spacing, and visual hierarchy. The two supplied Raxos wallpapers are secondary references for the emblem's angular construction, crimson material, and wordmark character.

## Scope

This refinement changes only the brand-stage logo, supporting text, and the CSS needed to place and render them accurately. The working enquiry form, SMTP integration, interactive background, responsive structure, and slanted-border system remain unchanged except where a small spacing adjustment is necessary to preserve the reference composition.

## Brand Mark

The current emblem will be replaced with a custom SVG reconstruction based on the reference geometry. It will use two interlocking, angular strokes that form the Raxos `R`, with straight chamfers and a clean diagonal leg. The silhouette must read clearly without the current oversized crescent-like depth shapes.

The mark will use:

- A bright crimson front face with a controlled vertical gradient.
- A narrow dark-red extrusion offset down and right.
- Sparse facet highlights to suggest the reference's machined surface.
- A restrained red glow that separates the mark from the radar field without softening its edges.
- Existing entrance motion, respecting reduced-motion preferences.

## Wordmark

`RAXOS` will remain a code-native SVG rather than a font or raster crop. Each letter will be reconstructed as an angular stencil form with the proportions seen in the reference: wide stance, sharp chamfers, consistent stroke mass, and generous letter spacing. The front face, dark extrusion, highlights, and subtle grain will share the mark's material system.

The wordmark must be visually flatter and sharper than the current version. Its glow should support legibility but must not create the heavy blur or rounded appearance visible in the current render.

## Copy

The positioning line remains exactly:

`STRUCTURE. CONTEXT. EXECUTION.`

The information card will match the reference wording:

`WE TURN COMPANY SIGNALS INTO REVIEWED, APPROVED, ACTIONABLE WORK.`

`Raxos is a company OS. A project-centered operating layer for teams who demand clarity, speed, and control.`

`BUILT FOR OPERATORS →`

Line breaks may be explicitly controlled at the desktop reference width to match the supplied composition, while smaller breakpoints may wrap naturally.

## Layout and Styling

At 1536 × 1024:

- The bright front-face silhouette of the emblem is centered within the circular radar system and targets a 165 × 160 px visual footprint.
- The wordmark sits immediately below the emblem, targets a 470 px width, and shares the reference's horizontal center.
- The positioning line sits below the wordmark with symmetric red rules and wide tracking.
- The information card begins below the positioning line at the reference offset and retains its existing clipped border treatment.
- Typography uses the existing monospace system, with size, weight, tracking, color, and line height calibrated from screenshots.

Responsive rules will preserve the same hierarchy while scaling the SVGs proportionally and allowing copy to reflow below 900 px.

## Component Boundaries

- `RaxosMark` owns the emblem SVG geometry, gradients, facets, and accessible label.
- `RaxosLogo` owns the `RAXOS` SVG geometry and shared material layers.
- `BrandStage` owns the approved copy and semantic structure.
- Brand-specific CSS owns sizing, glow, responsive behavior, and desktop alignment.

The logo remains independent of the animated radar so geometry can be tested without canvas or pointer effects.

## Verification

Verification will include:

- Unit/source tests confirming the approved copy and SVG structure.
- Existing enquiry and layout tests to prevent regression.
- A production build.
- Browser console inspection for runtime or hydration errors.
- Repeated 1536 × 1024 screenshots compared against the supplied interface reference, focusing on emblem silhouette, wordmark proportions, scale, spacing, brightness, and copy wrapping.
- A responsive visual check at the existing mobile breakpoint.

No rasterized logo asset will be introduced. The final implementation must remain crisp at arbitrary display density and must continue to honor reduced-motion settings.
