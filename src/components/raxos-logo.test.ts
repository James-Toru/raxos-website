import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RaxosLogo, RaxosMark } from "./raxos-logo";

const source = readFileSync(join(process.cwd(), "src/components/raxos-logo.tsx"), "utf8");

const emblemPaths = [
  "M18 18H163L202 53V82L170 111H117L93 89H160L180 72V62L158 42H43Z M18 91H60L132 176H90Z M88 91H130L202 176H160Z",
  "M18 18H163L180 33H35Z",
  "M180 33L202 53V82L180 72Z",
  "M18 91H60L73 106H31Z",
];

const letterPaths = [
  "M12 20H150L184 48V72L158 95H105L184 130H132L74 104H50V130H12V65H142L154 55L142 44H12Z",
  "M213 130L279 20H327L397 130H352L301 51L255 130Z",
  "M298 82H324L337 104H284Z",
  "M415 20H466L518 58L570 20H621L550 74L625 130H572L518 91L465 130H412L486 74Z",
  "M678 20H790L818 48V102L790 130H678L650 102V48ZM696 47L678 63V87L696 103H772L790 87V63L772 47Z",
  "M856 20H1001L1024 43H895L881 55V63H990L1024 83V106L999 130H861L838 107H958L971 95H866L838 70V43Z",
  "M12 20H150L166 33H28Z",
  "M279 20H327L336 34H270Z",
  "M415 20H466L478 29H427Z",
  "M570 20H621L609 29H558Z",
  "M678 20H790L804 34H664Z",
  "M856 20H1001L1015 34H846Z",
];

const supersededLetterPaths = [
  "M210 130L274 20H324L395 130H349L334 104H267L252 130ZM286 55L272 82H319L304 55Z",
  "M648 20H791L824 49V101L791 130H648L616 101V49ZM679 47L658 64V86L679 103H760L781 86V64L760 47Z",
  "M852 20H1024V47H897L883 59H990L1024 83V106L997 130H826V103H955L968 92H858L826 68V45Z",
];

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

  it("gives every rendered instance unique, resolvable paint-server IDs", () => {
    const markup = renderToStaticMarkup(
      createElement(
        Fragment,
        null,
        createElement(RaxosMark),
        createElement(RaxosMark),
        createElement(RaxosLogo),
        createElement(RaxosLogo),
      ),
    );
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const paintServerReferences = [...markup.matchAll(/url\(#([^)]+)\)/g)].map(
      (match) => match[1],
    );

    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect(paintServerReferences.length).toBeGreaterThan(0);
    for (const reference of paintServerReferences) expect(ids).toContain(reference);
  });

  it("builds the reference emblem from two open angular ribbons", () => {
    expect(source).toContain('viewBox="0 0 220 184"');
    expect(source).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(source).toContain('className="mark-depth"');
    expect(source).toContain('className="mark-face"');
    expect(source).toContain('className="mark-facet"');
    expect(source).toContain('className="mark-texture"');
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain(`const emblemPath = "${emblemPaths[0]}"`);
    for (const path of emblemPaths.slice(1)) expect(source).toContain(`d="${path}"`);
    expect(source.match(/<path d=\{emblemPath\} \/>/g)).toHaveLength(3);
    expect(source).not.toContain('d="M116 111H170L202 139V176H154Z"');
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
    for (const path of supersededLetterPaths) {
      expect(source).not.toContain(`d="${path}"`);
    }
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

    const markup = renderToStaticMarkup(createElement(RaxosLogo));
    expect(markup).toMatch(/<g class="logo-texture"[^>]*aria-hidden="true">/);
  });

  it("omits unused burn and grain filter definitions", () => {
    expect(source).not.toContain("raxos-burn");
    expect(source).not.toContain("raxos-grain");
  });

  it("keeps the wordmark face crisp instead of merging in a blurred duplicate", () => {
    const wordmarkGroup = source.match(
      /<motion\.g\s+className="raxos-logo__word"([\s\S]*?)>/,
    )?.[1];

    expect(wordmarkGroup).toBeDefined();
    expect(wordmarkGroup).not.toContain('filter="url(#raxos-burn)"');
  });
});
