import type { Metadata } from 'next';
import Link from 'next/link';
import { IdentitySwitcher } from './identity';
import './globals.css';

export const metadata: Metadata = {
  title: 'Salaam — Staff',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="top">
            <div className="brand">
              Salaam<small>staff · Baku pilot</small>
            </div>
            <nav className="nav">
              <Link href="/review">Review queue</Link>
              <Link href="/events">Events</Link>
              <Link href="/organizer">Organizer submit</Link>
            </nav>
            <IdentitySwitcher />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
