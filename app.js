// ══════════════════════════════════════════
//  THEME MANAGEMENT
// ══════════════════════════════════════════
function initTheme() {
  const saved     = localStorage.getItem('theme') || 'light';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark    = saved === 'dark' || (saved === 'system' && prefersDark);
  applyTheme(isDark ? 'dark' : 'light');
}

function applyTheme(theme) {
  const html      = document.documentElement;
  const body      = document.body;
  const themeIcon = document.getElementById('theme-icon');

  if (theme === 'dark') {
    html.classList.add('dark');
    body.classList.add('dark');
    if (themeIcon) themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
    // Update SVG text color for dark mode
    const ringLabel = document.getElementById('ring-pct');
    if (ringLabel) ringLabel.setAttribute('fill', 'white');
    const ringSub = document.getElementById('ring-sub');
    if (ringSub) ringSub.setAttribute('fill', '#9ca3af');
  } else {
    html.classList.remove('dark');
    body.classList.remove('dark');
    if (themeIcon) themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'light');
    const ringLabel = document.getElementById('ring-pct');
    if (ringLabel) ringLabel.setAttribute('fill', '#1c1917');
    const ringSub = document.getElementById('ring-sub');
    if (ringSub) ringSub.setAttribute('fill', '#78716f');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

// ══════════════════════════════════════════
//  QUOTES
// ══════════════════════════════════════════
const QUOTES = [
  { text: '"El secreto de salir adelante es comenzar."',                                      author: '— Mark Twain'      },
  { text: '"Organízate. Una tarea a la vez cambia el mundo."',                                author: '— Anónimo'         },
  { text: '"La disciplina es elegir entre lo que quieres ahora y lo que quieres más."',       author: '— Abraham Lincoln' },
  { text: '"Cada gran logro fue una vez un sueño imposible."',                                author: '— Harriet Tubman'  },
  { text: '"No cuentes los días. Haz que los días cuenten."',                                 author: '— Muhammad Ali'    },
];

function loadQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const qtEl = document.getElementById('quote-text');
  const qaEl = document.getElementById('quote-author');
  if (qtEl) qtEl.textContent = q.text;
  if (qaEl) qaEl.textContent = q.author;
}

// ══════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════
const DEFAULT_TASKS = [
  { id: 1, text: 'Enviar deberes a Baron Jack',        priority: 'high',   cat: 'trabajo',  done: false },
  { id: 2, text: 'Recoger el Set Up',                  priority: 'medium', cat: 'hogar',    done: false },
  { id: 3, text: 'Jugar al Euro Truck Simulator 2 🚛', priority: 'low',    cat: 'personal', done: false },
  { id: 4, text: 'Ir al cine 🎬',                      priority: 'low',    cat: 'personal', done: false },
  { id: 5, text: 'Hacer la compra semanal 🛒',         priority: 'medium', cat: 'hogar',    done: false },
];

let tasks      = JSON.parse(localStorage.getItem('tasks_v2') || '[]');
let todayAdded = 0;

// Seed defaults on first load
if (tasks.length === 0) {
  tasks = DEFAULT_TASKS.slice();
  save();
}

let activeFilter = 'all';

// ══════════════════════════════════════════
//  PERSISTENCE
// ══════════════════════════════════════════
function save() {
  localStorage.setItem('tasks_v2', JSON.stringify(tasks));
}

// ══════════════════════════════════════════
//  CRUD
// ══════════════════════════════════════════
function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();
  if (!text) { input.focus(); return; }

  tasks.unshift({
    id:       Date.now(),
    text,
    priority: document.getElementById('priority-select').value,
    cat:      document.getElementById('cat-select').value,
    done:     false,
  });
  todayAdded++;
  input.value = '';
  save();
  renderTasks();
  updateStats();
}

function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; save(); renderTasks(); updateStats(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); renderTasks(); updateStats();
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  save(); renderTasks(); updateStats();
}

function editTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  const newText = prompt('Modifica la descripción de la tarea:', t.text);
  if (newText !== null) {
    const trimmed = newText.trim();
    if (trimmed && trimmed !== t.text) {
      t.text = trimmed;
      save(); renderTasks(); updateStats();
    }
  }
}

// ══════════════════════════════════════════
//  FILTER
// ══════════════════════════════════════════
function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.remove('active', 'bg-lavender-100', 'dark:bg-neutral-800', 'text-stone-900', 'dark:text-white', 'font-semibold');
    b.classList.add('text-stone-500', 'dark:text-stone-400');
  });
  btn.classList.add('active', 'bg-lavender-100', 'dark:bg-neutral-800', 'text-stone-900', 'dark:text-white', 'font-semibold');
  btn.classList.remove('text-stone-500', 'dark:text-stone-400');
  activeFilter = cat;
  renderTasks();
}

