// ══════════════════════════════════════════
//  FASE B — Capa de Servicios
//
//  Contiene la lógica de negocio pura.
//  Esta capa NO conoce Express, req ni res.
//  Simula una base de datos con un array en
//  memoria. Al reiniciar el servidor, los datos
//  vuelven al estado inicial (comportamiento
//  esperado hasta conectar una BD real).
// ══════════════════════════════════════════
const { v4: uuidv4 } = require('uuid');

// ── Datos iniciales (semilla) ─────────────
let tasks = [
  { id: uuidv4(), text: 'Enviar deberes a Baron Jack',        priority: 'high',   cat: 'trabajo',  done: false },
  { id: uuidv4(), text: 'Recoger el Set Up',                  priority: 'medium', cat: 'hogar',    done: false },
  { id: uuidv4(), text: 'Jugar al Euro Truck Simulator 2 🚛', priority: 'low',    cat: 'personal', done: false },
  { id: uuidv4(), text: 'Ir al cine 🎬',                      priority: 'low',    cat: 'personal', done: false },
  { id: uuidv4(), text: 'Hacer la compra semanal 🛒',         priority: 'medium', cat: 'hogar',    done: false },
];

// ── obtenerTodas ──────────────────────────
// Devuelve todas las tareas. Operación segura
// e idempotente (equivalente a HTTP GET).
const obtenerTodas = () => tasks;

// ── crearTarea ────────────────────────────
// Añade una tarea nueva al inicio del array.
// Genera un ID único con UUID v4.
const crearTarea = ({ text, priority, cat }) => {
  const nueva = {
    id:       uuidv4(),
    text:     text.trim(),
    priority,
    cat,
    done:     false,
    creadaEn: new Date().toISOString(),
  };
  tasks.unshift(nueva);
  return nueva;
};

// ── actualizarTarea ───────────────────────
// Aplica cambios parciales (PATCH) sobre una
// tarea existente. Lanza NOT_FOUND si el ID
// no existe — el controlador lo capturará.
const actualizarTarea = (id, cambios) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('NOT_FOUND');

  // Fusión segura: solo sobreescribe los
  // campos enviados, protegiendo el resto.
  tasks[index] = { ...tasks[index], ...cambios };
  return tasks[index];
};

// ── eliminarTarea ─────────────────────────
// Elimina la tarea por ID o lanza NOT_FOUND.
const eliminarTarea = (id) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('NOT_FOUND');
  tasks.splice(index, 1);
};

module.exports = { obtenerTodas, crearTarea, actualizarTarea, eliminarTarea };