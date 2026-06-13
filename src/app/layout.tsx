import type { Metadata } from "next";
import Link from "next/link";
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
        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <span className="text-lg font-semibold text-fg">Member Tracker</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-muted hover:text-fg">
                Members
              </Link>
              <Link href="/payments" className="text-muted hover:text-fg">
                Payments
              </Link>
            </nav>
            <a
              href="/api/export"
              className="ml-auto rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg hover:border-accent hover:text-accent"
            >
              Export to Excel
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
