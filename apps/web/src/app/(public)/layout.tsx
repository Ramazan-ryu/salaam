import { getLocale } from '@/lib/locale-server';
import { TabBar } from './chrome';
import './public.css';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <div className="pub">
      <div className="pub-shell">{children}</div>
      <TabBar locale={locale} />
    </div>
  );
}
