import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/unbounded';
import { getLocale } from '@/lib/locale-server';

export const metadata: Metadata = {
  title: { default: 'Salaam — Bakı', template: '%s · Salaam' },
  description: 'Bakıda bu gün nə var: yoxlanılmış tədbirlər, yaxınlıqdakı yerlər.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#FBF7F2' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
