# System Status Clearance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the system-status label 16px upward only on short desktop viewports so it clears the enquiry-panel border.

**Architecture:** Add a source-level regression contract to the existing layout test, then place one `.system-status` override inside the existing short-desktop media query. No component markup or JavaScript changes are required.

**Tech Stack:** CSS, Vitest, Next.js 16.2.10.

## Global Constraints

- Apply only at `max-height: 850px` and `min-width: 1101px`.
- Set short-desktop `.system-status` `padding-top` to exactly `20px`.
- Do not change the normal 1536 × 1024 composition, mobile layout, form position, or form behavior.
- Preserve the existing `36px` desktop status padding outside the compact-height breakpoint.

---

### Task 1: Add compact-height status clearance

**Files:**
- Modify: `src/components/landing-structure.test.ts`
- Modify: `src/app/fidelity.css`

**Interfaces:**
- Consumes: the existing `@media (max-height: 850px) and (min-width: 1101px)` fidelity block.
- Produces: a `20px` short-desktop status padding override.

- [ ] **Step 1: Add the failing breakpoint contract**

```ts
it("moves system status above the form border on short desktops", () => {
  const fidelity = source("src/app/fidelity.css");
  const start = fidelity.indexOf("@media (max-height: 850px) and (min-width: 1101px)");
  const end = fidelity.indexOf("\n@media", start + 1);
  const compactDesktop = fidelity.slice(start, end);
  expect(compactDesktop).toMatch(/\.system-status\s*\{[^}]*padding-top:\s*20px;/s);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: FAIL because the compact-height media block has no `.system-status` override.

- [ ] **Step 3: Add the minimal CSS override**

Inside `@media (max-height: 850px) and (min-width: 1101px)`, add:

```css
.system-status {
  padding-top: 20px;
}
```

- [ ] **Step 4: Run focused and full verification**

Run: `npm test -- src/components/landing-structure.test.ts`

Expected: PASS.

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: all commands exit 0.

- [ ] **Step 5: Verify browser geometry**

At 1280 × 720, confirm `.system-status` uses `padding-top: 20px` and its bottom edge sits above the enquiry panel's top border. At 1536 × 1024, confirm `.system-status` still uses `padding-top: 36px` and the existing panel position is unchanged. Confirm zero error-level browser logs.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing-structure.test.ts src/app/fidelity.css
git commit -m "fix: clear compact desktop status border"
```
