# Logo final-review fix report

## Scope

- Branch: `codex/wallpaper-experiment`
- Starting HEAD: `f6c35c6e4e7876dbdffbf3fb1eb7c56d87629518`
- Design reference: `docs/superpowers/specs/2026-07-15-wallpaper-logo-system-design.md`
- Authorized implementation/test files:
  - `src/components/raxos-logo.tsx`
  - `src/components/raxos-logo.test.ts`
  - `src/components/landing-structure.test.ts`
  - `src/app/globals.css`
  - `src/app/fidelity.css`

## Findings verified

1. `RaxosMark` and `RaxosLogo` used literal SVG definition IDs, so repeated component instances emitted duplicate IDs.
2. The wordmark `.logo-texture` group did not emit `aria-hidden="true"`.
3. The later-loaded responsive fidelity layer only attenuated textures, retained the old `0.2`/`0.1` values, and did not attenuate facets.
4. The wordmark defined unused `raxos-burn` and `raxos-grain` filters.
5. `globals.css` retained literal paint-server fills that would override per-instance presentation attributes.

## TDD RED evidence

Each new gap was exercised against the starting implementation before the production fix:

- `npm test -- src/components/raxos-logo.test.ts -t "gives every rendered instance unique, resolvable paint-server IDs"`
  - Failed as expected: 22 IDs were rendered but only 11 were unique.
- `npm test -- src/components/raxos-logo.test.ts -t "preserves every material layer and accessible artwork label"`
  - Failed as expected: the rendered/source texture-group contract lacked `aria-hidden="true"`.
- `npm test -- src/components/raxos-logo.test.ts -t "omits unused burn and grain filter definitions"`
  - Failed as expected: `raxos-burn` and `raxos-grain` were present.
- `npm test -- src/components/landing-structure.test.ts -t "calibrates the reconstructed brand artwork to the desktop reference"`
  - Failed as expected: responsive selectors omitted facets and used the old opacity values.

## Implementation

- Derived a safe per-component token from React `useId()` and used it to construct every emblem and wordmark definition ID.
- Bound all `fill` and `filter` `url(#...)` references to the matching instance IDs.
- Removed literal CSS paint-server fills so the instance-local SVG references cannot be overridden.
- Added a server-rendered multi-instance regression test with two marks and two logos; it verifies all emitted IDs are unique and every paint-server reference resolves to an emitted ID.
- Added `aria-hidden="true"` to the exact rendered `.logo-texture` group and asserted it from rendered markup.
- Kept desktop texture/facet opacity at `0.38`; set both layers to `0.24` at `max-width: 1100px` and `0.12` at `max-width: 900px` in the later-loaded `fidelity.css` layer.
- Removed the unused wordmark burn and grain filters.
- Preserved all SVG path geometry and made no changes to the brand-stage layout, wallpaper, form, or dependencies.

## GREEN and final verification

- `npm test -- src/components/raxos-logo.test.ts src/components/landing-structure.test.ts`
  - PASS: 2 files, 37 tests.
- `npm test`
  - PASS: 3 files, 46 tests.
- `npm run lint`
  - PASS: ESLint exited 0 with no diagnostics.
- `npm run build`
  - PASS: Next.js production build compiled, type-checked, generated 4/4 static pages, and exited 0.
  - Non-blocking pre-existing/environment warning: Next.js inferred the parent workspace root because both the parent repository and worktree contain lockfiles.
- `git diff --check`
  - PASS: no whitespace errors.
- Build-generated `next-env.d.ts` drift (`.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts`) was restored; it is absent from the final diff.

## Final concerns

No code or test concerns remain. The only observed warning is the Next.js multi-lockfile workspace-root inference warning described above; it did not affect the successful build.
