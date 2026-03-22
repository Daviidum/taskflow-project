// ══════════════════════════════════════════
//  FASE B — Capa de Enrutamiento
//
//  Su única misión: escuchar la red y mapear
//  cada combinación (verbo + URL) al controlador
//  correcto. No toma decisiones lógicas.
// ══════════════════════════════════════════
const { Router }   = require('express');
const controller   = require('../controllers/task.controller');

const router = Router();

// GET    /api/v1/tasks       → Listar todas
// POST   /api/v1/tasks       → Crear nueva
// PATCH  /api/v1/tasks/:id   → Actualizar parcialmente
// DELETE /api/v1/tasks/:id   → Eliminar

router.get('/',    controller.getAll);
router.post('/',   controller.create);
router.patch('/:id',  controller.update);
router.delete('/:id', controller.remove);

module.exports = router;