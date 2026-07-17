import { describe, expect, it } from "vitest";
import {
  getOperativeEntryDuration,
  OPERATIVE_ENTRY_MAX_SECONDS,
  OPERATIVE_ENTRY_MIN_SECONDS,
} from "./cinematic-motion";

describe("operative entry timing", () => {
  it("keeps the established timing on compact and standard screens", () => {
    expect(getOperativeEntryDuration(390)).toBe(OPERATIVE_ENTRY_MIN_SECONDS);
    expect(getOperativeEntryDuration(1440)).toBe(OPERATIVE_ENTRY_MIN_SECONDS);
  });

  it("allows enough running time as the viewport gets wider", () => {
    expect(getOperativeEntryDuration(1920)).toBeCloseTo(2.8, 5);
    expect(getOperativeEntryDuration(2560)).toBeCloseTo(3.7333, 4);
  });

  it("caps extreme widths and safely handles invalid measurements", () => {
    expect(getOperativeEntryDuration(10000)).toBe(OPERATIVE_ENTRY_MAX_SECONDS);
    expect(getOperativeEntryDuration(Number.NaN)).toBe(OPERATIVE_ENTRY_MIN_SECONDS);
    expect(getOperativeEntryDuration(0)).toBe(OPERATIVE_ENTRY_MIN_SECONDS);
  });
});
