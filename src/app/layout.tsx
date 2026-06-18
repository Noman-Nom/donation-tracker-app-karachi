import type { Metadata } from "next";
import { Download, Wallet } from "lucide-react";
import { NavBar } from "@/components/ui/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Member Tracker",
  description: "Organization member & contribution tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-20 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
            <span className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-fg">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
                <Wallet className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              Member Tracker
            </span>

            <NavBar />

            <a
              href="/api/export"
              className="btn-ghost ml-auto"
              aria-label="Export all data to Excel"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
