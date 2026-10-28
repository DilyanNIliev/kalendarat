UI.header('home');
document.getElementById('hero-pumpkin').innerHTML = UI.PUMPKIN;
document.getElementById('search-box').innerHTML = UI.searchForm('');

const cd = document.getElementById('countdown');
const pad = BG.pad;

function tick() {
  const now = new Date();
  let y = now.getFullYear();
  let target = new Date(y, 9, 31, 0, 0, 0);
  const endOfDay = new Date(y, 10, 1, 0, 0, 0);
  if (now >= target && now < endOfDay) {
    cd.innerHTML = '<div class="itsday">Честит Хелоуин! Сладки или гадни?</div>';
    return;
  }
  if (now >= endOfDay) target = new Date(y + 1, 9, 31, 0, 0, 0);
  const s = Math.floor((target - now) / 1000);
  const parts = [[Math.floor(s / 86400), 'дни'], [Math.floor(s / 3600) % 24, 'часа'], [Math.floor(s / 60) % 60, 'минути'], [s % 60, 'секунди']];
  cd.innerHTML = parts.map(([n, l]) => `<div class="unit"><b>${l === 'дни' ? n : pad(n)}</b><span>${l}</span></div>`).join('');
  document.getElementById('hero-sub').textContent = 'До 31 октомври ' + target.getFullYear() + ' – нощта, в която духовете излизат на разходка…';
}
tick();
setInterval(tick, 1000);

// Днес
const now = new Date();
const todayNames = ND.onDate(now);
const tomorrow = BG.addDays(now, 1);
const tmr = ND.onDate(tomorrow);
const nxt = BG.nextOfficial(now);
const holidayToday = BG.year(now.getFullYear()).off[BG.key(now)];
document.getElementById('today').innerHTML = `
  <h2>Днес</h2>
  <div class="big-date">${now.getDate()} ${BG.MONTHS_GEN[now.getMonth()]}</div>
  <div class="muted">${BG.WEEKDAYS[now.getDay()]}, ${now.getFullYear()}</div>
  ${holidayToday ? `<p><span class="pill">${holidayToday.name}</span></p>` : ''}
  ${nxt ? `<p>Следващ почивен ден: <b>${nxt.name}</b> – ${BG.fmt(nxt.date)} (${UI.daysAway(Math.round((nxt.date - ND.startOfDay(now)) / 864e5))})</p>` : ''}`;

const fmtND = (list) => list.map((x) => `<b>${x.title}</b>: ${x.names.slice(0, 8).join(', ')}`).join('<br>');
document.getElementById('today-names').innerHTML =
  `<b>Имен ден днес:</b> ${todayNames.length ? fmtND(todayNames) : 'няма'}<br><b>Утре:</b> ${tmr.length ? fmtND(tmr) : 'няма'}`;

// Предстоящи почивни дни
const up = [];
let d = ND.startOfDay(now);
for (let i = 0; i < 400 && up.length < 6; i++, d = BG.addDays(d, 1)) {
  const h = BG.year(d.getFullYear()).off[BG.key(d)];
  if (h && !BG.isWeekend(d)) up.push({ d, h });
}
document.getElementById('upcoming').innerHTML = up.map(({ d, h }) =>
  `<li><span><b>${BG.fmt(d)}</b> <span class="muted">${BG.WEEKDAYS[d.getDay()]}</span><br>${h.name}</span><span class="pill">${UI.daysAway(Math.round((d - ND.startOfDay(now)) / 864e5))}</span></li>`).join('');

document.getElementById('year-links').innerHTML = BG.YEARS.map((y) => `<a href="pochivni-dni.html?year=${y}">${y}</a>`).join('');
UI.footer();
