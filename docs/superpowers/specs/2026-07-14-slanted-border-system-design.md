# Raxos Slanted Border System

## Goal

Replace the visually weak clipped borders with crisp, reference-matched crimson polygon borders on the outer interface frame, enquiry panel, company brief, and send button. Preserve all current dimensions, content positions, responsiveness, and interactions.

## Selected approach

Use layered CSS polygons. Each surface receives an outer clipped crimson silhouette and an inset dark surface using a pseudo-element or nested background layer. This creates continuous diagonal border strokes, unlike applying `border` directly to a clipped element.

Alternatives considered:

- SVG border overlays offer precise paths but add component-specific markup and scaling complexity.
- CSS masks can subtract the interior precisely, but are harder to maintain across browsers and responsive breakpoints.
- Layered polygons provide the best balance of visual fidelity, responsiveness, and maintainability.

## Surface geometry

- Outer frame: 10px cuts on all four corners, with thin crimson perimeter lines.
- Enquiry panel: 18px top-left, 72px top-right, 26px bottom-left, and 22px bottom-right cuts to reproduce the reference's asymmetric console silhouette.
- Company brief: 14px top-left and bottom-right cuts, with squared opposing corners.
- Send button: 8px top-left and bottom-right cuts, plus short white technical corner brackets already present in the interaction layer.

The visible border should remain approximately one physical pixel at the 1536×1024 reference viewport. Interior fills remain near-black and must cover the inset portion of the outer crimson silhouette.

## Implementation boundaries

The system will be expressed as reusable CSS custom properties for cut sizes, border color, fill, and inset. Existing form behavior, accessibility, SMTP handling, typography, canvas interaction, and layout geometry will not change.

Pseudo-elements currently used for technical accents will be preserved or consolidated so each component has a single clear border layer and a separate accent layer.

## Responsive behavior

Desktop uses the full asymmetric reference geometry. Tablet and mobile reduce cut sizes while retaining the same corner directions. No clipped edge may intersect content or focus outlines.

## Verification

- Add source-level regression checks for the layered polygon border system and all four target surfaces.
- Run the complete test suite and production build.
- Capture a 1536×1024 browser screenshot.
- Compare the final render with the supplied reference, iterating on cut lengths, inset thickness, and border brightness until the corner language visually aligns.

