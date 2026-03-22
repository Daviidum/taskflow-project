import * as api from './src/api/client.js';

// ══════════════════════════════════════════
//  SIDEBAR DRAWER
// ══════════════════════════════════════════
function openSidebar() {
  document.getElementById('sidebar').classList.add('sidebar-open');
  document.getElementById('sidebar-overlay').classList.add('overlay-visible');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('sidebar-open');
  document.getElementById('sidebar-overlay').classList.remove('overlay-visible');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════
function initTheme() {
  const saved       = localStorage.getItem('theme') || 'light';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (saved === 'system' && prefersDark) ? 'dark' : 'light');
}

function applyTheme(theme) {
  const html = document.documentElement;
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  if (theme === 'dark') {
    html.classList.add('dark'); body.classList.add('dark');
    if (icon) icon.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
    document.getElementById('ring-pct')?.setAttribute('fill', 'white');
    document.getElementById('ring-sub')?.setAttribute('fill', '#9ca3af');
  } else {
    html.classList.remove('dark'); body.classList.remove('dark');
    if (icon) icon.textContent = '🌙';
    localStorage.setItem('theme', 'light');
    document.getElementById('ring-pct')?.setAttribute('fill', '#1c1917');
    document.getElementById('ring-sub')?.setAttribute('fill', '#78716f');
  }
}
function toggleTheme() {
  applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
}

// ══════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

const QUOTES = [
  { text: '"El secreto de salir adelante es comenzar."',                                author: '— Mark Twain'      },
  { text: '"Organízate. Una tarea a la vez cambia el mundo."',                          author: '— Anónimo'         },
  { text: '"La disciplina es elegir entre lo que quieres ahora y lo que quieres más."', author: '— Abraham Lincoln' },
  { text: '"Cada gran logro fue una vez un sueño imposible."',                          author: '— Harriet Tubman'  },
  { text: '"No cuentes los días. Haz que los días cuenten."',                           author: '— Muhammad Ali'    },
];

const CATEGORIES = {
  personal: '👤 Personal', trabajo: '💼 Trabajo',
  salud: '🌿 Salud',       hogar: '🏠 Hogar',
  videojuegos: '🎮 Videojuegos', ocio: '🎉 Ocio',
};
const PRIORITIES = { high: 'Alta', medium: 'Media', low: 'Baja' };

function loadQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const t = document.getElementById('quote-text');
  const a = document.getElementById('quote-author');
  if (t) t.textContent = q.text;
  if (a) a.textContent = q.author;
}

// ══════════════════════════════════════════
//  ESTADO
// ══════════════════════════════════════════
let tasks        = [];
let todayAdded   = 0;
let activeFilter = 'all';
let ringEl, ringPctEl;

// ══════════════════════════════════════════
//  BANNERS
// ══════════════════════════════════════════
function showBanner(state, msg = '') {
  const banner = document.getElementById('network-banner');
  const text   = document.getElementById('network-text');
  if (!banner || !text) return;
  banner.className = 'network-banner';
  if (state === 'loading') {
    banner.classList.add('nb-loading');
    text.textContent = '⏳ Conectando con el servidor...';
    banner.style.display = 'flex';
  } else if (state === 'error') {
    banner.classList.add('nb-error');
    text.textContent = `❌ ${msg}`;
    banner.style.display = 'flex';
    setTimeout(() => { banner.style.display = 'none'; }, 5000);
  } else {
    banner.style.display = 'none';
  }
}

function setTaskListLoading(on) {
  const list = document.getElementById('task-list');
  if (!list || !on) return;
  list.innerHTML = `
    <div class="text-center py-10 sm:py-12 4xl:py-16 text-stone-400 dark:text-stone-600">
      <span class="text-4xl sm:text-5xl 4xl:text-7xl block mb-3 4xl:mb-5">⏳</span>
      <p class="text-sm 4xl:text-lg">Cargando tareas desde el servidor...</p>
    </div>`;
}

// ══════════════════════════════════════════
//  CRUD ASYNC
// ══════════════════════════════════════════
async function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();
  if (!text) { input.focus(); return; }
  showBanner('loading');
  try {
    const nueva = await api.createTask({
      text,
      priority: document.getElementById('priority-select').value,
      cat:      document.getElementById('cat-select').value,
    });
    tasks.unshift(nueva); todayAdded++;
    input.value = '';
    renderTasks(); updateStats(); showBanner('success');
  } catch (err) { showBanner('error', err.message); }
}

async function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  try {
    const updated = await api.updateTask(id, { done: !t.done });
    const i = tasks.findIndex(t => t.id === id);
    if (i !== -1) tasks[i] = updated;
    renderTasks(); updateStats();
  } catch (err) { showBanner('error', err.message); }
}

async function deleteTask(id) {
  try {
    await api.deleteTask(id);
    tasks = tasks.filter(t => t.id !== id);
    renderTasks(); updateStats();
  } catch (err) { showBanner('error', err.message); }
}

async function clearDone() {
  const done = tasks.filter(t => t.done);
  if (!done.length) return;
  showBanner('loading');
  try {
    await Promise.all(done.map(t => api.deleteTask(t.id)));
    tasks = tasks.filter(t => !t.done);
    renderTasks(); updateStats(); showBanner('success');
  } catch (err) { showBanner('error', err.message); }
}

async function editTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  const newText = prompt('Modifica la descripción:', t.text);
  if (newText === null) return;
  const trimmed = newText.trim();
  if (!trimmed || trimmed === t.text) return;
  try {
    const updated = await api.updateTask(id, { text: trimmed });
    const i = tasks.findIndex(t => t.id === id);
    if (i !== -1) tasks[i] = updated;
    renderTasks();
  } catch (err) { showBanner('error', err.message); }
}

