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
    expect(source).toContain('viewBox="30 32 172 175"');
    expect(source).toContain('preserveAspectRatio="none"');
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

  it("builds the reference emblem from two open angular ribbons", () => {
    expect(source).toContain('viewBox="30 32 172 175"');
    expect(source).toContain('className="mark-depth"');
    expect(source).toContain('className="mark-face"');
    expect(source).toContain('className="mark-facet"');
    expect(source).toContain('id="raxos-mark-highlight"');
    expect(source).toContain("M30 32H157L202 72V111L169 141H107");
    expect(source).toContain("M30 120H73L159 206H111Z");
    expect(source).not.toContain("204 220V181");
  });

  it("uses five independently drawn stencil letters", () => {
    expect(source).toContain('viewBox="38 39 1026 98"');
    expect(source).toContain('preserveAspectRatio="none"');
    expect(source).toContain('width="470"');
    expect(source).toContain('height="62"');
    expect(source).toContain('data-letter="R"');
    expect(source).toContain('data-letter="A"');
    expect(source).toContain('data-letter="X"');
    expect(source).toContain('data-letter="O"');
    expect(source).toContain('data-letter="S"');
    expect(source).toContain('className="logo-facet"');
  });

  it("keeps the wordmark face crisp instead of merging in a blurred duplicate", () => {
    const wordmarkGroup = source.match(
      /<motion\.g\s+className="raxos-logo__word"([\s\S]*?)>/,
    )?.[1];

    expect(wordmarkGroup).toBeDefined();
    expect(wordmarkGroup).not.toContain('filter="url(#raxos-burn)"');
  });
});
