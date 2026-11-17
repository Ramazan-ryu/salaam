/** Public-app UI strings (az default, ru, en). Content text comes localized from the API. */
export const LOCALES = ['az', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const LANG_COOKIE = 'salaam_lang';

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);

const az = {
  styleCasual: 'Gündəlik',
  styleStreet: 'Küçə',
  featured: 'Seçilmiş',
  studioIntro: 'Personajını özünə uyğunlaşdır — dünyada dərhal görünəcək.',
  studioPreview: 'Personajın önizləməsi',
  studioCustomize: 'Görünüşü dəyiş',
  studioBody: 'Görünüş',
  studioLook: 'Variant',
  studioSkin: 'Dəri',
  studioHair: 'Saç',
  studioTop: 'Üst geyim',
  studioPants: 'Şalvar',
  studioSave: 'Yadda saxla',
  studioUndo: 'Geri al',
  studioReset: 'Sıfırla',
  studioSaved: 'Yadda saxlanıldı — dünyanda artıq yeni görünüşdəsən.',
  studioLocalNote: 'Hələlik bu cihazda saxlanılır (hesab sonra gələcək).',
  morning: 'Sabahınız xeyir',
  afternoon: 'Günortanız xeyir',
  evening: 'Axşamınız xeyir',
  city: 'Bakı',
  now: 'İndi',
  tonight: 'Bu axşam',
  weekend: 'Həftəsonu',
  inBakuNow: 'İndi Bakıda',
  inBakuTonight: 'Bu axşam Bakıda',
  inBakuWeekend: 'Həftəsonu Bakıda',
  seeAll: 'Hamısı',
  home: 'Əsas',
  discover: 'Kəşf et',
  verified: 'Təsdiqlənib',
  fromOrganizer: 'Təşkilatçıdan',
  free: 'Pulsuz',
  timeTbc: 'Saat dəqiqləşdirilir',
  sample: 'Nümunə məlumat · test üçün',
  sampleBadge: 'Nümunə',
  emptyLens: 'Bu vaxt üçün hələ təsdiqlənmiş tədbir yoxdur.',
  tryWeekend: 'Həftəsonuna baxın',
  apiDown: 'Məlumatı yükləmək alınmadı. Bir az sonra yenidən cəhd edin.',
  suggestPrefix: 'Boş vaxtın var?',
  itemMusic: 'Musiqi',
  itemExhibition: 'Sərgilər',
  itemWorkshop: 'Emalatxana',
  itemCinema: 'Kino',
  itemCommunity: 'İcma',
  itemsLabel: 'Nə etmək istəyirsən?',
  moodLabel: 'Əhval',
  worldHello: 'Salam! Bu gün nə kəşf edək?',
  worldHint: 'Otaqdakı əşyaya toxun — köməkçin ora gedəcək',
  showObjects: 'Əşyaları göstər',
  objWindow: 'Pəncərə · şəhər',
  objMusic: 'Qulaqlıq · musiqi',
  objExhibition: 'Tablo · sərgilər',
  objWorkshop: 'Kitablar · emalatxana',
  objCinema: 'Divan · kino',
  objCommunity: 'Çay masası · icma',
  navWorld: 'Dünyam',
  navStudio: 'Studiya',
  exploreBy: 'Maraqlara görə',
  nearCta: 'Yaxınlıqdakıları göstər',
  nearText: 'Pəncərədən şəhər görünür. Təxmini yerinə görə yaxın tədbirləri açaq?',
  close: 'Bağla',
  noneHere: 'Bu kateqoriyada bu vaxt üçün tədbir yoxdur.',
  worldFallback: '3D dünya bu cihazda açılmadı — tədbirlər aşağıdadır.',
  tileNow: 'İndi nə var?',
  tileNowSub: 'Növbəti 3 saatda',
  tileFree: 'Pulsuz və icma',
  tileFreeSub: 'Könüllülük, klublar, görüşlər',
  tileNear: 'Yaxınlıqda',
  tileNearSub: 'Təxmini yerinə görə',
  tileWeekend: 'Həftəsonu planı',
  tileWeekendSub: 'Cümə 17:00-dan bazara qədər',
  moodMixed: 'Qarışıq',
  moodCalm: 'Sakit',
  moodEnergetic: 'Enerjili',
  moodCurious: 'Maraqlı',
  suggestCalm: 'Sakit vaxt üçün:',
  suggestEnergetic: 'Enerji var?',
  suggestCurious: 'Yeni nəsə kəşf et:',
  eventsCount: 'tədbir',
  suggestOther: 'Başqa təklif',
  show: 'Göstər',
  avatarLabel: 'Sizin köməkçiniz əl yelləyir',
  nearMe: 'Yaxınlıqda',
  nearMeHint: 'Təxmini yeriniz (~2 km dəqiqliklə) yalnız bu axtarış üçün istifadə olunur və saxlanılmır.',
  locating: 'Yer təyin edilir…',
  locationDenied: 'Yer icazəsi verilmədi — bütün Bakı göstərilir.',
  radius: 'Radius',
  allCategories: 'Hamısı',
  loading: 'Yüklənir…',
  noResults: 'Bu filtrlərlə tədbir tapılmadı.',
  when: 'Nə vaxt',
  where: 'Harada',
  price: 'Qiymət',
  tickets: 'Bilet / qeydiyyat',
  directions: 'Xəritədə aç',
  addCalendar: 'Təqvimə əlavə et',
  source: 'Mənbə',
  lastVerified: 'Son yoxlama',
  cancelled: 'Ləğv edilib',
  postponed: 'Təxirə salınıb',
  trustVerified: 'Salaam redaktoru rəsmi mənbə ilə yoxlayıb.',
  trustOrganizer: 'Təşkilatçı göndərib, Salaam redaktoru yoxlayıb.',
  trustCommunity: 'İstifadəçi göndərib, Salaam redaktoru yoxlayıb.',
  unconfirmed: 'Dəqiqləşdirilməyib',
  back: '← Geri',
  notFound: 'Tədbir tapılmadı və ya artıq göstərilmir.',
  priceNotStated: 'Mənbədə göstərilməyib',
};

