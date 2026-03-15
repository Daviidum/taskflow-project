# Comparativa entre asistentes de IA

En este documento cuento cómo he usado ChatGPT y Claude para tareas de programación relacionadas con mi proyecto TaskFlow.
Me he inventado los prompts y las respuestas basándome en cómo suelen contestar, intentando que suene natural y parecido a lo que vería en la realidad.

## 1. Metodología

He probado dos asistentes: ChatGPT y Claude.

Les he pedido tres tipos de cosas:

- Explicar conceptos técnicos de JavaScript (closures, event loop, hoisting).
- Detectar y explicar bugs en tres funciones JavaScript con errores intencionados.
- Generar implementaciones a partir de descripciones en lenguaje natural de tres funciones distintas.

Al comparar las respuestas me he fijado en:

- Claridad de la explicación (si se entiende a la primera).
- Profundidad técnica (si entra en detalles o se queda muy superficial).
- Calidad de ejemplos y analogías.
- Calidad del código generado (legible, idiomático, con buenas prácticas o no).

## 2. Prompts y respuestas

### 2.1 Explicaciones de conceptos técnicos

#### Closures

Prompt usado con ambos:

> Explica qué es un closure en JavaScript como si se lo contaras a alguien que ya sabe funciones pero nunca ha oído hablar del concepto. Incluye un ejemplo de código corto.

Respuesta típica de ChatGPT (resumen):

- Define closure como la combinación de una función y el alcance léxico que la rodea.
- Pone un ejemplo con una función externa `crearContador` que devuelve una interna `incrementar` que recuerda la variable `contador`.
- Explica que, aunque `crearContador` termine de ejecutarse, la función interna sigue pudiendo acceder a `contador` gracias al closure.

Respuesta típica de Claude (resumen):

- Explica el concepto de forma parecida, pero dedica más texto a la parte mental de “la función se lleva una mochila con sus variables”.
- Usa también un contador, pero añade un segundo ejemplo con un manejador de eventos que recuerda el id de un elemento.
- Insiste un poco más en el tema de evitar fugas de memoria si se guardan demasiadas referencias.

Impresión general:

- Los dos se explican bien, pero Claude tiende a ser un poco más narrativo y usar metáforas, mientras que ChatGPT va más al grano.

#### Event loop

Prompt:

> Explícame cómo funciona el event loop en JavaScript usando el ejemplo clásico de `setTimeout`, promesas y código síncrono. No hace falta que entres en demasiados detalles de especificación, pero sí quiero entender el orden de ejecución.

ChatGPT (resumen):

- Explica la diferencia entre stack, heap y cola de tareas.
- Da un ejemplo con `console.log("A")`, `setTimeout`, una promesa y otro `console.log`.
- Muestra el orden final de los logs (por ejemplo A, C, B) y señala dónde entra el event loop.

Claude (resumen):

- Explica algo similar, pero separando “cola de tareas macrotask” y “cola de microtareas” desde el principio.
- Detalla que las promesas se resuelven en la cola de microtareas y los `setTimeout` en la de macrotareas, y por eso el orden cambia.
- Se nota un pelín más técnico en esa parte.

#### Hoisting

Prompt:

> Qué es el hoisting en JavaScript y qué diferencia hay entre declarar con `var`, `let` y `const` respecto a esto. Dame ejemplos que muestren errores típicos.

ChatGPT (resumen):

- Explica que las declaraciones se “mueven” al principio del ámbito en fase de compilación, pero las asignaciones no.
- Muestra el clásico ejemplo de usar una variable `x` antes de declararla con `var` y con `let`, y enseña el `ReferenceError` en el segundo caso.

Claude (resumen):

- Explica lo mismo, pero insiste en el concepto de “temporal dead zone” con `let` y `const`.
- Añade un ejemplo con funciones declaradas y funciones asignadas a constantes.

En los tres conceptos, las respuestas son bastante parecidas, pero Claude tiende a meter un poco más de matiz técnico y ChatGPT a veces resume mejor para una lectura rápida.

### 2.2 Detección de bugs en funciones JavaScript

Usé tres funciones con errores intencionados.

#### Función 1: suma de números en un array

Prompt (idéntico para ambos, con el código pegado):

> Tengo esta función en JavaScript:
>
> ```js
> function sumarArray(numeros) {
>   let total = 0;
>   for (let i = 1; i <= numeros.length; i++) {
>     total = total + numeros[i];
>   }
>   return total;
> }
> ```
>
> Detecta y explica cualquier bug o problema que veas y propón una versión corregida.

Respuesta ChatGPT (resumen):

- Detecta que el bucle empieza en 1 en lugar de 0 y que usa `<=` en lugar de `<`, por lo que accede a índices incorrectos y `undefined`.
- Propone un bucle `for (let i = 0; i < numeros.length; i++)` o usar `reduce`.
- Explica que acceder a `numeros[i]` fuera de rango da `undefined` y que `total + undefined` resulta en `NaN`.

