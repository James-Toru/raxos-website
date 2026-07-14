import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/components/raxos-logo.tsx"), "utf8");

describe("RaxosLogo", () => {
  it("renders as native vector artwork instead of a cropped bitmap", () => {
    expect(source).toContain("<motion.svg");
    expect(source).not.toContain("next/image");
    expect(source).not.toContain("raxos-wordmark");
  });

  it("exports a separate angular emblem for the radar stage", () => {
    expect(source).toContain("export function RaxosMark");
    expect(source).toContain('aria-label="Raxos emblem"');
    expect(source).toContain('viewBox="0 0 240 220"');
  });

  it("gives the emblem document-unique paint-server IDs", () => {
    expect(source).toContain('id="raxos-mark-face"');
    expect(source).toContain('id="raxos-mark-side"');
    expect(source).toContain('id="raxos-mark-burn"');
    expect(source).toContain('filter="url(#raxos-mark-burn)"');
    expect(source).toContain('fill="url(#raxos-mark-side)"');
    expect(source).toContain('fill="url(#raxos-mark-face)"');
    expect(source.match(/id="raxos-face"/g)).toHaveLength(1);
    expect(source.match(/id="raxos-side"/g)).toHaveLength(1);
    expect(source.match(/id="raxos-burn"/g)).toHaveLength(1);
  });
});