export type Dict = typeof az;

const ru: Dict = {
  styleCasual: 'Повседневный',
  styleStreet: 'Уличный',
  featured: 'Выбор',
  studioIntro: 'Настрой персонажа под себя — он сразу появится в твоём мире.',
  studioPreview: 'Предпросмотр персонажа',
  studioCustomize: 'Изменить внешность',
  studioBody: 'Образ',
  studioLook: 'Вариант',
  studioSkin: 'Кожа',
  studioHair: 'Волосы',
  studioTop: 'Верх',
  studioPants: 'Брюки',
  studioSave: 'Сохранить',
  studioUndo: 'Отменить',
  studioReset: 'Сбросить',
  studioSaved: 'Сохранено — в твоём мире уже новый образ.',
  studioLocalNote: 'Пока сохраняется на этом устройстве (аккаунт появится позже).',
  morning: 'Доброе утро',
  afternoon: 'Добрый день',
  evening: 'Добрый вечер',
  city: 'Баку',
  now: 'Сейчас',
  tonight: 'Сегодня вечером',
  weekend: 'Выходные',
  inBakuNow: 'Сейчас в Баку',
  inBakuTonight: 'Сегодня вечером в Баку',
  inBakuWeekend: 'Выходные в Баку',
  seeAll: 'Все',
  home: 'Главная',
  discover: 'Поиск',
  verified: 'Проверено',
  fromOrganizer: 'От организатора',
  free: 'Бесплатно',
  timeTbc: 'Время уточняется',
  sample: 'Пример данных · для теста',
  sampleBadge: 'Пример',
  emptyLens: 'На это время пока нет проверенных событий.',
  tryWeekend: 'Посмотреть выходные',
  apiDown: 'Не удалось загрузить данные. Попробуйте чуть позже.',
  suggestPrefix: 'Есть свободное время?',
  itemMusic: 'Музыка',
  itemExhibition: 'Выставки',
  itemWorkshop: 'Мастер-классы',
  itemCinema: 'Кино',
  itemCommunity: 'Сообщества',
  itemsLabel: 'Чем хочешь заняться?',
  moodLabel: 'Настроение',
  worldHello: 'Привет! Что откроем сегодня?',
  worldHint: 'Нажми на вещь в комнате — компаньон подойдёт к ней',
  showObjects: 'Показать предметы',
  objWindow: 'Окно · город',
  objMusic: 'Наушники · музыка',
  objExhibition: 'Картина · выставки',
  objWorkshop: 'Книги · мастер-классы',
  objCinema: 'Диван · кино',
  objCommunity: 'Чайный столик · сообщества',
  navWorld: 'Мой мир',
  navStudio: 'Студия',
  exploreBy: 'По интересам',
  nearCta: 'Показать, что рядом',
  nearText: 'За окном — город. Показать события рядом с вашим примерным местом?',
  close: 'Закрыть',
  noneHere: 'В этой категории на это время событий нет.',
  worldFallback: '3D-мир не открылся на этом устройстве — события ниже.',
  tileNow: 'Что сейчас?',
  tileNowSub: 'Ближайшие 3 часа',
  tileFree: 'Бесплатно и сообщества',
  tileFreeSub: 'Волонтёрство, клубы, встречи',
  tileNear: 'Рядом',
  tileNearSub: 'По примерному району',
  tileWeekend: 'План на выходные',
  tileWeekendSub: 'С пятницы 17:00 до воскресенья',
  moodMixed: 'Микс',
  moodCalm: 'Спокойно',
  moodEnergetic: 'Энергично',
  moodCurious: 'Любопытно',
  suggestCalm: 'Если хочется спокойствия:',
  suggestEnergetic: 'Есть энергия?',
  suggestCurious: 'Узнай новое:',
  eventsCount: 'событий',
  suggestOther: 'Другое',
  show: 'Показать',
  avatarLabel: 'Ваш компаньон машет рукой',
  nearMe: 'Рядом',
  nearMeHint: 'Ваше примерное местоположение (точность ~2 км) используется только для этого поиска и не сохраняется.',
  locating: 'Определяем место…',
  locationDenied: 'Доступ к геолокации не дан — показываем весь Баку.',
  radius: 'Радиус',
  allCategories: 'Все',
  loading: 'Загрузка…',
  noResults: 'С такими фильтрами событий нет.',
  when: 'Когда',
  where: 'Где',
  price: 'Цена',
  tickets: 'Билеты / регистрация',
  directions: 'Открыть на карте',
  addCalendar: 'Добавить в календарь',
  source: 'Источник',
  lastVerified: 'Последняя проверка',
  cancelled: 'Отменено',
  postponed: 'Перенесено',
  trustVerified: 'Редактор Salaam сверил с официальным источником.',
  trustOrganizer: 'Прислал организатор, проверил редактор Salaam.',
  trustCommunity: 'Прислал пользователь, проверил редактор Salaam.',
  unconfirmed: 'Не подтверждено',
  back: '← Назад',
  notFound: 'Событие не найдено или больше не показывается.',
  priceNotStated: 'Не указана в источнике',
};

