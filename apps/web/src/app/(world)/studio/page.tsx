import type { Metadata } from 'next';
import { getLocale } from '@/lib/locale-server';
import { StudioHome } from '@/world/StudioHome';

export const metadata: Metadata = { title: 'Studio' };

export default async function StudioPage() {
  return <StudioHome locale={await getLocale()} />;
}
