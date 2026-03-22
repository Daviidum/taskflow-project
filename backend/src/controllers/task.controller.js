// ══════════════════════════════════════════
//  FASE B — Capa de Controladores
//
//  Actúa como director de orquesta:
//  1. Extrae datos de la petición (req)
//  2. Valida que los datos son correctos
//  3. Invoca al servicio con datos limpios
//  4. Formatea y envía la respuesta HTTP (res)
//
//  Esta capa debe ser extremadamente delgada.
//  Toda lógica de negocio vive en el servicio.
// ══════════════════════════════════════════
const taskService = require('../services/task.service');

const VALID_PRIORITIES = ['high', 'medium', 'low'];
const VALID_CATS       = ['personal', 'trabajo', 'salud', 'hogar', 'videojuegos', 'ocio'];

// ── GET /api/v1/tasks ─────────────────────
const getAll = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
};

// ── POST /api/v1/tasks ────────────────────
const create = (req, res) => {
  const { text, priority, cat } = req.body;

  // Validación defensiva en la frontera de red
  if (!text || typeof text !== 'string' || text.trim().length < 1) {
    return res.status(400).json({
      error: 'El campo "text" es obligatorio y debe ser texto no vacío.',
    });
  }

  if (!priority || !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `El campo "priority" debe ser uno de: ${VALID_PRIORITIES.join(', ')}.`,
    });
  }

  if (!cat || !VALID_CATS.includes(cat)) {
    return res.status(400).json({
      error: `El campo "cat" debe ser uno de: ${VALID_CATS.join(', ')}.`,
    });
  }

  const nueva = taskService.crearTarea({ text, priority, cat });
  // 201 Created — semántica HTTP correcta para recursos nuevos
  res.status(201).json(nueva);
};

// ── PATCH /api/v1/tasks/:id ───────────────
const update = (req, res, next) => {
  const { id }   = req.params;
  const cambios  = req.body;

  if (!cambios || Object.keys(cambios).length === 0) {
    return res.status(400).json({
      error: 'Debes enviar al menos un campo para actualizar.',
    });
  }

  try {
    const actualizada = taskService.actualizarTarea(id, cambios);
    res.status(200).json(actualizada);
  } catch (err) {
    // Cedemos el error al middleware global de Express
    next(err);
  }
};

// ── DELETE /api/v1/tasks/:id ──────────────
const remove = (req, res, next) => {
  const { id } = req.params;

  try {
    taskService.eliminarTarea(id);
    // 204 No Content — éxito sin cuerpo de respuesta
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };