# Header Emblem Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the small boxed R emblem from the top-left header and shift the existing identity copy into the freed space.

**Architecture:** Remove the emblem from `InterfaceChrome` markup so it no longer participates in layout or accessibility. Delete only the now-unused emblem-specific desktop CSS; retain the existing identity-copy, responsive header, system-status, central logo, and form rules.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest

## Global Constraints

- Keep `RAXOS CORP.` and `SYSTEM INTERFACE v2.4.7` unchanged.
- Apply the result at desktop and mobile breakpoints.
- Leave the large central Raxos logo, system status, enquiry form, telemetry, footer, and background unchanged.
- Do not leave a hidden emblem or replacement spacer.

---

### Task 1: Remove the header emblem

**Files:**
- Modify: `src/components/landing-structure.test.ts:231-239`
- Modify: `src/components/interface-chrome.tsx:7-15`
- Modify: `src/app/fidelity.css:25-52`

**Interfaces:**
- Consumes: the existing `InterfaceChrome({ children }: PropsWithChildren)` component contract.
- Produces: the same component contract with `.system-identity` containing only `.identity-copy`.

- [ ] **Step 1: Write the failing regression test**

Replace the existing header identity assertion with:

```ts
it("includes the text-only header identity and three-part footer", () => {
  const chrome = source("src/components/interface-chrome.tsx");

  expect(chrome).not.toContain("header-emblem");
  expect(chrome).toContain("identity-copy");
  expect(chrome).toContain("RAXOS CORP.");
  expect(chrome).toContain("SYSTEM INTERFACE v2.4.7");
  expect(chrome).toContain("RAXOS CORP. ALL RIGHTS RESERVED.");
  expect(chrome).toContain("interface-secure");
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because `src/components/interface-chrome.tsx` still contains `header-emblem`.

- [ ] **Step 3: Remove the emblem markup**

Change `.system-identity` in `src/components/interface-chrome.tsx` to:

```tsx
<div className="system-identity">
  <div className="identity-copy">
    <span>RAXOS CORP.</span>
    <span>SYSTEM INTERFACE v2.4.7</span>
  </div>
</div>
```

The existing flex container will place `.identity-copy` at the header's left boundary without adding a spacer.

- [ ] **Step 4: Remove unused emblem-only CSS**

Delete these rules from the desktop section of `src/app/fidelity.css`:

```css
.header-emblem {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border: 1px solid rgba(255, 21, 29, 0.78);
  color: #ff111d;
  font-size: 25px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 0 14px rgba(255, 0, 12, 0.55);
}

.header-emblem > span {
  transform: skew(-10deg) scaleX(1.16);
}
```

Then replace the combined pseudo-element rule with:

```css
.interface-header .system-status span:first-child::before {
  display: none;
}
```

- [ ] **Step 5: Run focused and full automated verification**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: PASS with all landing structure tests passing.

Run: `npm test`

Expected: PASS with all test files and tests passing.

Run: `npm run lint`

Expected: exit 0 with no lint errors.

Run: `npm run build`

Expected: exit 0 with a successful Next.js production build. Restore any generated `next-env.d.ts` change before committing.

- [ ] **Step 6: Verify responsive appearance in the browser**

At `1280 × 720`, `1536 × 1024`, and `390 × 844`, confirm:

- no `.header-emblem` element exists;
- `.identity-copy` starts at the `.system-identity` left edge;
- the central logo, system status, and enquiry form retain their existing geometry;
- there are no error-level console logs.

- [ ] **Step 7: Commit the implementation**

```bash
git add src/components/landing-structure.test.ts src/components/interface-chrome.tsx src/app/fidelity.css
git commit -m "fix: remove top-left header emblem"
```