// ══════════════════════════════════════════
//  FILTROS
// ══════════════════════════════════════════
function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = cat;
  renderTasks();
  if (window.innerWidth < 1024) closeSidebar();
}

// ══════════════════════════════════════════
//  RENDER — las clases 4xl/5xl escalan
//  automáticamente via Tailwind JIT
// ══════════════════════════════════════════
function renderTasks() {
  const query    = (document.getElementById('filter-input')?.value || '').toLowerCase();
  const list     = document.getElementById('task-list');
  if (!list) return;

  const filtered = tasks.filter(t =>
    (activeFilter === 'all' || t.cat === activeFilter) &&
    t.text.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    list.innerHTML = `
      <div class="text-center py-10 sm:py-12 4xl:py-20 text-stone-400 dark:text-stone-600">
        <span class="text-4xl sm:text-5xl 4xl:text-7xl 5xl:text-8xl block mb-3 4xl:mb-5">🌸</span>
        <p class="text-sm 4xl:text-lg 5xl:text-xl">No hay tareas aquí todavía.<br>¡Añade una nueva!</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <li class="task-item flex items-center
               gap-3 sm:gap-3.5 4xl:gap-5 5xl:gap-6
               px-3 sm:px-4 4xl:px-6 5xl:px-8
               py-3 sm:py-3.5 4xl:py-5 5xl:py-6
               rounded-2xl 4xl:rounded-3xl
               border-[1.5px] 4xl:border-2 transition-all duration-200 cursor-default
               ${t.done
                 ? 'opacity-60 border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800/50'
                 : 'border-lavender-100 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800'}
               hover:shadow-[0_8px_32px_rgba(140,100,200,.18)] hover:-translate-y-px"
         data-priority="${t.priority}">

      <!-- Checkbox -->
      <div class="custom-check
                  w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] 4xl:w-[32px] 4xl:h-[32px] 5xl:w-[38px] 5xl:h-[38px]
                  rounded-full border-2 border-lavender-300
                  flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200
                  ${t.done
                    ? 'checked bg-gradient-to-br from-lavender-300 to-rose-300 border-transparent'
                    : 'bg-white dark:bg-neutral-700 hover:bg-lavender-300'}"
           onclick="toggleDone('${t.id}')"></div>

      <!-- Cuerpo -->
      <div class="flex-1 min-w-0">
        <div class="text-sm 4xl:text-base 5xl:text-xl font-medium leading-snug cursor-pointer
                    transition-colors duration-200
                    ${t.done ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-white'}
                    hover:text-lavender-500"
             onclick="editTask('${t.id}')">${escHtml(t.text)}</div>
        <div class="flex items-center gap-1.5 sm:gap-2 4xl:gap-3 mt-1 flex-wrap">
          <span class="text-[0.65rem] sm:text-[0.7rem] 4xl:text-xs 5xl:text-sm
                       text-stone-400 dark:text-stone-500">${catLabel(t.cat)}</span>
          <span class="${badgeClass(t.priority)}">${priLabel(t.priority)}</span>
        </div>
      </div>

      <!-- Eliminar -->
      <button onclick="deleteTask('${t.id}')" title="Eliminar"
              class="text-sm sm:text-base 4xl:text-xl 5xl:text-2xl
                     text-stone-300 dark:text-stone-600
                     p-1.5 4xl:p-2.5 rounded-lg 4xl:rounded-xl
                     border-none bg-transparent cursor-pointer flex-shrink-0
                     transition-all duration-150
                     hover:text-rose-400 dark:hover:text-rose-300
                     hover:bg-rose-50 dark:hover:bg-rose-900/30">✕</button>
    </li>
  `).join('');

  updateCounts();
}

// ══════════════════════════════════════════
//  STATS & RING
// ══════════════════════════════════════════
function updateStats() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const set   = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('stat-total', total); set('stat-done', done); set('stat-today', todayAdded);
  set('stat-total-mobile', total); set('stat-done-mobile', done);
  updateRing(total ? Math.round(done / total * 100) : 0);
  updateCounts();
}

function updateCounts() {
  const el = document.getElementById('cnt-all');
  if (el) el.textContent = tasks.length;
  Object.keys(CATEGORIES).forEach(c => {
    const e = document.getElementById('cnt-' + c);
    if (e) e.textContent = tasks.filter(t => t.cat === c).length;
  });
}

function updateRing(pct) {
  if (!ringEl)    ringEl    = document.getElementById('ring');
  if (!ringPctEl) ringPctEl = document.getElementById('ring-pct');
  const circ = 2 * Math.PI * 35;
  if (ringEl) { ringEl.style.strokeDasharray = circ; ringEl.style.strokeDashoffset = circ - (pct / 100) * circ; }
  if (ringPctEl) ringPctEl.textContent = pct + '%';
}

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function catLabel(c) { return CATEGORIES[c] || c; }
function priLabel(p) { return PRIORITIES[p]  || p; }
function badgeClass(p) { return { high:'badge-high', medium:'badge-medium', low:'badge-low' }[p] || ''; }

// ══════════════════════════════════════════
//  EXPOSICIÓN GLOBAL (type="module")
// ══════════════════════════════════════════
Object.assign(window, { toggleDone, deleteTask, editTask, clearDone, filterCat, addTask, openSidebar, closeSidebar });

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  loadQuote();
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('task-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
  document.getElementById('filter-input')?.addEventListener('input', debounce(() => renderTasks(), 300));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

  setTaskListLoading(true);
  showBanner('loading');
  try {
    tasks = await api.fetchTasks();
    showBanner('success');
  } catch (err) {
    showBanner('error', '⚠️ No se pudo conectar al servidor. ¿Está en marcha con "npm run dev"?');
    tasks = [];
  }
  renderTasks();
  updateStats();
});