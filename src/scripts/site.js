// Общий скрипт: меню, город, заявка, фильтры, шкала срока, галерея.
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

// Меню на телефоне
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});

// Город
const citySel = document.getElementById('city-select');
const savedCity = store.get('city');
if (citySel && savedCity && [...citySel.options].some((o) => o.value === savedCity)) citySel.value = savedCity;
citySel?.addEventListener('change', () => {
  store.set('city', citySel.value);
  document.dispatchEvent(new CustomEvent('citychange', { detail: citySel.value }));
});

// Каталог: фильтр по программе и городу
document.querySelectorAll('[data-catalog]').forEach((cat) => {
  const tabs = cat.querySelectorAll('[data-filter]');
  const cards = cat.querySelectorAll('[data-programs]');
  const empty = cat.querySelector('[data-empty]');
  const cityNote = cat.querySelector('[data-city-note]');
  const useCity = cat.hasAttribute('data-use-city');
  let prog = cat.dataset.initial || 'all';
  const apply = () => {
    const city = useCity ? (citySel?.value || 'all') : 'all';
    let shown = 0;
    cards.forEach((c) => {
      const ok = (prog === 'all' || c.dataset.programs.split(' ').includes(prog)) && (city === 'all' || c.dataset.city === city);
      c.hidden = !ok;
      if (ok) shown++;
    });
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.filter === prog)));
    if (empty) empty.hidden = shown > 0;
    if (cityNote) cityNote.textContent = city === 'all' ? 'Все города' : city;
  };
  tabs.forEach((t) => t.addEventListener('click', () => { prog = t.dataset.filter; apply(); }));
  document.addEventListener('citychange', apply);
  document.addEventListener('pickprogram', (e) => { prog = e.detail; apply(); });
  cat.querySelector('[data-show-all-cities]')?.addEventListener('click', () => {
    if (citySel) { citySel.value = 'all'; store.set('city', 'all'); }
    apply();
  });
  apply();
});

// Подбор на первом экране
document.querySelectorAll('[data-picker]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const prog = form.querySelector('input[name=prog]:checked')?.value || 'all';
    const city = form.querySelector('select[name=city]')?.value;
    if (city && citySel) { citySel.value = city; store.set('city', city); document.dispatchEvent(new CustomEvent('citychange', { detail: city })); }
    document.dispatchEvent(new CustomEvent('pickprogram', { detail: prog }));
    document.getElementById('park')?.scrollIntoView();
  });
});

// Форма заявки (пробная)
document.querySelectorAll('[data-lead-form]').forEach((f) => {
  const service = f.querySelector('[data-service]');
  const dates = f.querySelector('[data-dates]');
  const sync = () => { if (dates) dates.hidden = service.value !== 'rent'; };
  service?.addEventListener('change', sync);
  sync();
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    f.querySelector('.lf__done').hidden = false;
    f.querySelector('[type=submit]').disabled = true;
  });
});

// Окно заявки
const dlg = document.getElementById('lead-dialog');
document.querySelectorAll('[data-open-lead]').forEach((b) => b.addEventListener('click', () => {
  const f = dlg.querySelector('form');
  if (b.dataset.service) { f.service.value = b.dataset.service; f.service.dispatchEvent(new Event('change')); }
  if (b.dataset.car !== undefined) f.car.value = b.dataset.car;
  dlg.showModal();
}));
dlg?.querySelector('[data-close-lead]')?.addEventListener('click', () => dlg.close());
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

// Шкала срока
const fmt = (n) => n.toLocaleString('ru-RU').replace(/[\u202f\u00a0]/g, '\u00a0') + '\u00a0₽';
document.querySelectorAll('[data-scale]').forEach((s) => {
  const steps = s.querySelectorAll('[data-step]');
  const out = s.querySelector('[data-scale-price]');
  const month = s.querySelector('[data-scale-month]');
  const note = s.querySelector('[data-scale-note]');
  const pick = (btn) => {
    steps.forEach((b) => b.setAttribute('aria-checked', String(b === btn)));
    out.textContent = fmt(+btn.dataset.price);
    if (month) month.textContent = btn.dataset.month ? `${fmt(+btn.dataset.month)} в месяц` : '';
    if (note) note.textContent = btn.dataset.note || '';
  };
  steps.forEach((b, i) => {
    b.addEventListener('click', () => pick(b));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = steps[(i + d + steps.length) % steps.length];
      n.focus(); pick(n);
    });
  });
});

// Галерея
document.querySelectorAll('[data-gallery]').forEach((g) => {
  const main = g.querySelector('[data-main]');
  g.querySelectorAll('[data-thumb]').forEach((t) => t.addEventListener('click', () => {
    main.src = t.dataset.src;
    g.querySelectorAll('[data-thumb]').forEach((x) => x.setAttribute('aria-current', String(x === t)));
  }));
});
