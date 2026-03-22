# 🛠️ Herramientas del ecosistema backend

Documentación requerida por el ejercicio 3, Fase D.

---

## Axios

**Qué es:** Librería JavaScript para hacer peticiones HTTP desde el navegador o desde Node.js. Es una alternativa a la API nativa `fetch`, pero con ventajas importantes.

**Por qué se usa:**
- Transforma automáticamente el body a/desde JSON (sin necesidad de `JSON.stringify` o `.json()`)
- Interceptores: permite añadir cabeceras de autenticación o manejar errores de forma global con `axios.interceptors`
- Cancelación de peticiones nativa
- Mejor soporte para timeouts
- Funciona igual en navegador y en Node.js (isomórfico)

**Ejemplo básico:**
```js
import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

// GET
const { data } = await client.get('/tasks');

// POST
const { data: nueva } = await client.post('/tasks', { text: 'Mi tarea', priority: 'high', cat: 'trabajo' });
```

**Cuándo elegir Axios sobre fetch:**
Cuando necesitas interceptores globales, timeouts configurables o compatibilidad con entornos Node.js antiguos. Para proyectos sencillos, `fetch` es suficiente.

---

## Postman

**Qué es:** Aplicación de escritorio (y web) para diseñar, probar y documentar APIs REST. Es la herramienta estándar de la industria para el trabajo con APIs.

**Por qué se usa:**
- Permite enviar peticiones GET, POST, PATCH, DELETE sin necesidad de escribir código
- Guarda colecciones de peticiones organizadas por proyecto
- Permite definir variables de entorno (ej. `{{BASE_URL}}`) para cambiar entre desarrollo y producción fácilmente
- Genera documentación automática a partir de las colecciones
- Permite automatizar tests de integración con scripts en JavaScript (`pm.test`)

**Flujo típico con TaskFlow:**
1. Crear una colección llamada "TaskFlow API"
2. Añadir petición `GET http://localhost:3000/api/v1/tasks` → verificar que devuelve 200
3. Añadir petición `POST` sin body → verificar que devuelve 400
4. Añadir petición `DELETE` con ID inexistente → verificar que devuelve 404

**Alternativa ligera:** Thunder Client (extensión de VS Code, sin instalación separada).

---

## Sentry

**Qué es:** Plataforma de monitorización de errores en tiempo real para aplicaciones en producción. Captura excepciones no manejadas, las agrupa y las envía a un dashboard centralizado con trazas completas.

**Por qué se usa:**
- En producción, los `console.error()` no son visibles. Sentry los captura y los almacena
- Adjunta contexto automático: URL, navegador, sistema operativo, usuario autenticado, breadcrumbs (secuencia de acciones antes del error)
- Alertas por email o Slack cuando aparece un error nuevo
- Agrupa errores similares para evitar el ruido de duplicados
- Mide la "tasa de errores" y el impacto en los usuarios

**Integración básica en Express:**
```js
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });

// Como primer middleware (antes de las rutas)
app.use(Sentry.Handlers.requestHandler());

// Como último middleware de errores
app.use(Sentry.Handlers.errorHandler());
```

**Cuándo es imprescindible:** En cualquier aplicación en producción con usuarios reales. Saber que algo ha fallado antes de que lo reporte el usuario es crítico.

---

## Swagger (OpenAPI)

**Qué es:** Estándar abierto (OpenAPI Specification) para describir APIs REST en formato YAML o JSON. Swagger es el conjunto de herramientas que permite generar documentación interactiva, clientes SDK y tests a partir de esa especificación.

**Por qué se usa:**
- Genera una página web interactiva donde cualquier desarrollador puede probar la API directamente desde el navegador (sin Postman)
- Actúa como **contrato** entre el equipo backend y el frontend: ambos acuerdan la especificación antes de implementar
- Permite generar SDKs en múltiples lenguajes automáticamente
- Herramienta estándar de la industria para documentar APIs en equipos grandes

**Integración en Express con `swagger-ui-express`:**
```js
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json'); // o generado con swagger-jsdoc

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Accesible en: http://localhost:3000/api/docs
```

**Ejemplo de spec para nuestra API:**
```yaml
openapi: 3.0.0
info:
  title: TaskFlow API
  version: 1.0.0
paths:
  /api/v1/tasks:
    get:
      summary: Obtener todas las tareas
      responses:
        '200':
          description: Lista de tareas
    post:
      summary: Crear una tarea nueva
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [text, priority, cat]
              properties:
                text:     { type: string }
                priority: { type: string, enum: [high, medium, low] }
                cat:      { type: string, enum: [personal, trabajo, salud, hogar] }
      responses:
        '201': { description: Tarea creada }
        '400': { description: Datos inválidos }
```

---

## Resumen comparativo

| Herramienta | Fase del desarrollo | Propósito principal                     |
|-------------|---------------------|-----------------------------------------|
| Axios       | Desarrollo          | Cliente HTTP para consumir APIs         |
| Postman     | Desarrollo / QA     | Pruebas manuales e integración de APIs  |
| Swagger     | Diseño / Producción | Documentación interactiva del contrato  |
| Sentry      | Producción          | Monitorización de errores en tiempo real|