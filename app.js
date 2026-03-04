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

let tasks = JSON.parse(localStorage.getItem('tasks_v2') || '[]');
if (!tasks.length) {
  tasks = [
    { id: 1, text: 'Revisar correos del trabajo', priority: 'high',   cat: 'trabajo',   done: false },
    { id: 2, text: 'Ir al gimnasio 🏋️',           priority: 'medium', cat: 'salud',     done: false },
    { id: 3, text: 'Ir a la biblioteca Florida',    priority: 'low',    cat: 'hogar',     done: true  },
    { id: 4, text: 'Darle un beso a Irene',           priority: 'low',    cat: 'personal',  done: false },
    { id: 5, text: 'Darle un abrazo a la prima de Irene', priority: 'high', cat: 'trabajo',  done: false },
  ];
  save();
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
        <div class="task-text">${t.text}</div>
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
  return { personal: '👤 Personal', trabajo: '💼 Trabajo', salud: '🌿 Salud', hogar: '🏠 Hogar' }[c] || c;
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
  const cats = ['personal', 'trabajo', 'salud', 'hogar'];
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

// Enter to add
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

renderTasks();
updateStats();