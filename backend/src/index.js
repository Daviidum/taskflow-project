// ══════════════════════════════════════════
//  FASE A/C — Punto de entrada del servidor
//
//  Orquesta el pipeline de middlewares:
//    1. CORS  → permite peticiones del frontend
//    2. JSON  → parsea el body de la petición
//    3. Logger → audita cada petición con su
//               duración y código de respuesta
//    4. Rutas → delega al router correspondiente
//    5. Error → captura cualquier excepción no
//               controlada y devuelve una
//               respuesta segura al cliente
// ══════════════════════════════════════════
const { PORT } = require('./config/env'); // Valida variables de entorno ANTES de todo
const express  = require('express');
const cors     = require('cors');

const taskRoutes = require('./routes/task.routes');

const app = express();

// ── Middlewares globales ──────────────────

// Permite peticiones desde http://localhost (u otros orígenes)
app.use(cors());

// Parsea el body JSON de las peticiones entrantes
app.use(express.json());

// Middleware de auditoría: registra método, URL, código y duración
app.use((req, res, next) => {
  const inicio = performance.now();

  // Nos suscribimos al evento 'finish' del stream de respuesta de Node.js
  // para calcular el tiempo real de procesamiento de la petición completa.
  res.on('finish', () => {
    const ms = (performance.now() - inicio).toFixed(2);
    console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });

  next(); // ⚠️ Obligatorio: sin esto la petición queda colgada infinitamente
});

// ── Rutas de la API ───────────────────────
app.use('/api/v1/tasks', taskRoutes);

// ── Middleware de errores global (FASE C) ─
// Debe tener exactamente 4 parámetros para que
// Express lo reconozca como manejador de errores.
// Siempre debe ir AL FINAL, después de todas las rutas.
app.use((err, req, res, next) => {
  // Mapeo semántico: errores de dominio → códigos HTTP correctos
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }

  // Para cualquier otro error inesperado:
  // - Registramos la traza completa en el servidor (para depuración)
  // - Devolvemos un mensaje genérico al cliente (nunca detalles internos)
  console.error('💥 Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ── Arranque ──────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
  console.log(`📋 Tareas API → http://localhost:${PORT}/api/v1/tasks`);
});