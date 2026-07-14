import type { PropsWithChildren } from "react";

export function InterfaceChrome({ children }: PropsWithChildren) {
  return (
    <div className="interface-chrome">
      <header className="interface-header" aria-hidden="true">
        <div>
          <span>RAXOS CORP.</span>
          <span>SYSTEM INTERFACE v2.4.7</span>
        </div>
        <div>
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
        <span>SECURE CHANNEL ESTABLISHED</span>
        <span>RX-OS-7F3C2A</span>
      </footer>
    </div>
  );
}
