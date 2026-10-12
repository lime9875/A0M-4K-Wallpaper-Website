/* ===== A0M Vault — app logic ===== */

/* ---------- Data ----------
   Images are Unsplash photo IDs. Thumbnails load at 900px; downloads fetch 3840px.
   cats: uhd | minimal | cyber | cinematic */
const IMG = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${w > 2000 ? 85 : 70}`;
const WALLPAPERS = [
  { id:'photo-1506905925346-21bda4d32df4', en:'Alpine Ridge',    ar:'قمم الألب',          cats:['uhd','cinematic'], hot:true },
  { id:'photo-1470071459604-3b5ec3a7fe05', en:'Misty Forest',    ar:'غابة ضبابية',        cats:['cinematic','minimal'] },
  { id:'photo-1519681393784-d120267933ba', en:'Starlit Peaks',   ar:'قمم تحت النجوم',     cats:['uhd','cinematic'], hot:true },
  { id:'photo-1501785888041-af3ef285b470', en:'Still Lake',      ar:'بحيرة هادئة',        cats:['minimal','uhd'] },
  { id:'photo-1518837695005-2083093ee35b', en:'Ocean Curl',      ar:'موجة المحيط',        cats:['cinematic','uhd'] },
  { id:'photo-1469474968028-56623f02e42e', en:'Golden Valley',   ar:'الوادي الذهبي',      cats:['cinematic','uhd'] },
  { id:'photo-1500530855697-b586d89ba3ee', en:'Fog Layers',      ar:'طبقات الضباب',       cats:['minimal','cinematic'] },
  { id:'photo-1493246507139-91e8fad9978e', en:'Mountain Mirror', ar:'مرآة الجبل',         cats:['minimal','uhd'] },
  { id:'photo-1550684848-fac1c5b4e853',    en:'Soft Gradient',   ar:'تدرج ناعم',          cats:['minimal','cinematic'] },
  { id:'photo-1557672172-298e090bd0f1',    en:'Liquid Paint',    ar:'طلاء سائل',          cats:['cinematic','minimal'], hot:true },
  { id:'photo-1541701494587-cb58502866ab', en:'Color Flow',      ar:'تدفق الألوان',       cats:['cinematic','cyber'] },
  { id:'photo-1550745165-9bc0b252726f',    en:'Retro Console',   ar:'جهاز ريترو',         cats:['cyber'] },
  { id:'photo-1550751827-4bd374c3f58b',    en:'Neon Circuit',    ar:'دارة نيون',          cats:['cyber','uhd'], hot:true },
  { id:'photo-1518770660439-4636190af475', en:'Silicon Core',    ar:'قلب السيليكون',      cats:['cyber','uhd'] },
  { id:'photo-1542751371-adc38448a05e',    en:'Gamer Glow',      ar:'وهج اللاعبين',       cats:['cyber'] },
  { id:'photo-1480714378408-67cf0d13bc1b', en:'City After Dark', ar:'المدينة ليلًا',      cats:['cyber','cinematic'] }
];

const CATEGORIES = {
  all:       { en:'All',                           ar:'الكل' },
  uhd:       { en:'Ultra HD 4K',                   ar:'فائق الدقة 4K' },
  minimal:   { en:'Modern & Minimalist',           ar:'عصري وبسيط' },
  cyber:     { en:'Youthful Cyberpunk / Streetwear',ar:'شبابي وسايبربانك' },
  cinematic: { en:'Cinematic & Abstract',          ar:'سينمائي وفن تجريدي' }
};

/* ---------- UI strings ---------- */
const I18N = {
  en:{ heroTitle:'Your screen, reimagined.', heroSub:'A curated vault of 4K desktop wallpapers. Preview instantly, download in full resolution.',
       search:'Search wallpapers', trending:'Trending now', browse:'Browse the vault', empty:'No wallpapers match. Try another word or category.',
       download:'Download 4K', footTag:'Crafted wallpapers for people who care about their desktop.', wa:'Chat on WhatsApp',
       hot:'Trending', saving:'Preparing your download…', saved:'Download started', fallback:'Opened the image in a new tab. Save it from there.', lang:'AR' },
  ar:{ heroTitle:'شاشتك، بحلّة جديدة.', heroSub:'مجموعة منتقاة من خلفيات 4K لسطح المكتب. معاينة فورية وتحميل بأعلى دقة.',
       search:'ابحث عن خلفية', trending:'الأكثر رواجًا', browse:'تصفّح المجموعة', empty:'لا توجد نتائج. جرّب كلمة أو تصنيفًا آخر.',
       download:'تحميل 4K', footTag:'خلفيات مصممة بعناية لمن يهتم بسطح مكتبه.', wa:'تواصل عبر واتساب',
       hot:'رائج', saving:'جارٍ تجهيز التحميل…', saved:'بدأ التحميل', fallback:'فُتحت الصورة في تبويب جديد. احفظها من هناك.', lang:'EN' }
};

/* ---------- State & helpers ---------- */
const $ = id => document.getElementById(id);
const store = {
  get:(k,d)=>{ try{ return localStorage.getItem(k)||d }catch{ return d } },
  set:(k,v)=>{ try{ localStorage.setItem(k,v) }catch{} }
};
const state = { lang:store.get('a0m-lang','en'), theme:store.get('a0m-theme','dark'), cat:'all', q:'' };
const t = k => I18N[state.lang][k];
const downDownload = null; // (placeholder removed)

/* ---------- Rendering ---------- */
const DL_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>';

function cardHTML(w, i){
  const title = w[state.lang];
  return `<div class="card" role="button" tabindex="0" data-i="${i}" aria-label="${title}">
    <img src="${IMG(w.id, 900)}" alt="${title}" loading="lazy" onerror="this.closest('.card').classList.add('broken')">
    <span class="badge ${w.hot?'hot':''}">${w.hot ? t('hot') : '4K'}</span>
    <button class="dlbtn" data-dl="${i}" aria-label="${t('download')}" type="button">${DL_ICON}</button>
    <span class="cap">${title}<small>${CATEGORIES[w.cats[0]][state.lang]}</small></span>
  </div>`;
}

function renderFilters(){
  $('filters').innerHTML = Object.keys(CATEGORIES).map(k =>
    `<button class="chip ${k===state.cat?'active':''}" data-cat="${k}">${CATEGORIES[k][state.lang]}</button>`).join('');
}

function renderGrid(){
  const q = state.q.trim().toLowerCase();
  const list = WALLPAPERS.map((w,i)=>[w,i]).filter(([w]) =>
    (state.cat==='all' || w.cats.includes(state.cat)) &&
    (!q || (w.en+' '+w.ar+' '+w.cats.map(c=>CATEGORIES[c].en+' '+CATEGORIES[c].ar).join(' ')).toLowerCase().includes(q)));
  $('grid').innerHTML = list.map(([w,i]) => cardHTML(w,i)).join('');
  $('empty').hidden = list.length > 0;
}

function renderTrending(){
  $('trending').innerHTML = WALLPAPERS.map((w,i)=>[w,i]).filter(([w])=>w.hot).map(([w,i])=>cardHTML(w,i)).join('');
}

/* ---------- Theme ---------- */
function applyTheme(){
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name=theme-color]').content = state.theme==='dark' ? '#05060a' : '#f5f5f7';
}

/* ---------- Language (flips LTR/RTL) ---------- */
function applyLang(){
  const html = document.documentElement;
  html.lang = state.lang;
  html.dir = state.lang==='ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  $('langBtn').textContent = t('lang');
  renderFilters(); renderGrid(); renderTrending();
  if(!$('modal').hidden) fillModal(current);
}

/* ---------- Real download ----------
   Fetches the 3840px image as a blob, then clicks a temporary <a download>.
   If the fetch is blocked (offline, CORS), opens the full image in a new tab. */
async function downloadWallpaper(i){
  const w = WALLPAPERS[i], url = IMG(w.id, 3840);
  toast(t('saving'));
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error(res.status);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `A0M-${w.en.replace(/\W+/g,'-')}-4K.jpg`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast(t('saved'));
  }catch{
    window.open(url, '_blank', 'noopener');
    toast(t('fallback'));
  }
}

/* ---------- Modal ---------- */
let current = 0;
function fillModal(i){
  const w = WALLPAPERS[i];
  current = i;
  $('mImg').src = IMG(w.id, 2000);
  $('mImg').alt = w[state.lang];
  $('mTitle').textContent = w[state.lang];
  $('mMeta').textContent = '3840 × 2160 · ' + w.cats.map(c=>CATEGORIES[c][state.lang]).join(' / ');
}
function openModal(i){ fillModal(i); $('modal').hidden = false; document.body.style.overflow='hidden'; $('close').focus(); }
function closeModal(){ $('modal').hidden = true; document.body.style.overflow=''; }

let toastTimer;
function toast(msg){
  const el = $('toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), 2600);
}

/* ---------- Events ---------- */
$('themeBtn').onclick = e => {
  state.theme = state.theme==='dark' ? 'light' : 'dark';
  store.set('a0m-theme', state.theme); applyTheme();
  const b = e.currentTarget; b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin'); // restart icon rotation
};
$('langBtn').onclick = () => { state.lang = state.lang==='en'?'ar':'en'; store.set('a0m-lang',state.lang); applyLang(); };
$('search').oninput  = e => { state.q = e.target.value; renderGrid(); };
$('filters').onclick = e => { const b = e.target.closest('[data-cat]'); if(!b) return; state.cat = b.dataset.cat; renderFilters(); renderGrid(); };

// One delegated handler for cards: download button first, otherwise open preview
document.addEventListener('click', e => {
  const d = e.target.closest('[data-dl]');
  if(d){ e.stopPropagation(); return downloadWallpaper(+d.dataset.dl); }
  const c = e.target.closest('.card');
  if(c) openModal(+c.dataset.i);
});
document.addEventListener('keydown', e => {
  if(e.key==='Escape' && !$('modal').hidden) closeModal();
  if(e.key==='Enter' && e.target.classList.contains('card')) openModal(+e.target.dataset.i);
});
$('close').onclick = closeModal;
$('modal').onclick = e => { if(e.target.id==='modal') closeModal(); };
$('dl').onclick    = () => downloadWallpaper(current);

/* ---------- Init ---------- */
$('year').textContent = new Date().getFullYear();
applyTheme(); applyLang();
