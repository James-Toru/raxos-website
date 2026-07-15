# Raxos Wordmark Spacing Refinement Design

## Goal

Refine the existing vector RAXOS wordmark so its A, O, and S more closely match the supplied wallpaper artwork while preserving the accepted emblem, layout, material treatment, and overall wordmark width.

## Scope

The change is limited to `src/components/raxos-logo.tsx` and its focused tests. The R emblem, R and X letter geometry, SVG view box, rendered dimensions, animation timing, gradients, texture, accessibility labels, responsive behavior, and page layout remain unchanged.

## Approved Geometry

### A

- Keep a wide triangular outer structure with continuous left and right legs.
- Draw the crossbar as a separate polygon anchored visually to the right leg.
- Shorten the crossbar from the left so a clearly visible negative gap separates it from the left diagonal.
- Keep the apex, stroke weight, and baseline aligned with the other letters.

### O

- Use a squared octagonal outer silhouette rather than the current broad generic ring.
- Keep the inner counter similarly angular and optically centered.
- Narrow the O enough to create balanced gaps on both sides without changing the complete wordmark width.

### S

- Use the supplied S reference as the silhouette guide.
- Give the upper-left shoulder a chamfered corner.
- End the upper stroke in a sharp point.
- Use angular inner returns and a clipped lower terminal while retaining a forward-slanted, aggressive stance.

### Spacing

- Preserve the `0 0 1040 150` view box and current rendered dimensions.
- Remove the existing X/O overlap and the nearly absent O/S gap.
- Redistribute the internal letter positions while keeping the first and last visual bounds stable.
- Judge spacing optically between visible silhouettes rather than requiring identical mathematical bounding-box gaps.

## Materials and Facets

Every edited letter must remain present in all applicable wordmark layers: depth, face, highlight facet, and hex texture. Facet paths must follow the revised letter positions and silhouettes. Existing instance-safe paint server IDs and `aria-hidden` treatment for decorative layers remain intact.

## Component Contract

`RaxosLogo` keeps its current public API and accessible name. `Wordmark` and `WordmarkFacets` remain internal helpers. No new runtime state, props, assets, dependencies, or data flow are introduced.

## Verification

- Update focused geometry assertions for the approved A, O, and S paths and their facets.
- Confirm the existing logo accessibility and unique paint-server tests continue to pass.
- Run the complete unit test suite, lint, and production build.
- Capture desktop and mobile screenshots from the running site.
- Compare the desktop wordmark with the supplied wallpaper, checking the A gap, O proportions, S corner/terminals, optical spacing, fixed overall width, and absence of layout regressions.

## Non-Goals

- Reworking the R emblem or the R and X letters.
- Changing logo colors, texture strength, glow, animation, or page placement.
- Modifying the wallpaper, form, background interaction, or any non-logo content.