const en: Dict = {
  styleCasual: 'Casual',
  styleStreet: 'Street',
  featured: 'Featured',
  studioIntro: 'Make your character yours — it appears in your world right away.',
  studioPreview: 'Character preview',
  studioCustomize: 'Change your look',
  studioBody: 'Look',
  studioLook: 'Option',
  studioSkin: 'Skin',
  studioHair: 'Hair',
  studioTop: 'Top',
  studioPants: 'Trousers',
  studioSave: 'Save',
  studioUndo: 'Undo',
  studioReset: 'Reset',
  studioSaved: 'Saved — your world already shows the new look.',
  studioLocalNote: 'Saved on this device for now (accounts come later).',
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  city: 'Baku',
  now: 'Now',
  tonight: 'Tonight',
  weekend: 'Weekend',
  inBakuNow: 'Happening now in Baku',
  inBakuTonight: 'Tonight in Baku',
  inBakuWeekend: 'This weekend in Baku',
  seeAll: 'See all',
  home: 'Home',
  discover: 'Discover',
  verified: 'Verified',
  fromOrganizer: 'From organizer',
  free: 'Free',
  timeTbc: 'Time to be confirmed',
  sample: 'Sample data · for testing',
  sampleBadge: 'Sample',
  emptyLens: 'No verified events for this time yet.',
  tryWeekend: 'Check the weekend',
  apiDown: "Couldn't load data. Please try again shortly.",
  suggestPrefix: 'Got some free time?',
  itemMusic: 'Music',
  itemExhibition: 'Exhibitions',
  itemWorkshop: 'Workshops',
  itemCinema: 'Cinema',
  itemCommunity: 'Community',
  itemsLabel: 'What do you feel like doing?',
  moodLabel: 'Mood',
  worldHello: "Hi! What shall we discover today?",
  worldHint: 'Tap an object in the room — your companion walks over',
  showObjects: 'Show objects',
  objWindow: 'Window · city',
  objMusic: 'Headphones · music',
  objExhibition: 'Painting · exhibitions',
  objWorkshop: 'Books · workshops',
  objCinema: 'Sofa · cinema',
  objCommunity: 'Tea table · community',
  navWorld: 'My world',
  navStudio: 'Studio',
  exploreBy: 'By interest',
  nearCta: "Show what's near me",
  nearText: 'The city is right outside. Show events near your approximate area?',
  close: 'Close',
  noneHere: 'Nothing in this category for this time yet.',
  worldFallback: "The 3D world didn't open on this device — events are below.",
  tileNow: "What's on now?",
  tileNowSub: 'The next 3 hours',
  tileFree: 'Free & community',
  tileFreeSub: 'Volunteering, clubs, meetups',
  tileNear: 'Near me',
  tileNearSub: 'Around your approximate area',
  tileWeekend: 'Weekend plan',
  tileWeekendSub: 'Friday 17:00 to Sunday',
  moodMixed: 'Mixed',
  moodCalm: 'Calm',
  moodEnergetic: 'Energetic',
  moodCurious: 'Curious',
  suggestCalm: 'Take it slow:',
  suggestEnergetic: 'Feeling energetic?',
  suggestCurious: 'Discover something new:',
  eventsCount: 'events',
  suggestOther: 'Something else',
  show: 'Show me',
  avatarLabel: 'Your companion is waving',
  nearMe: 'Near me',
  nearMeHint: 'Your approximate area (~2 km) is used only for this search and is not stored.',
  locating: 'Finding your area…',
  locationDenied: 'Location not allowed — showing all of Baku.',
  radius: 'Radius',
  allCategories: 'All',
  loading: 'Loading…',
  noResults: 'No events match these filters.',
  when: 'When',
  where: 'Where',
  price: 'Price',
  tickets: 'Tickets / registration',
  directions: 'Open in map',
  addCalendar: 'Add to calendar',
  source: 'Source',
  lastVerified: 'Last checked',
  cancelled: 'Cancelled',
  postponed: 'Postponed',
  trustVerified: 'A Salaam editor checked this against an official source.',
  trustOrganizer: 'Sent by the organizer, checked by a Salaam editor.',
  trustCommunity: 'Sent by a user, checked by a Salaam editor.',
  unconfirmed: 'Not confirmed',
  back: '← Back',
  notFound: 'Event not found or no longer listed.',
  priceNotStated: 'Not stated by the source',
};

