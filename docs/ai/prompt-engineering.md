 # Prompt engineering aplicado a TaskFlow

 En este documento voy a ir guardando **prompts que realmente me han funcionado bien** al trabajar con IA en el proyecto TaskFlow.
 La idea es tener una “chuleta” con frases que pueda reutilizar para:

 - Generar código nuevo.
 - Refactorizar funciones existentes.
 - Mejorar documentación y comentarios.
 - Pedir explicaciones claras y paso a paso.

 No busco que sean prompts perfectos, sino **prompts prácticos** que me hayan dado buenas respuestas en la práctica.

 ## Prompts útiles y por qué funcionan

 A continuación iré añadiendo al menos diez prompts. Cada uno tendrá:

 - El prompt tal cual lo escribí (o muy parecido).
 - Una explicación corta de **por qué creo que funcionó bien**.

 ### Prompt 1 – Rol de desarrollador senior

 > “Actúa como un desarrollador senior de JavaScript que conoce muy bien buenas prácticas y arquitectura de front-end. Revisa esta función y proponme un refactor explicando tus razones paso a paso.”

 Me funciona porque le da a la IA un **rol claro** (desarrollador senior) y le pido explícitamente que explique sus decisiones, no solo que cambie el código.

 ### Prompt 2 – Few-shot con ejemplo bueno/malo

 > “Te voy a enseñar primero un ejemplo de buen código y otro de mal código en este proyecto. Después quiero que apliques las mismas ideas para mejorar otra función.  
 > Buen código: …  
 > Mal código: …  
 > Ahora mejora esta función siguiendo el estilo del ‘buen código’ y explica los cambios.”

 Funciona bien porque le doy **ejemplos concretos** (few-shot) y una referencia clara de estilo.

 ### Prompt 3 – Razonamiento paso a paso

 > “Antes de devolverme el código, razona paso a paso qué problemas ves en esta función (nombres, complejidad, casos borde, manejo de errores) y solo al final propón una versión refactorizada.”

 Este prompt fuerza a la IA a **pensar primero y codificar después**, lo que suele dar mejores resultados.

 ### Prompt 4 – Restricciones claras de salida

 > “Devuélveme solo el código final en un único bloque, sin explicaciones, y no modifiques nada fuera de esta función: …”

 Útil cuando quiero **copiar/pegar rápido** sin texto extra y evitar que toque otras partes del archivo.

 ### Prompt 5 – Enfoque en legibilidad

 > “Optimiza esta función priorizando legibilidad sobre micro-optimizaciones. Prefiero nombres claros, early returns y pocas ramas ‘if’. Explica brevemente los cambios.”

 Me ayuda a que la IA se centre en **legibilidad y mantenibilidad**, no solo en hacer el código más corto.

 ### Prompt 6 – Añadir validaciones a formularios

 > “Aquí tienes el código actual de este formulario. Propón validaciones adicionales razonables (longitud mínima, campos obligatorios, formatos válidos) y añade mensajes de error que sean claros para el usuario.”

 Funciona bien para que la IA piense en **casos borde** que yo no había contemplado.

 ### Prompt 7 – Documentación con JSDoc

 > “Genera comentarios JSDoc completos para estas funciones, incluyendo descripción, tipos de parámetros, valores de retorno y posibles errores. Mantén los nombres actuales y no cambies la lógica.”

 Este prompt me ahorra mucho tiempo al generar **documentación estructurada**.

 ### Prompt 8 – Explicación de código heredado

 > “Explícame paso a paso qué hace este archivo como si yo acabara de entrar en el proyecto. Señala también cualquier cosa que te parezca sospechosa o mejorable.”

 Lo uso cuando me enfrento a código que no he escrito yo; la IA actúa como una especie de **guía turística del código**.

 ### Prompt 9 – Diseño de API interna

 > “Ayúdame a diseñar una API interna para gestionar tareas en este proyecto. Define 5–7 funciones claras, sus parámetros y valores de retorno, pensando en que sea fácil de probar y extender.”

 Útil cuando quiero una **visión más arquitectónica** antes de ponerme a picar código.

 ### Prompt 10 – Revisión de seguridad básica

 > “Revisa este código pensando solo en problemas de validación de datos y posibles inyecciones o usos inseguros. No te centres en estilo, solo en seguridad.”

 No sustituye a una auditoría de seguridad real, pero da una **primera pasada rápida** que a veces detecta cosas que yo pasé por alto.
