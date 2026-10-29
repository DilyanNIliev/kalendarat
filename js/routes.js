// Адреси (чисти URL), групи имени дни и помощни функции за връзки
(function () {
  const TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a', ь: 'y', ю: 'yu', я: 'ya' };
  const slug = (s) => s.toLowerCase().split('').map((c) => (TR[c] !== undefined ? TR[c] : c)).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // Всеки празник с имени дни е отделна страница (обединява Иван, Ивана, Йоан…)
  const GROUPS = [];
  ND.FIXED.forEach(([m, d, title, names]) => GROUPS.push({ slug: slug(title), title, names, movable: false, month: m, day: d }));
  ND.MOVABLE.forEach(([off, title, names]) => GROUPS.push({ slug: slug(title), title, names, movable: true, off }));
  const groupBySlug = (s) => GROUPS.find((g) => g.slug === s);
  // За имена, които празнуват на няколко дати, основната е първа
  const PRIMARY = { Мария: 'golyama-bogoroditsa', Мариана: 'golyama-bogoroditsa', Марияна: 'golyama-bogoroditsa', Мариела: 'golyama-bogoroditsa', Иван: 'ivanovden', Ивана: 'ivanovden', Ивелин: 'ivanovden', Йоан: 'ivanovden', Васил: 'vasilyovden', Григор: 'trimata-svetiteli', Елена: 'sv-konstantin-i-elena', Ангел: 'arhangelov-den', Петко: 'petrovden', Пенка: 'petrovden', Пенко: 'petrovden', Ана: 'sv-anna', Анна: 'sv-anna' };
  const groupsFor = (name) => {
    const l = GROUPS.filter((g) => g.names.some((n) => n.toLowerCase() === name.toLowerCase()));
    const pk = PRIMARY[name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()];
    return l.sort((a, b) => (b.slug === pk) - (a.slug === pk));
  };
  const groupDate = (g, y) => (g.movable ? BG.addDays(BG.easter(y), g.off) : new Date(y, g.month - 1, g.day));

  const OCC_SLUG = { imenden: 'imen-den', rozhden: 'rozhden-den', koleda: 'koleda', novagodina: 'nova-godina', mart3: '3-mart', velikden: 'velikden', martenica: 'baba-marta', nacionalen: 'natsionalni-praznitsi' };
  const INFO = { 'za-nas': 'За нас', kontakt: 'Контакт', 'politika-za-poveritelnost': 'Политика за поверителност', biskvitki: 'Бисквитки' };
  const DEFAULT_YEAR = 2027;

  // относителен път до корена на сайта (подава се от страницата), за да работи и в подпапка, и на домейн
  const P = ((window.__PAGE || {}).root) || '';
  const R0 = {
    home: () => '',
    days: (y) => `pochivni-dni-${y || DEFAULT_YEAR}/`,
    holidays: () => 'praznici/',
    church: () => 'cherkoven-kalendar/',
    names: () => 'imeni-dni/',
    group: (s, hash) => `imen-den/${s}/${hash ? '#' + hash : ''}`,
    holiday: (id) => `praznik/${id}/`,
    vac: () => 'vakancii/',
    wishes: (occ) => (occ && OCC_SLUG[occ] ? `pozhelaniya/${OCC_SLUG[occ]}/` : 'pozhelaniya/'),
    season: () => 'otbroyavane/',
    info: (k) => `${k}/`,
  };
  const R = {};
  Object.keys(R0).forEach((k) => { R[k] = (...a) => { const v = R0[k](...a); return v === '' ? (P || './') : P + v; }; });
  // Връзка за име: една група → директно към страницата, повече → към списъка с търсене
  const nameHref = (name) => {
    const g = groupsFor(name);
    if (g.length) return R.group(g[0].slug, 'ime-' + slug(name));
    return R.names() + '?q=' + encodeURIComponent(name);
  };

  window.RT = { slug, GROUPS, groupBySlug, groupsFor, groupDate, OCC_SLUG, INFO, DEFAULT_YEAR, R, nameHref };
})();
