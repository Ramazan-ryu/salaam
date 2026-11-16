import type { Metadata } from 'next';
import Link from 'next/link';
import { IdentitySwitcher } from './identity';
import './staff.css';

export const metadata: Metadata = {
  title: 'Salaam — Staff',
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="staff">
      <div className="shell">
        <header className="top">
          <Link href="/staff" className="brand" style={{ color: 'inherit', textDecoration: 'none' }}>
            Salaam<small>staff · Baku pilot</small>
          </Link>
          <nav className="nav">
            <Link href="/staff/review">Review queue</Link>
            <Link href="/staff/events">Events</Link>
            <Link href="/staff/organizer">Organizer submit</Link>
          </nav>
          <IdentitySwitcher />
        </header>
        {children}
      </div>
    </div>
  );
}
