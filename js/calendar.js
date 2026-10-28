UI.header('days');
const params = new URLSearchParams(location.search);
let Y = parseInt(params.get('year'), 10);
if (!BG.YEARS.includes(Y)) Y = BG.YEARS.includes(new Date().getFullYear()) ? new Date().getFullYear() : BG.YEARS[0];
const data = BG.year(Y);
document.title = 'Почивни дни и официални празници ' + Y;
document.getElementById('title').textContent = 'Почивни дни и официални празници ' + Y;
document.getElementById('tabs').innerHTML = BG.YEARS.map((y) => `<a href="?year=${y}"${y === Y ? ' class="active"' : ''}>${y}</a>`).join('');

const offKeys = Object.keys(data.off).sort();
const workdayOff = offKeys.filter((k) => !BG.isWeekend(new Date(k + 'T00:00:00')));
document.getElementById('summary').textContent =
  `През ${Y} г. има ${workdayOff.length} официални почивни дни в делнични дни. Великден е на ${BG.fmt(data.easter)}.`;

document.getElementById('holidays').innerHTML = offKeys.map((k) => {
  const d = new Date(k + 'T00:00:00');
  return `<li><span><b>${BG.fmt(d)}</b> <span class="muted">${BG.WEEKDAYS[d.getDay()]}</span></span><span style="text-align:right">${data.off[k].name}</span></li>`;
}).join('');

const ideaKeys = new Set();
document.getElementById('ideas').innerHTML = data.ideas.length ? data.ideas.map((i) => {
  i.leave.forEach((d) => ideaKeys.add(BG.key(d)));
  const lv = i.leave;
  const range = lv.length === 1 ? BG.fmt(lv[0]) : BG.fmt(lv[0]) + ' – ' + BG.fmt(lv[lv.length - 1]);
  return `<div class="idea-item"><div class="num">${i.total}<small>дни почивка</small></div>
    <div><b>${UI.plural(lv.length, 'ден отпуск', 'дни отпуск')}</b>: ${range}<br><span class="muted">почивка от ${BG.fmt(i.from)} до ${BG.fmt(i.to)}</span></div></div>`;
}).join('') : '<p class="muted">Няма предложения.</p>';

const school = document.getElementById('school');
if (data.schoolList.length) {
  school.innerHTML = data.schoolList.map(([[m1, d1], [m2, d2], name]) => {
    const a = new Date(Y, m1 - 1, d1), b = new Date(Y, m2 - 1, d2);
    return `<li><span><b>${a.getTime() === b.getTime() ? BG.fmt(a) : BG.fmt(a) + ' – ' + BG.fmt(b)}</b></span><span style="text-align:right">${name}</span></li>`;
  }).join('');
} else {
  school.innerHTML = '<li class="muted">Графикът на МОН за ' + Y + ' г. още не е обявен.</li>';
}

const today = BG.key(new Date());
const WD = ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'];
document.getElementById('months').innerHTML = BG.MONTHS.map((name, m) => {
  const first = new Date(Y, m, 1);
  const lead = (first.getDay() + 6) % 7;
  const n = new Date(Y, m + 1, 0).getDate();
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<td class="e"></td>';
  for (let day = 1; day <= n; day++) {
    const dt = new Date(Y, m, day), k = BG.key(dt);
    const off = data.off[k];
    const cls = [];
    if (off) cls.push(off.kind === 'easter' && dt.getTime() === data.easter.getTime() ? 'easter' : 'off');
    else if (ideaKeys.has(k)) cls.push('idea');
    else if (data.school[k] && !BG.isWeekend(dt)) cls.push('school');
    else if (BG.isWeekend(dt)) cls.push('we');
    if (k === today) cls.push('today');
    const title = off ? off.name : ideaKeys.has(k) ? 'Предложение за отпуск' : data.school[k] || '';
    cells += `<td class="${cls.join(' ')}"${title ? ` title="${title}"` : ''}>${day}</td>`;
    if ((lead + day) % 7 === 0 && day < n) cells += '</tr><tr>';
  }
  return `<div class="month"><h3>${name} ${Y}</h3><table><thead><tr>${WD.map((w, i) => `<th${i > 4 ? ' class="we"' : ''}>${w}</th>`).join('')}</tr></thead><tbody><tr>${cells}</tr></tbody></table></div>`;
}).join('');
UI.footer();
