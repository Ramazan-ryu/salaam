import asyncio, json, re, urllib.request
from playwright.async_api import async_playwright
BASE='http://localhost:3000'
LOCS=['az','ru','en']; LENSES=['now','tonight','weekend']
REWRITE_JS = r"""
([loc, view]) => {
  const root = document.querySelector('.pub').cloneNode(true);
  root.querySelectorAll('script').forEach(s => s.remove());
  const mapHref = (h) => {
    if (/^https?:\/\//.test(h)) return null;
    const u = new URL(h, location.origin);
    const lens = u.searchParams.get('lens') || 'tonight';
    const mood = u.searchParams.get('mood');
    if (u.pathname === '/') return `#${loc}-home-${lens}${mood ? '-' + mood : ''}`;
    if (u.pathname === '/discover') return `#${loc}-discover-${lens}`;
    const m = u.pathname.match(/^\/e\/([0-9a-f-]{36})$/); if (m) return `#${loc}-e-${m[1]}`;
    return '#';
  };
  root.querySelectorAll('a[href]').forEach(a => {
    const h = a.getAttribute('href'); const m = mapHref(h);
    if (m === null) { a.setAttribute('target','_blank'); a.setAttribute('rel','noopener noreferrer'); } else a.setAttribute('href', m);
  });
  const toLink = (btn, href) => { const a = document.createElement('a'); a.innerHTML = btn.innerHTML;
    for (const at of btn.attributes) if (at.name !== 'type') a.setAttribute(at.name, at.value); a.setAttribute('href', href); btn.replaceWith(a); };
  root.querySelectorAll('.lang button').forEach(b => toLink(b, `#${b.textContent.trim().toLowerCase()}-${view}`));
  const isDisc = view.startsWith('discover'); const lensNow = isDisc ? view.split('-')[1] : null; const near = view.endsWith('-near');
  if (isDisc) {
    const groups = root.querySelectorAll('.chips');
    groups[0]?.querySelectorAll('button').forEach((b, i) => toLink(b, `#${loc}-discover-${['now','tonight','weekend'][i]}${near?'-near':''}`));
    root.querySelectorAll('.ctrl-row > button').forEach(b => toLink(b, `#${loc}-discover-${lensNow}${near?'':'-near'}`));
  }
  root.querySelectorAll('button, select').forEach(el => { el.setAttribute('disabled',''); el.setAttribute('title','Not interactive in this snapshot'); el.style.opacity = '.55'; });
  return root.outerHTML;
}
"""
async def main():
    views = {}; events = set(); css = set()
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        for loc in LOCS:
            c = await b.new_context(viewport={'width':390,'height':844}, geolocation={'latitude':40.3770,'longitude':49.8420}, permissions=['geolocation'])
            await c.add_cookies([{'name':'salaam_lang','value':loc,'url':BASE}])
            pg = await c.new_page()
            async def grab(url, view, near=False):
                await pg.goto(BASE+url); await pg.wait_for_timeout(900)
                if near:
                    await pg.click('.ctrl-row > button'); await pg.wait_for_timeout(1500)
                for h in await pg.eval_on_selector_all('link[rel=stylesheet]', 'els => els.map(e => e.getAttribute("href"))'): css.add(h)
                for h in await pg.eval_on_selector_all('a[href^="/e/"]', 'els => els.map(e => e.getAttribute("href"))'): events.add(h[3:])
                views[f'{loc}-{view}'] = await pg.evaluate(REWRITE_JS, [loc, view])
            for l in LENSES:
                await grab(f'/?lens={l}', f'home-{l}')
                for m in ['calm','energetic','curious']:
                    await grab(f'/?lens={l}&mood={m}', f'home-{l}-{m}')
                await grab(f'/discover?lens={l}', f'discover-{l}')
                await grab(f'/discover?lens={l}', f'discover-{l}-near', near=True)
            await c.close()
        for loc in LOCS:
            c = await b.new_context(viewport={'width':390,'height':844})
            await c.add_cookies([{'name':'salaam_lang','value':loc,'url':BASE}])
            pg = await c.new_page()
            for e in sorted(events):
                await pg.goto(f'{BASE}/e/{e}'); await pg.wait_for_timeout(500)
                views[f'{loc}-e-{e}'] = await pg.evaluate(REWRITE_JS, [loc, f'e-{e}'])
            await c.close()
        await b.close()
    styles = '\n'.join(urllib.request.urlopen(BASE+h).read().decode() for h in sorted(css))
    json.dump({'views': views, 'css': styles}, open('/tmp/snap.json','w'))
    print(len(views), 'views', len(events), 'events', len(styles), 'css bytes')
asyncio.run(main())
