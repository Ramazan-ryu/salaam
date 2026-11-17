# Промпты для Higgsfield / Midjourney — арт Salaam

Как пользоваться: копируйте промпт целиком (на английском, так модели понимают лучше). Генерируйте 4 варианта,
выбирайте лучший, при необходимости делайте вариации (Vary / Remix). Скачивайте в максимальном качестве и
присылайте в чат как есть. Я сам переименую файлы, сожму их в WebP, впишу в `design/ASSET_MANIFEST.json`
и встрою в приложение.

Правила, чтобы картинки можно было использовать:
- **Без чужих персонажей и логотипов.** Не пишите в промпте имена студий, фильмов, брендов.
- **Без реальных людей.**
- **Без текста на картинке.** Текст добавляет приложение на трёх языках.
- **Условия сервиса.** Проверьте, что ваш тариф Higgsfield или Midjourney разрешает коммерческое использование. Это решение за вами.

Общий «стиль Salaam». Добавляйте этот блок в конец каждого промпта:

```
stylized 3D animated feature film look, soft clay-like materials, warm cinematic lighting, gentle rim light,
rich but harmonious colors (warm terracotta, deep teal, honey amber, dusk violet), soft depth of field,
high detail, cozy, optimistic, no text, no logos, no watermark
```

---

## 1. Персонаж-компаньон (самое важное)

**1a. Лист персонажа:** один персонаж, три ракурса.
```
character turnaround sheet of one original young adult city companion character from Baku, full body,
front view, three-quarter view and side view on a plain light warm-grey background, friendly expressive face
with large warm eyes, natural proportions slightly stylized (head a bit larger), dark wavy hair, light olive skin,
casual modern outfit: oversized terracotta knit sweater, dark teal wide trousers, white sneakers, small
crossbody bag, standing relaxed pose, consistent design across all views, [STYLE]
--ar 16:9
```
Нужно: 1 лучший лист. Затем ещё 1–2 варианта одежды: замените строку outfit, лицо оставьте тем же. В Midjourney для этого есть `--cref` (ссылка на первую картинку).

**1b. Эмоции.** Нужны одна картинка с 6 лицами или 6 отдельных.
```
expression sheet of the same character (reference image), head and shoulders, six expressions in a 3x2 grid:
calm smile, excited laugh, curious raised eyebrow, thinking with hand on chin, surprised, relaxed with closed eyes,
plain light background, [STYLE] --ar 3:2
```

**1c. Персонаж на прозрачном фоне** для 2.5D-режима.
```
full body of the same character (reference image) standing, waving hello, isolated on pure white background,
soft contact shadow, [STYLE] --ar 2:3
```
Сделайте ещё 4 позы: идёт, сидит на диване с попкорном, держит кружку у окна, празднует с поднятыми руками.

## 2. Моя комната (My World)

```
isometric cutaway diorama of a cozy small apartment room in Baku at evening, two walls and floor visible,
large window with view of the Baku city lights and the Caspian sea, warm string lights along the walls,
wooden floor with a woven carpet with Azerbaijani pattern, sofa with pillows, reading armchair, desk with
monitor and desk lamp, record player and vinyl shelf, plants, small gallery of framed art, tea set with armudu
glasses on a low table, soft clay 3D style, isometric orthographic view, centered on plain soft background,
[STYLE] --ar 1:1
```
Сделайте три варианта: день, вечер, ночь. Меняйте слова `at evening` на `at sunny day` и `at night`.
Это референс для 3D-комнаты, по нему я подгоню свет, цвета и предметы. Если получится очень хорошо,
используем и как 2.5D-фон.

## 3. Вид из окна, мой город (My City)

```
view of Baku city skyline from an apartment window height, evening golden hour, three flame-shaped glass towers
on the hill, old city walls, boulevard and Caspian sea, painterly stylized, soft atmospheric haze, no people
close up, [STYLE] --ar 16:10
```
Три варианта: day, evening, night. Ночью окна домов горят, небо глубокое сине-фиолетовое.

```
stylized miniature 3D night city of Baku seen from above at an angle, glowing streets, tiny cars with light
trails, illuminated boulevard by the sea, warm windows, magical but realistic layout, tilt-shift, [STYLE] --ar 9:16
```
Это для будущего экрана «Мой город». Реальная карта при этом останется отдельно.

## 4. Обложки событий (My Experiences)

Нужно по 3 варианта на каждую категорию, формат 16:9. Людей показывайте без узнаваемых лиц: со спины или силуэтами.

| Категория | Промпт (+ [STYLE] и `--ar 16:9`) |
|---|---|
| Музыка | `intimate live music evening in a small Baku jazz club, warm stage lights, musicians silhouettes, audience from behind` |
| Выставки | `contemporary art gallery interior with large colorful paintings on white walls, soft spotlights, one visitor from behind` |
| Мастер-классы | `hands shaping clay on a pottery wheel in a warm workshop, tools and ceramics on wooden table, close-up` |
| Кино | `open-air cinema in a courtyard at night, string lights, deck chairs, glowing screen, people from behind` |
| Сообщество | `friends having a picnic in a green Baku park by the sea, sunset, blankets, tea, viewed from a distance` |
| Рядом | `cozy street corner in Baku old town at dusk, stone buildings, warm cafe light, cobblestones` |

## 5. Если хотите настоящий 3D-персонаж бесплатно

Это реальный путь от картинки к живому 3D-персонажу:
1. Сделайте картинку 1c, персонаж в полный рост на белом фоне, лучше в позе «T» или «A». Для этого добавьте в промпт `T-pose, arms out`.
2. Загрузите её в **Tripo3D** или **Meshy**. Оба сервиса делают из картинки 3D-модель и дают бесплатные кредиты. Скачайте GLB или FBX.
3. Загрузите модель в **Mixamo** (бесплатно, нужен аккаунт Adobe). Он сам поставит скелет и даст анимации Idle, Walking, Waving, Sitting, Victory.
4. Пришлите мне файлы. Я подключу их вместо нынешних угловатых персонажей: код уже готов. Ещё я сделаю перекраску одежды и смену образов в Студии.

Аккаунты и условия этих сервисов принимаете вы. Я не регистрируюсь от вашего имени.