// ══════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════
function renderTasks() {
  const query    = (document.getElementById('filter-input').value || '').toLowerCase();
  const list     = document.getElementById('task-list');
  const filtered = tasks.filter(t => {
    const matchCat = activeFilter === 'all' || t.cat === activeFilter;
    const matchQ   = t.text.toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  if (!filtered.length) {
    list.innerHTML = `
      <div class="text-center py-12 text-stone-400 dark:text-stone-600">
        <span class="text-5xl block mb-3">🌸</span>
        <p class="text-sm">No hay tareas aquí todavía.<br>¡Añade una nueva!</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <li class="task-item flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
               border-[1.5px] transition-all duration-200 cursor-default
               ${t.done
                 ? 'opacity-60 border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800/50'
                 : 'border-lavender-100 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800'}
               hover:shadow-[0_8px_32px_rgba(140,100,200,.18)] hover:-translate-y-px"
         data-priority="${t.priority}">

      <!-- Checkbox -->
      <div class="custom-check w-[22px] h-[22px] rounded-full border-2 border-lavender-300
                  flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200
                  ${t.done
                    ? 'checked bg-gradient-to-br from-lavender-300 to-rose-300 border-transparent'
                    : 'bg-white dark:bg-neutral-700 hover:bg-lavender-300'}"
           onclick="toggleDone(${t.id})"></div>

      <!-- Body -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium leading-snug transition-colors duration-200 cursor-pointer
                    ${t.done ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-white'}
                    hover:text-lavender-500"
             onclick="editTask(${t.id})">${escHtml(t.text)}</div>
        <div class="flex items-center gap-2 mt-1 flex-wrap">
          <span class="text-[0.7rem] text-stone-400 dark:text-stone-500">${catLabel(t.cat)}</span>
          <span class="px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold ${badgeClass(t.priority)}">${priLabel(t.priority)}</span>
        </div>
      </div>

      <!-- Delete -->
      <button onclick="deleteTask(${t.id})" title="Eliminar"
              class="text-base text-stone-300 dark:text-stone-600 p-1 rounded-lg border-none bg-transparent cursor-pointer
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
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done').textContent  = done;
  document.getElementById('stat-today').textContent = todayAdded;
  updateRing(total ? Math.round(done / total * 100) : 0);
  updateCounts();
}

function updateCounts() {
  const cats = ['personal', 'trabajo', 'salud', 'hogar', 'videojuegos', 'ocio'];
  const cntAll = document.getElementById('cnt-all');
  if (cntAll) cntAll.textContent = tasks.length;
  cats.forEach(c => {
    const el = document.getElementById('cnt-' + c);
    if (el) el.textContent = tasks.filter(t => t.cat === c).length;
  });
}

function updateRing(pct) {
  const circumference = 2 * Math.PI * 35;
  const offset        = circumference - (pct / 100) * circumference;
  const ring          = document.getElementById('ring');
  const ringPct       = document.getElementById('ring-pct');
  if (ring)    { ring.style.strokeDasharray = circumference; ring.style.strokeDashoffset = offset; }
  if (ringPct) ringPct.textContent = pct + '%';
}

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function catLabel(c) {
  return {
    personal:    '👤 Personal',
    trabajo:     '💼 Trabajo',
    salud:       '🌿 Salud',
    hogar:       '🏠 Hogar',
    videojuegos: '🎮 Videojuegos',
    ocio:        '🎉 Ocio',
  }[c] || c;
}

function priLabel(p) {
  return { high: 'Alta', medium: 'Media', low: 'Baja' }[p] || p;
}

function badgeClass(p) {
  return {
    high:   'bg-gradient-to-r from-rose-200 to-rose-400   text-rose-900',
    medium: 'bg-gradient-to-r from-peach-200 to-peach-300 text-orange-900',
    low:    'bg-gradient-to-r from-mint-300  to-mint-500   text-green-900',
  }[p] || '';
}

function resetStorage() {
  localStorage.removeItem('tasks_v2');
  tasks      = DEFAULT_TASKS.slice();
  todayAdded = 0;
  save(); renderTasks(); updateStats();
}

// ══════════════════════════════════════════
//  EVENTS
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadQuote();

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

  const taskInput = document.getElementById('task-input');
  if (taskInput) taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  renderTasks();
  updateStats();
});