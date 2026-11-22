/* Arabic/English switcher: every element with data-ar holds its Arabic text; English is the original content. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let lang = 'en';
try { lang = localStorage.getItem('lang') || 'en'; } catch (e) {}

function translate(root = document) {
  $$('[data-ar]', root).forEach(el => {
    if (!el.dataset.en) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === 'ar' ? el.dataset.ar : el.dataset.en;
  });
}
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  $('#lang').textContent = l === 'ar' ? 'English' : 'العربية';
  translate();
  const open = $('#dlg[open] #dlgBody');
  if (open) translate(open);
  try { localStorage.setItem('lang', l); } catch (e) {}
}
$('#lang').addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));

/* Mobile menu */
const burger = $('#burger'), links = $('#links');
burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('#links a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

/* Highlight current section in the nav */
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      $$('#links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* Project detail dialog */
const dlg = $('#dlg'), body = $('#dlgBody');
function openProject(id) {
  body.innerHTML = '';
  body.append($('#' + id).content.cloneNode(true));
  translate(body);
  typeof dlg.showModal === 'function' ? dlg.showModal() : dlg.setAttribute('open', '');
}
$$('[data-open]').forEach(card => {
  card.addEventListener('click', () => openProject(card.dataset.open));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.dataset.open); } });
});
$('#close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

$('#yr').textContent = new Date().getFullYear();
setLang(lang);
