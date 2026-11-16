import json, html
d = json.load(open('/tmp/snap.json'))
sections = '\n'.join(f'<section data-view="{k}" hidden>{v}</section>' for k, v in d['views'].items())
page = f'''<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Salaam — app preview (snapshot)</title>
<style>
body {{ margin: 0; background: #fbf7f2; }}
{d['css']}
.snap-banner {{ position: sticky; top: 0; z-index: 20; background: #1b1a1f; color: #fff; font: 500 12px/1.4 system-ui, sans-serif; padding: 8px 14px; text-align: center; }}
.snap-banner b {{ color: #f6c9b7; font-weight: 600; }}
.pub {{ min-height: calc(100vh - 34px); }}
[disabled] {{ cursor: not-allowed; }}
.lang a {{ display: inline-flex; align-items: center; justify-content: center; font: 600 12px system-ui, sans-serif; padding: 8px 10px; min-width: 40px; min-height: 36px; color: #5f5b66; text-decoration: none; }}
.lang a[aria-pressed='true'], .pub a.chip[aria-pressed='true'] {{ background: #1b1a1f; color: #fff; }}
</style>
</head>
<body>
<div class="snap-banner" role="note"><b>Снимок Salaam</b> · реальные страницы от 17.11 · события — примеры · фильтры категорий и календарь здесь не работают</div>
{sections}
<script>
(function () {{
  var views = document.querySelectorAll('section[data-view]');
  var start = 'az-home-tonight';
  function show() {{
    var id = (location.hash || '').slice(1);
    var target = document.querySelector('section[data-view="' + id + '"]') || document.querySelector('section[data-view="' + start + '"]');
    for (var i = 0; i < views.length; i++) views[i].hidden = views[i] !== target;
    document.documentElement.lang = target.getAttribute('data-view').slice(0, 2);
    window.scrollTo(0, 0);
  }}
  window.addEventListener('hashchange', show);
  // "Mixed" mood: the live app cycles moods with JavaScript; the snapshot does the same with the drawn expressions.
  var moods = ['mood-calm', 'mood-energetic', 'mood-curious'], k = 0;
  setInterval(function () {{
    k = (k + 1) % moods.length;
    var cur = document.querySelector('section[data-view]:not([hidden])');
    if (!cur || /-(calm|energetic|curious)$/.test(cur.getAttribute('data-view'))) return;
    cur.querySelectorAll('svg.alive').forEach(function (s) {{ s.classList.remove.apply(s.classList, moods); s.classList.add(moods[k]); }});
  }}, 5200);
  show();
}})();
</script>
</body>
</html>
'''
page = page.replace('<option value="5">', '<option value="5" selected>')
open('/home/claude/salaam-preview/index.html','w').write(page)
print(len(page))
