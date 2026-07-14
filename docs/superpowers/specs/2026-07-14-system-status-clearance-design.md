# System Status Clearance Design

## Objective

Prevent the desktop `SYSTEM STATUS ONLINE` label from overlapping the enquiry panel's upper border on short desktop viewports.

## Cause

At widths of at least 1101px and heights of at most 850px, the compact-height layout moves the enquiry panel upward by removing its normal top margin. The system-status block retains its standard `36px` top padding, leaving insufficient clearance above the panel border.

## Change

Inside the existing `@media (max-height: 850px) and (min-width: 1101px)` block, set `.system-status { padding-top: 20px; }`. This moves the status content 16px upward only in the affected short-desktop layout.

The normal 1536 × 1024 reference composition, tablet layout, mobile layout, enquiry-panel position, and all form behavior remain unchanged.

## Verification

- Add a source-level regression test requiring the `20px` override inside the short-desktop media block.
- Confirm the focused layout test fails before the CSS change and passes afterward.
- Verify at 1280 × 720 that the status bottom has visible clearance above the panel's top border.
- Verify at 1536 × 1024 that the existing status and panel positions remain unchanged.
- Run the full test suite, lint, production build, and browser error check.
