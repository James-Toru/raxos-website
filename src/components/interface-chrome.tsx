import type { PropsWithChildren } from "react";
import { LockKeyhole } from "lucide-react";
import { RaxosMark } from "@/components/raxos-logo";

export function InterfaceChrome({ children }: PropsWithChildren) {
  return (
    <div className="interface-chrome">
      <span className="polygon-fill frame-fill" aria-hidden="true" />
      <header className="interface-header" aria-hidden="true">
        <div className="system-identity">
          <span className="header-emblem"><RaxosMark /></span>
          <div className="identity-copy">
            <span>RAXOS CORP // SYSTEMS <b>ONLINE</b></span>
          </div>
        </div>
        <div className="system-status">
          <span>SECURE CHANNEL</span>
          <LockKeyhole size={11} />
        </div>
      </header>

      <aside className="cyber-glyph-rail" aria-hidden="true">
        <span>◈</span>
        <span>⌁</span>
        <span>╳</span>
        <span>▱</span>
        <i>SYS//09</i>
        <span>⟟</span>
      </aside>

      {children}

      <footer className="interface-footer" aria-hidden="true">
        <span className="footer-brand"><RaxosMark /> <span>RAXOS CORP<br />MMXXIV</span></span>
        <span className="interface-secure"><i /> SYSTEM STATUS<br /><b>ONLINE</b></span>
        <span className="coordinates">▥▥▥▥ 35.6895° N, 139.6917° E</span>
      </footer>
    </div>
  );
}
