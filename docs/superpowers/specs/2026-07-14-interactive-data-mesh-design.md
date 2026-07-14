# Interactive Data Mesh Design

## Goal

Strengthen the existing interactive canvas into a dense crimson data-wave landscape that matches the supplied Raxos reference while preserving foreground readability and layout fidelity.

## Visual Composition

- Concentrate the mesh across the lower 40–45% of the desktop viewport.
- Render multiple layered wire ribbons that flow outward from the center, with fine cross-connections that make the field read as a continuous data surface rather than separate lines.
- Add brighter crest lines, sparse red signal particles, and occasional vertical telemetry spikes.
- Retain the black and charcoal background; crimson highlights must remain subordinate to the logo, copy, and enquiry form.
- Keep the canvas behind all foreground content and avoid changing any foreground geometry.

## Interaction

- Pointer movement gently bends and lifts nearby mesh points using a smooth falloff, while distant points remain stable.
- Nearby particles may form faint connection lines to the pointer.
- Pointer clicks create a restrained expanding crimson pulse that travels through the field and fades.
- Pointer departure eases the mesh back to its resting state instead of snapping.

## Responsive Performance

- Desktop uses the full layered mesh, signal particles, telemetry spikes, and a 30 FPS target.
- Mobile uses fewer ribbon layers, cross-connections, particles, and spikes, with a lower frame-rate target.
- Device pixel ratio remains capped to avoid unnecessary rendering cost.
- The implementation must not add a WebGL or animation dependency; it will evolve the existing Canvas 2D renderer.

## Accessibility

- When `prefers-reduced-motion: reduce` is active, render one polished static frame and do not start an animation loop.
- The canvas remains decorative and `aria-hidden`.

## Testing and Verification

- Extend source-level regression tests to lock the desktop/mobile density split, mesh cross-connections, pointer deformation, click pulses, easing on pointer leave, and reduced-motion static rendering.
- Run focused and full tests, lint, and a production build.
- Verify screenshots and browser console output at `1536 × 1024`, `1280 × 720`, and `390 × 844`.
- Confirm the mesh is clearly visible at desktop sizes, lighter on mobile, and does not reduce form or text contrast.

## Success Criteria

- The lower viewport visually resembles the reference image’s dense flowing red data mesh.
- Mouse movement and clicks produce smooth, restrained responses.
- The central logo, form, header, footer, and border geometry remain unchanged.
- Desktop and mobile remain responsive, and reduced-motion users receive a static frame.
