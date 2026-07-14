import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("Raxos command interface", () => {
  it("composes the reference chrome, brand stage, and contact panel", () => {
    const shell = source("src/components/landing-shell.tsx");
    const chromePath = join(process.cwd(), "src/components/interface-chrome.tsx");

    expect(shell).toContain("command-interface");
    expect(shell).toContain("<InterfaceChrome>");
    expect(shell).toContain("<BrandStage />");
    expect(shell).toContain("<EnquiryForm />");
    expect(existsSync(chromePath)).toBe(true);

    if (!existsSync(chromePath)) return;
    const chrome = readFileSync(chromePath, "utf8");
    expect(chrome).toContain("RAXOS CORP.");
    expect(chrome).toContain("SYSTEM STATUS");
    expect(chrome).toContain("SECURE CHANNEL ESTABLISHED");
    expect(chrome).toContain("STRUCTURE");
    expect(chrome).toContain("CONTEXT");
    expect(chrome).toContain("EXECUTION");
  });

  it("uses the reference positioning and operational copy", () => {
    const brand = source("src/components/brand-stage.tsx");
    expect(brand).toContain("STRUCTURE. CONTEXT. EXECUTION.");
    expect(brand).toContain("WE TURN COMPANY SIGNALS");
    expect(brand).toContain("AI workflows, agents, tasks, and operators");
    expect(brand).toContain("BUILT FOR OPERATORS");
  });
});
