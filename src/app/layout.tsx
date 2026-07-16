import type { Metadata } from "next";
import "./globals.css";
import "./fidelity.css";

export const metadata: Metadata = {
  title: "Raxos",
  description:
    "The command layer where humans, AI agents, workflows, and automations coordinate company execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/raxos-tower.avif"
          as="image"
          type="image/avif"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
