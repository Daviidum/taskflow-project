// ══════════════════════════════════════════
//  FASE A — Módulo de configuración
//  Lee las variables de entorno y valida que
//  existen antes de que el servidor arranque.
// ══════════════════════════════════════════
require('dotenv').config();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error(
    '❌ El puerto no está definido. Crea un archivo .env con PORT=3000'
  );
}

module.exports = { PORT };