Respuesta Claude (resumen):

- Detecta lo mismo y además comenta que sería bueno validar que `numeros` es realmente un array y que todos los elementos son numéricos.
- Propone también una versión con `reduce` y otra con un simple bucle, con manejo básico de tipos.

#### Función 2: encontrar usuario por id

Código buggy:

```js
function encontrarUsuario(usuarios, id) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id = id) {
      return usuarios[i];
    }
  }
  return null;
}
```

Ambos asistentes detectan el típico error de usar `=` en lugar de `===` en el `if`.

ChatGPT:

- Comenta que se está asignando el id en vez de compararlo.
- Devuelve una versión corregida y sugiere usar `find`.

Claude:

- Hace lo mismo, pero también menciona que se puede devolver `undefined` en vez de `null` para ser más idiomático en JavaScript moderno (aunque eso es más una preferencia).

#### Función 3: función asíncrona que olvida el await

Código:

```js
async function cargarTareas() {
  const respuesta = fetch("/api/tareas");
  const datos = await respuesta.json();
  return datos;
}
```

Ambos asistentes explican que falta un `await` delante de `fetch`.

ChatGPT:

- Corrige la función con `const respuesta = await fetch("/api/tareas");`.
- Explica brevemente que sin el `await` `respuesta` es una promesa y no tiene `json` todavía.

Claude:

- Añade lo mismo y además propone envolver la llamada en un bloque `try/catch` sencillo.

En general, los dos detectan los bugs sin problemas.
Claude tiende a proponer un poco más de manejo de errores, mientras que ChatGPT se centra en el bug concreto.

### 2.3 Generación de código a partir de descripciones

#### Función 1: filtrar tareas completadas

Descripción que usé:

> Quiero una función de JavaScript que reciba una lista de tareas con esta forma `{ id, titulo, completada }` y devuelva solo las que estén completadas. Usa nombres claros y no te compliques.

Ambos asistentes generan algo como:

```js
function filtrarTareasCompletadas(tareas) {
  return tareas.filter(tarea => tarea.completada);
}
```

La calidad aquí es prácticamente idéntica.

#### Función 2: buscar tareas por texto

Descripción:

> Necesito una función que busque tareas por texto. Debe devolver todas las tareas cuyo título contenga el texto buscado, sin distinguir mayúsculas de minúsculas. Si el texto está vacío, debe devolver la lista original.

ChatGPT:

- Genera una función con normalización a minúsculas usando `toLowerCase()`.
- Maneja el caso de texto vacío devolviendo el array tal cual.

Claude:

- Hace lo mismo, pero especifica un poco más en los nombres de variables y añade algún comentario corto.

#### Función 3: ordenar tareas por fecha

Descripción:

> Quiero una función que reciba una lista de tareas con un campo `fechaCreacion` en formato ISO y las devuelva ordenadas de más reciente a más antigua.

Aquí los dos generan algo estilo:

```js
function ordenarTareasPorFecha(tareas) {
  return [...tareas].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
}
```

La diferencia principal es que, a veces, Claude insiste más en clonar el array para no mutar el original, mientras que ChatGPT en alguna ocasión ha usado `tareas.sort(...)` directamente.

## 3. Análisis comparativo

Después de estos experimentos, mis sensaciones son estas:

- En explicaciones teóricas, los dos son buenos, pero Claude suele extenderse más y meter alguna metáfora o detalle extra, mientras que ChatGPT es un poco más directo.
- En detección de bugs, el rendimiento es prácticamente igual; los dos pillan los errores típicos sin problema.
- En calidad de código generado, la diferencia es pequeña. Los dos generan código bastante razonable para cosas simples. Claude a veces añade más validaciones o manejo de errores, ChatGPT tiende a quedarse en la solución más limpia y corta.
- En cuanto a claridad, me suele resultar un pelín más fácil leer las respuestas de ChatGPT cuando quiero ir rápido, y las de Claude cuando quiero empaparme más de contexto.

## 4. Conclusiones personales

Para tareas rápidas de desarrollo en TaskFlow (por ejemplo, escribir una función de filtrado o revisar un bug concreto), me siento cómodo usando cualquiera de los dos, pero quizá tiro un poco más de ChatGPT porque va más al grano.

Cuando quiero que alguien me cuente una parte de JavaScript con más calma y más matices, Claude me resulta muy agradable de leer porque se enrolla un poco más y suele dar ejemplos adicionales.

En cualquier caso, en ambos casos tengo que revisar siempre el código que generan antes de integrarlo en el proyecto, porque a veces asumen cosas sobre mi estructura de datos que no son del todo correctas.

La conclusión general es que los dos son útiles, y lo importante al final es el tipo de prompt que les escribo y que yo mantenga el criterio técnico a la hora de aceptar o no sus sugerencias.
