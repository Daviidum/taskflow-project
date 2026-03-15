# Taskflow Project

Pequeña aplicación de tareas desarrollada para aprender a manejar el DOM y el almacenamiento local con JavaScript.

## Estructura

- `Proyecto/index.html` – página principal con el formulario y la lista dinámica.
- `Proyecto/styles.css` – estilos básicos y adaptativos.
- `Proyecto/app.js` – lógica de la aplicación (añadir, borrar, filtrar, persistencia).

## Funcionalidades

1. Añadir tareas mediante el formulario en la parte superior.
2. Eliminar cada tarea con el botón "×" que aparece junto a ella.
3. Las tareas se guardan automáticamente en `localStorage` con `JSON.stringify`.
4. Al recargar la página las tareas previas se cargan de nuevo.
5. **Bonus**: filtro de búsqueda en tiempo real que oculta las tareas que no coinciden.

## Cómo usar

1. Abrir `Proyecto/index.html` en un navegador moderno.
2. Escribir una nueva tarea y pulsar "Añadir" o Enter.
3. Usar el campo de búsqueda para filtrar la lista.
4. Las tareas persisten en el navegador; no se eliminan al refrescar.

## Despliegue

1. Inicializa un repositorio Git en la carpeta `taskflow-project`.
2. Sube al remoto (GitHub, GitLab, etc.) y conéctalo con Vercel o Netlify.
3. Configura el directorio de publicación en `Proyecto` si es necesario.

El enlace de Vercel/N​etlify proporcionará una versión en línea de la aplicación.

---

_Proyecto creado por Davidum para la fase de interacción JavaScript/DOM de Taskflow._