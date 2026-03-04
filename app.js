const QUOTES = [
  { text: '"El secreto de salir adelante es comenzar."', author: '— Mark Twain' },
  { text: '"Organízate. Una tarea a la vez cambia el mundo."', author: '— Anónimo' },
  { text: '"La disciplina es elegir entre lo que quieres ahora y lo que quieres más."', author: '— Abraham Lincoln' },
  { text: '"Cada gran logro fue una vez un sueño imposible."', author: '— Harriet Tubman' },
  { text: '"No cuentes los días. Haz que los días cuenten."', author: '— Muhammad Ali' },
];

const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
document.getElementById('quote-text').textContent = q.text;
document.getElementById('quote-author').textContent = q.author;

const DEFAULT_TASKS = [
  { id: 1, text: 'Enviar deberes a Baron Jack',        priority: 'high',   cat: 'trabajo',     done: false },
  { id: 2, text: 'Recoger el Set Up',                  priority: 'medium', cat: 'hogar',       done: false },
  { id: 3, text: 'Jugar al Euro Truck Simulator 2 🚛', priority: 'low',    cat: 'videojuegos', done: false },
  { id: 4, text: 'Ir al cine 🎬',                      priority: 'low',    cat: 'ocio',        done: false },
  { id: 5, text: 'Hacer la compra semanal 🛒',         priority: 'medium', cat: 'hogar',       done: false },
];

let tasks = JSON.parse(localStorage.getItem('tasks_v2') || '[]');

if (tasks.length === 0) {
  tasks = DEFAULT_TASKS.slice();
  save();
} else {
  let changed = false;
  DEFAULT_TASKS.forEach(def => {
    const existing = tasks.find(t => t.id === def.id);
    if (!existing) {
      tasks.push(def);
      changed = true;
    } else {
      if (
        existing.text !== def.text ||
        existing.cat !== def.cat ||
        existing.priority !== def.priority
      ) {
        existing.text     = def.text;
        existing.cat      = def.cat;
        existing.priority = def.priority;
        changed = true;
      }
    }
  });
  if (changed) save();
}

let activeFilter = 'all';
let todayAdded   = 0;

function save() {
  localStorage.setItem('tasks_v2', JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById('task-input').value.trim();
  if (!text) { document.getElementById('task-input').focus(); return; }
  tasks.unshift({
    id: Date.now(),
    text,
    priority: document.getElementById('priority-select').value,
    cat:      document.getElementById('cat-select').value,
    done:     false,
  });
  todayAdded++;
  document.getElementById('task-input').value = '';
  save(); renderTasks(); updateStats();
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

function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = cat;
  renderTasks();
}

function renderTasks() {
  const query    = document.getElementById('filter-input').value.toLowerCase();
  const list     = document.getElementById('task-list');
  const filtered = tasks.filter(t => {
    const matchCat = activeFilter === 'all' || t.cat === activeFilter;
    const matchQ   = t.text.toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><span class="emoji">🌸</span><p>No hay tareas aquí todavía.<br>¡Añade una nueva!</p></div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <li class="task-item ${t.done ? 'done' : ''}" data-priority="${t.priority}">
      <div class="custom-check ${t.done ? 'checked' : ''}" onclick="toggleDone(${t.id})"></div>
      <div class="task-body">
        <div class="task-text" onclick="editTask(${t.id})">${t.text}</div>
        <div class="task-meta">
          <span class="task-cat">${catLabel(t.cat)}</span>
          <span class="badge ${t.priority}">${priLabel(t.priority)}</span>
        </div>
      </div>
      <button class="btn-delete" onclick="deleteTask(${t.id})" title="Eliminar">✕</button>
    </li>
  `).join('');

  updateCounts();
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
  document.getElementById('cnt-all').textContent = tasks.length;
  cats.forEach(c => {
    const el = document.getElementById('cnt-' + c);
    if (el) el.textContent = tasks.filter(t => t.cat === c).length;
  });
}

function updateRing(pct) {
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('ring').style.strokeDasharray  = circumference;
  document.getElementById('ring').style.strokeDashoffset = offset;
  document.getElementById('ring-pct').textContent = pct + '%';
}

function editTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  const newText = prompt('Modifica la descripción de la tarea:', t.text);
  if (newText !== null) {
    const trimmed = newText.trim();
    if (trimmed && trimmed !== t.text) {
      t.text = trimmed;
      save();
      renderTasks();
      updateStats();
    }
  }
}

function replaceTask(oldText, newText) {
  let changed = false;
  tasks.forEach(t => {
    if (t.text === oldText) { t.text = newText; changed = true; }
  });
  if (changed) { save(); renderTasks(); updateStats(); }
}

function resetStorage() {
  localStorage.removeItem('tasks_v2');
  tasks = DEFAULT_TASKS.slice();
  todayAdded = 0;
  save();
  renderTasks();
  updateStats();
}

document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

renderTasks();
updateStats();