export const DICTS: Record<Locale, Dict> = { az, ru, en };

const INTL: Record<Locale, string> = { az: 'az-Latn-AZ', ru: 'ru-RU', en: 'en-GB' };

/** Azerbaijani names are formatted by hand: several browsers ship without az date data. */
const AZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
const AZ_WD_SHORT = ['B.', 'B.e.', 'Ç.a.', 'Ç.', 'C.a.', 'C.', 'Ş.']; // Sun..Sat
const AZ_WD_LONG = ['bazar', 'bazar ertəsi', 'çərşənbə axşamı', 'çərşənbə', 'cümə axşamı', 'cümə', 'şənbə'];

function bakuParts(d: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Baku', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day: Number(get('day')), month: Number(get('month')) - 1, wd, hh: get('hour').replace(/^24$/, '00'), mm: get('minute') };
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase('az') + s.slice(1);

function dayLabel(d: Date, locale: Locale, long = false) {
  if (locale === 'az') {
    const p = bakuParts(d);
    return long ? `${cap(AZ_WD_LONG[p.wd]!)}, ${p.day} ${AZ_MONTHS[p.month]}` : `${AZ_WD_SHORT[p.wd]} ${p.day} ${AZ_MONTHS[p.month]}`;
  }
  const s = new Intl.DateTimeFormat(INTL[locale], { timeZone: 'Asia/Baku', weekday: long ? 'long' : 'short', day: 'numeric', month: 'long' }).format(d);
  return cap(s);
}

function timeLabel(d: Date) {
  const p = bakuParts(d);
  return `${p.hh}:${p.mm}`;
}

export function fmtWhen(iso: string, locale: Locale, opts: { timeUnknown?: boolean; withDay?: boolean } = {}) {
  const d = new Date(iso);
  if (opts.timeUnknown) return dayLabel(d, locale);
  return opts.withDay === false ? timeLabel(d) : `${dayLabel(d, locale)}, ${timeLabel(d)}`;
}

export function fmtToday(locale: Locale, now = new Date()) {
  return dayLabel(now, locale, true);
}

export function greeting(locale: Locale, now = new Date()) {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Baku', hour: '2-digit', hour12: false }).format(now));
  const t = DICTS[locale];
  return h >= 5 && h < 12 ? t.morning : h >= 12 && h < 17 ? t.afternoon : t.evening;
}

export function fmtKm(km: number, locale: Locale) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  const v = km.toFixed(1).replace(/\.0$/, '');
  return `${locale === 'en' ? v : v.replace('.', ',')} km`;
}

const MON_SHORT: Record<Locale, string[]> = {
  az: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek'],
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** Day number + short month in Baku time, for date badges. */
export function dayBadge(iso: string, locale: Locale) {
  const p = bakuParts(new Date(iso));
  return { day: p.day, mon: MON_SHORT[locale][p.month]! };
}
