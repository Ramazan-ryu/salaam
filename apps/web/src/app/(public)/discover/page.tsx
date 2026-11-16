import type { Metadata } from 'next';
import { DICTS } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';
import { serverGet, type Category } from '@/lib/public-api';
import { LangSwitch, TopNav } from '../chrome';
import { DiscoverClient } from './discover-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Kəşf et' };

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ lens?: string; category?: string; near?: string }> }) {
  const locale = await getLocale();
  const sp = await searchParams;
  const cats = await serverGet<Category[]>('/v1/categories', locale);
  return (
    <main>
      <header className="pub-header">
        <h1 className="pub-hello">{DICTS[locale].discover}</h1>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <TopNav locale={locale} />
          <LangSwitch locale={locale} />
        </div>
      </header>
      <DiscoverClient
        locale={locale}
        categories={cats.ok ? cats.data : []}
        initialLens={['now', 'tonight', 'weekend'].includes(sp.lens ?? '') ? (sp.lens as 'now' | 'tonight' | 'weekend') : 'tonight'}
        initialCategory={sp.category ?? ''}
        initialNear={sp.near === '1'}
      />
    </main>
  );
}
