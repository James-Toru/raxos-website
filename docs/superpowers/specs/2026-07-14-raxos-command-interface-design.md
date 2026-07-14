# Raxos Command Interface Landing Page Design

## Goal

Create a single-page Raxos company website in the latest installed Next.js release that reproduces the supplied command-interface reference as closely as practical. The page introduces Raxos as the command layer connecting company signals, AI agents, workflows, tasks, and execution, then lets interested visitors submit an enquiry.

Visual fidelity to the reference is the primary acceptance criterion. The result must preserve its composition and density rather than merely borrowing its crimson-and-black palette.

## Technical Approach

Use native browser technologies within the existing Next.js App Router application:

- React components for page structure and form states.
- SVG for the Raxos emblem and angular wordmark so they remain sharp at every size.
- CSS for clipped interface panels, borders, scanlines, glow, technical ornamentation, responsive layout, and reduced-motion behavior.
- A lightweight canvas layer for pointer-reactive particles, data ribbons, pulses, and parallax.
- Framer Motion for controlled entrance and micro-interactions already supported by the project.

This approach provides high visual fidelity without the bundle size and mobile GPU cost of a full WebGL scene. The reference image will guide the composition but will not be embedded as a flattened page background.

## Page Architecture

The home route remains a single page. `LandingShell` coordinates four independently understandable layers:

1. `InteractiveBackground`: full-viewport canvas rendering the ambient particle field and pointer response.
2. Interface chrome: the outer clipped frame, header status, vertical telemetry, footer, ticks, rules, and decorative technical markings.
3. Brand/content area: radar stage, Raxos emblem, large RAXOS wordmark, positioning line, and company-description module.
4. `EnquiryForm`: angular contact panel containing fields and submission feedback.

The enquiry API remains separate from the visual components. Email parsing and construction remain in the existing library module so their behavior can be tested without rendering the page or connecting to SMTP.

## Desktop Composition

At wide desktop sizes, the viewport is framed by a thin crimson technical border with clipped corners and small calibration marks. The interior uses an asymmetric layout matching the reference:

- A compact system identity block sits at the upper left.
- A system-status indicator sits at the upper right.
- Narrow vertical telemetry labels run along the left edge.
- The brand area occupies approximately 58% of the available content width.
- The enquiry panel occupies approximately 42%.
- The brand stage centers the angular emblem inside animated radar rings, followed by the large RAXOS wordmark and the line `STRUCTURE. CONTEXT. EXECUTION.`
- A compact bordered content module below the brand describes the product as a command layer for AI workflows, agents, tasks, and company execution.
- The enquiry form uses a tall clipped panel with an introductory eyebrow, a two-line headline, explanatory text, a short crimson divider, vertically stacked fields, and a full-width crimson submit button.
- A technical footer completes the frame with ownership text, secure-channel status, and an interface identifier.

The layout should feel intentionally dense like the reference while maintaining sufficient whitespace around the two main focal areas.

## Visual Language

The palette is deliberately narrow:

- Near-black base and charcoal surfaces.
- Muted cool greys for secondary copy.
- Crimson for structural rules and interface states.
- Hot red only for small highlights, focus, status, and controlled glow.

Typography uses a technical monospace treatment for interface labels, form copy, and telemetry. The large wordmark remains custom vector artwork. Uppercase labels, generous tracking, fine strokes, and compact type sizes reproduce the reference's industrial command-system character.

Decorative details include clipped corners, double rules, tiny ticks, targeting markers, radar arcs, security icons, small status lights, coordinate-like identifiers, scanlines, noise, and restrained red bloom. These details must remain subordinate to the logo and form.

## Motion and Pointer Interaction

The canvas renders fine crimson particles and flowing line ribbons across the lower half of the viewport. Pointer movement gently displaces nearby particles, changes the ribbon pull, and shifts the background grid. Pointer clicks produce short expanding pulses.

Additional motion is subtle and purposeful:

- Slow radar-ring rotation or scanning.
- A small system-status pulse.
- Occasional logo scanning highlight.
- Controlled entrance transitions for the brand and contact panel.
- Focus glow on active fields.
- Small button and panel responses rather than large transforms.

`prefers-reduced-motion` reduces frame rate, particle count, and nonessential transitions. Pointer-specific decoration does not replace the native cursor on coarse-pointer devices.

## Responsive Behavior

The desktop layout is the visual source of truth. Medium screens retain the two focal areas but simplify edge telemetry and decorative density. Narrow screens stack the brand, description, and enquiry panel vertically. The top and bottom chrome become more compact, horizontal overflow is prohibited, and form controls remain comfortably tappable.

Responsive changes preserve the same components, palette, clipped geometry, and hierarchy rather than converting the page into a generic mobile landing page.

## Copy

The main positioning language describes Raxos as a company command layer that connects AI workflows, agents, tasks, context, and execution. The reference's concise operational tone is retained. Suggested core copy:

- Positioning line: `STRUCTURE. CONTEXT. EXECUTION.`
- Company statement: `We turn company signals into reviewed, approved, actionable work.`
- Supporting description: `Raxos is the command layer connecting AI workflows, agents, tasks, and operators with the context required to execute.`
- Form heading: `Interested in Raxos?`

## Enquiry Flow

The form collects:

- Name, required.
- Email, required and validated.
- Company, optional.
- Message, required with a minimum useful length.

On submit, the client posts JSON to `/api/enquiry` and shows sending feedback. The server trims and validates the payload, ignores honeypot submissions, applies the existing request rate limit, constructs escaped plain-text and HTML email bodies, and sends through Infomaniak SMTP. Success clears the form and displays an inline confirmation. Validation, network, rate-limit, configuration, and SMTP failures produce concise inline messages without navigating away.

Infomaniak configuration is supplied only through uncommitted environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_REQUIRE_TLS`
- `SMTP_USER=sandbox@raxos.ai`
- `SMTP_PASSWORD`
- `CONTACT_FROM=Raxos Website <sandbox@raxos.ai>`
- `CONTACT_TO=sandbox@raxos.ai`

The password must never appear in source, tests, documentation values, build output, or version control.

## Accessibility and Performance

The page uses semantic landmarks, visible labels, keyboard-operable controls, meaningful live status output, sufficient contrast, and decorative elements hidden from assistive technology. The vector logo has an accessible Raxos label.

Canvas resolution and particle count are capped. Rendering pauses or minimizes work when the page is hidden. Mobile and reduced-motion modes lower visual complexity. No heavyweight 3D runtime is introduced.

## Testing and Acceptance

Automated tests cover:

- Valid enquiry parsing.
- Invalid email and message rejection.
- Honeypot handling.
- Header sanitization and safe email construction.
- Stable SVG rather than bitmap logo rendering.
- Critical page structure and reference-specific copy or markers where practical.

Final verification requires:

- All tests pass.
- ESLint passes.
- The production Next.js build succeeds.
- Browser review at representative desktop and mobile dimensions.
- Desktop visual comparison against the supplied reference, checking frame geometry, relative proportions, logo prominence, form placement, typography, color balance, decoration density, and background interaction.
- Mobile review for readability, tap targets, stacking, overflow, and motion behavior.

## Out of Scope

- Multiple marketing pages or navigation destinations.
- User accounts, dashboards, analytics, or CRM integration.
- WebGL or a full 3D engine.
- Storing enquiries in a database.
- Publishing SMTP credentials or committing a populated environment file.
