import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/components/raxos-logo.tsx"), "utf8");

const emblemPaths = [
  "M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z",
  "M18 91H66L159 176H111Z",
  "M116 111H170L202 139V176Z",
  "M18 18H163L180 33H35Z",
  "M180 33L202 53V82L180 72Z",
  "M18 91H66L82 106H34Z",
];

const letterPaths = [
  "M12 20H150L184 48V72L158 95H105L184 130H132L74 104H50V130H12V65H142L154 55L142 44H12Z",
  "M210 130L274 20H324L395 130H349L334 104H267L252 130ZM286 55L272 82H319L304 55Z",
  "M415 20H466L518 58L570 20H621L550 74L625 130H572L518 91L465 130H412L486 74Z",
  "M648 20H791L824 49V101L791 130H648L616 101V49ZM679 47L658 64V86L679 103H760L781 86V64L760 47Z",
  "M852 20H1024V47H897L883 59H990L1024 83V106L997 130H826V103H955L968 92H858L826 68V45Z",
  "M12 20H150L166 33H28Z",
  "M274 20H324L333 34H266Z",
  "M415 20H466L478 29H427Z",
  "M570 20H621L609 29H558Z",
  "M648 20H791L807 34H632Z",
  "M852 20H1024V34H839Z",
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
    expect(source).toContain('viewBox="0 0 220 184"');
    expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
  });

  it("gives the emblem document-unique paint-server IDs", () => {
    expectUniqueIds([
      "raxos-mark-face",
      "raxos-mark-side",
      "raxos-mark-highlight",
      "raxos-mark-burn",
      "raxos-mark-hex",
    ]);
    expect(source).toContain('filter="url(#raxos-mark-burn)"');
    expect(source).toContain('fill="url(#raxos-mark-side)"');
    expect(source).toContain('fill="url(#raxos-mark-face)"');
  });

  it("builds the reference emblem from two open angular ribbons", () => {
    expect(source).toContain('viewBox="0 0 220 184"');
    expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(source).toContain('className="mark-depth"');
    expect(source).toContain('className="mark-face"');
    expect(source).toContain('className="mark-facet"');
    expect(source).toContain('className="mark-texture"');
    expect(source).toContain('id="raxos-mark-highlight"');
    expect(source).toContain('id="raxos-mark-hex"');
    expect(source).toContain('fill="url(#raxos-mark-hex)"');
    expect(source).toContain('aria-hidden="true"');
    for (const path of emblemPaths) expect(source).toContain(`d="${path}"`);
    expect(source).not.toContain("204 220V181");
  });

  it("uses five independently drawn stencil letters", () => {
    expect(source).toContain('viewBox="0 0 1040 150"');
    expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(source).toContain('width="470"');
    expect(source).toContain('height="68"');
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
      "mark-texture",
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
    expectUniqueIds([
      "raxos-face",
      "raxos-side",
      "raxos-highlight",
      "raxos-burn",
      "raxos-grain",
      "raxos-word-hex",
    ]);
    expect(source).toContain('id="raxos-word-hex"');
    expect(source).toContain('<Wordmark className="logo-texture" fill="url(#raxos-word-hex)" />');
  });

  it("keeps the wordmark face crisp instead of merging in a blurred duplicate", () => {
    const wordmarkGroup = source.match(
      /<motion\.g\s+className="raxos-logo__word"([\s\S]*?)>/,
    )?.[1];

    expect(wordmarkGroup).toBeDefined();
    expect(wordmarkGroup).not.toContain('filter="url(#raxos-burn)"');
  });
});
