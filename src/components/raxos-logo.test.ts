import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/components/raxos-logo.tsx"), "utf8");

const emblemPaths = [
  "M30 32H157L202 72V111L169 141H107L78 112H156L176 94V82L155 63H67Z",
  "M30 120H73L159 206H111Z",
  "M116 141H169L202 171V207Z",
  "M30 32H157L176 49H49Z",
  "M176 49L202 72V111L176 94Z",
  "M30 120H73L91 138H48Z",
];

const letterPaths = [
  "M38 39H176L199 60V83L178 102H121L199 137H145L88 110H75V137H38V78H151L161 69L151 60H38Z",
  "M230 137L296 39H343L413 137H368L350 109H287L269 137ZM304 83H334L319 60Z",
  "M450 39H502L550 75L598 39H650L580 87L654 137H601L550 101L500 137H447L520 87Z",
  "M692 39H831L860 66V110L831 137H692L664 110V66ZM724 65L708 79V98L724 111H800L816 98V79L800 65Z",
  "M905 39H1064V65H950L938 76H1029L1064 100V115L1039 137H879V111H995L1007 101H914L879 77V59Z",
  "M38 39H176L190 52H52Z",
  "M296 39H343L352 52H287Z",
  "M450 39H502L513 47H462Z",
  "M598 39H650L638 47H586Z",
  "M692 39H831L845 52H678Z",
  "M905 39H1064V52H892Z",
];

function expectUniqueIds(ids: string[]) {
  for (const id of ids) {
    expect(source.match(new RegExp(`id=["']${id}["']`, "g")), id).toHaveLength(1);
  }
}

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
    expectUniqueIds([
      "raxos-mark-face",
      "raxos-mark-side",
      "raxos-mark-highlight",
      "raxos-mark-burn",
    ]);
    expect(source).toContain('filter="url(#raxos-mark-burn)"');
    expect(source).toContain('fill="url(#raxos-mark-side)"');
    expect(source).toContain('fill="url(#raxos-mark-face)"');
  });

  it("builds the reference emblem from two open angular ribbons", () => {
    expect(source).toContain('viewBox="30 32 172 175"');
    expect(source).toContain('className="mark-depth"');
    expect(source).toContain('className="mark-face"');
    expect(source).toContain('className="mark-facet"');
    expect(source).toContain('id="raxos-mark-highlight"');
    for (const path of emblemPaths) expect(source).toContain(`d="${path}"`);
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
    for (const path of letterPaths) expect(source).toContain(`d="${path}"`);
  });

  it("preserves every material layer and accessible artwork label", () => {
    for (const className of [
      "mark-depth",
      "mark-face",
      "mark-facet",
      "logo-depth",
      "logo-face",
      "logo-facet",
      "logo-texture",
    ]) {
      expect(source).toContain(`className="${className}"`);
    }

    expect(source.match(/aria-label="Raxos emblem"/g)).toHaveLength(1);
    expect(source.match(/aria-label="Raxos"/g)).toHaveLength(1);
  });

  it("gives every wordmark paint server a document-unique ID", () => {
    expectUniqueIds(["raxos-face", "raxos-side", "raxos-highlight", "raxos-burn", "raxos-grain"]);
  });

  it("keeps the wordmark face crisp instead of merging in a blurred duplicate", () => {
    const wordmarkGroup = source.match(
      /<motion\.g\s+className="raxos-logo__word"([\s\S]*?)>/,
    )?.[1];

    expect(wordmarkGroup).toBeDefined();
    expect(wordmarkGroup).not.toContain('filter="url(#raxos-burn)"');
  });
});
