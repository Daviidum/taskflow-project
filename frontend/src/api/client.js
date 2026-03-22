// ══════════════════════════════════════════
//  FASE D — Capa de red del cliente
//
//  Centraliza TODAS las llamadas HTTP al
//  servidor. El resto del código frontend
//  no conoce URLs, fetch ni códigos HTTP.
//
//  Cada función lanza un Error con el mensaje
//  del servidor si la respuesta no es OK,
//  para que app.js pueda mostrarlo en la UI.
// ══════════════════════════════════════════

const BASE_URL = 'http://localhost:3000/api/v1/tasks';

// ── Helper interno ────────────────────────
// Extrae el JSON del body solo cuando hay contenido
// (evita errores en respuestas 204 No Content).
async function parseResponse(res) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ── GET /api/v1/tasks ─────────────────────
export async function fetchTasks() {
  const res = await fetch(BASE_URL);
  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.error || 'Error al cargar las tareas.');
  return data;
}

// ── POST /api/v1/tasks ────────────────────
export async function createTask({ text, priority, cat }) {
  const res = await fetch(BASE_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text, priority, cat }),
  });
  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.error || 'Error al crear la tarea.');
  return data;
}

// ── PATCH /api/v1/tasks/:id ───────────────
export async function updateTask(id, changes) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(changes),
  });
  const data = await parseResponse(res);
  if (!res.ok) throw new Error(data?.error || 'Error al actualizar la tarea.');
  return data;
}

// ── DELETE /api/v1/tasks/:id ──────────────
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await parseResponse(res);
    throw new Error(data?.error || 'Error al eliminar la tarea.');
  }
  // 204 No Content: sin cuerpo, no hay nada que devolver
}