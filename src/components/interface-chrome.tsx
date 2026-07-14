import type { PropsWithChildren } from "react";

export function InterfaceChrome({ children }: PropsWithChildren) {
  return (
    <div className="interface-chrome">
      <header className="interface-header" aria-hidden="true">
        <div className="system-identity">
          <span className="header-emblem"><span>R</span></span>
          <div className="identity-copy">
            <span>RAXOS CORP.</span>
            <span>SYSTEM INTERFACE v2.4.7</span>
          </div>
        </div>
        <div className="system-status">
          <span>SYSTEM STATUS</span>
          <span>ONLINE</span>
        </div>
      </header>

      <aside className="interface-telemetry" aria-hidden="true">
        <span>STRUCTURE</span>
        <span>CONTEXT</span>
        <span>EXECUTION</span>
      </aside>

      {children}

      <footer className="interface-footer" aria-hidden="true">
        <span className="interface-copyright">RAXOS CORP. ALL RIGHTS RESERVED.<br />MMXXIV</span>
        <span className="interface-secure">SECURE CHANNEL ESTABLISHED</span>
        <span>RX-OS-7F3C2A</span>
      </footer>
    </div>
  );
}
