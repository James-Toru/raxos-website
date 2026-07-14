# Header Emblem Removal Design

## Goal

Remove the small boxed R emblem from the top-left interface header and shift the existing Raxos identity text into the freed space.

## Scope

- Remove the `header-emblem` element from `InterfaceChrome` markup.
- Keep `RAXOS CORP.` and `SYSTEM INTERFACE v2.4.7` unchanged.
- Let the existing `system-identity` container place the identity copy at its current left boundary, so the text naturally occupies the former emblem area.
- Apply the result at desktop and mobile breakpoints.
- Leave the large central Raxos logo, system status, enquiry form, telemetry, footer, and background unchanged.

## Styling

Delete header-emblem-only CSS that becomes unused. Preserve the identity-copy typography and the header's existing outer positioning. No replacement spacer or hidden emblem will remain.

## Testing

Update the landing structure regression test first so it requires the header emblem to be absent while preserving the identity copy and three-part footer. Run the focused test to observe the expected failure, make the minimal markup and CSS change, then run the focused and full suites, lint, build, and browser checks at compact and standard desktop sizes.

## Success Criteria

- No small logo appears in the top-left header.
- The identity text shifts left into the freed space.
- The central brand artwork and all unrelated layout remain visually unchanged.
- Automated validation and production build pass.
