# TaskFlow - Sistema de Diseño con Tailwind CSS v4

## Descripción del Proyecto

TaskFlow es una aplicación profesional de gestión de tareas rediseñada completamente con **Tailwind CSS v4** y soporte completo para **modo oscuro** dinámico.

## Cambios Implementados

### 1. ✅ Instalación de Tailwind CSS v4
- Instalada versión `^4.2.1` de Tailwind CSS
- Configurado con PostCSS y Autoprefixer
- Generado archivo `tailwind.config.js` con tema personalizado

### 2. ✅ Refactorización con Clases de Utilidad Tailwind
- **Eliminado 100%** del CSS personalizado con variables CSS
- **Reemplazado** por clases de utilidad de Tailwind CSS
- Implementadas todas las secciones:
  - Header con logo y estadísticas
  - Sidebar con widgets (progreso, categorías, citas)
  - Formulario de agregar tareas
  - Lista de tareas con estados dinámicos
  - Búsqueda y filtrado

### 3. ✅ Sistema de Modo Oscuro
- Implementado con la clase `dark:` de Tailwind
- Toggle button en la esquina superior derecha del header
- Persistencia en localStorage
- Detección automática de preferencias del sistema
- Transiciones suaves entre temas

**Elementos con modo oscuro:**
- Fondos: `dark:bg-stone-900`, `dark:bg-stone-800`
- Texto: `dark:text-white`, `dark:text-stone-50`
- Bordes: `dark:border-stone-700`
- Sombras: `dark:shadow-lg-dark`
- Widgets: Todos adaptados con variantes dark

### 4. ✅ Paleta de Colores Personalizada
Colores Tailwind extendidos en `tailwind.config.js`:

| Color | Escala | Uso |
|-------|--------|-----|
| **Rose** | #f7a8b8 → #88205a | Prioridad Alta |
| **Lavender** | #c4b5f4 → #4b1f90 | Acentos |
| **Mint** | #a8e6cf → #047857 | Prioridad Baja |
| **Sky** | #b3d9f7 → #075985 | Enlaces |
| **Peach** | #ffd6b0 → #9a3412 | Prioridad Media |

### 5. ✅ Efectos Interactivos Mejorados

#### Botones
```css
.btn-add {
  @apply hover:shadow-[0_6px_20px_rgba(196,181,244,0.55)] 
         hover:-translate-y-0.5
         active:scale-97
         transition-all duration-150;
}
```

#### Inputs y Formularios
```css
.form-row input:focus {
  @apply border-lavender-400 
         focus:shadow-[0_0_0_3px_rgba(196,181,244,0.2)]
         transition-all duration-200;
}
```

#### Checkboxes Customizados
- Hover: Cambio de color a lavender
- Checked: Gradiente purple-rose con checkmark
- Transiciones suaves en todas las interacciones

#### Elementos de Lista
- Hover: Sombra elevada + traslación Y
- Animación slide-in en adición
- Accentes de prioridad con colores dinámicos

### 6. ✅ Responsividad Tailwind
- Grid adaptable: 2 columnas → 1 columna en tablets
- Sidebar se convierte en flex row en móviles
- Header se colapsa en dispositivos pequeños

## Estructura de Archivos

```
Proyecto/
├── index.html              # HTML refactorizado con clases Tailwind
├── app.js                  # Lógica JavaScript + manejo de temas
├── styles.css              # CSS compilado con Tailwind directives
├── tailwind.config.js      # Configuración personalizada de Tailwind
├── postcss.config.js       # Configuración de PostCSS
└── package.json            # Dependencias actualizadas
```

## Cómo Usar

### Instalación
```bash
npm install
```

### Desarrollo con Watch
Compila Tailwind en tiempo real:
```bash
npm run watch
```

### Compilación Manual
```bash
npm run build
```

### Servir la Aplicación
```bash
npm run dev
```
Abre http://localhost:8080 en tu navegador.

## Funcionalidades de Tema

### Toggle Automático
Haz clic en el botón de tema en la esquina derecha del header:
- 🌙 Modo claro → Modo oscuro
- ☀️ Modo oscuro → Modo claro

### Persistencia
El tema se guarda en localStorage como `theme: 'light' | 'dark'`

### Preferencias del Sistema
Si no hay preferencia guardada, se detecta automáticamente `prefers-color-scheme`

## Variantes Tailwind Utilizadas

### Dark Mode
- Todos los elementos tienen variantes `dark:`
- Transiciones suaves con `transition-colors duration-300`

### Hover & Focus
```css
/* Botones */
hover:shadow-soft-lg
hover:-translate-y-0.5
hover:bg-stone-300
focus:border-lavender-400
focus:shadow-[0_0_0_3px_...]

/* Inputs */
focus:border-lavender-400
focus:shadow-[0_0_0_3px_rgba(196,181,244,0.2)]

/* Enlaces */
hover:text-rose-600
dark:hover:text-rose-400
```

### Animaciones
- `animate-slide-in` para entrada de tareas
- `transition-all duration-200` para cambios suaves
- `active:scale-95` para feedback tactil

## Características Nuevas

✨ **Sistema de Tema Dinámico**
- Toggle visual claro
- Persistencia de preferencias
- Transiciones suaves

🎨 **Diseño Sistema Coherente**
- Escala de espaciado de Tailwind
- Colores personalizados pero consistentes
- Sombras y bordes unificados

⚡ **Mejor Rendimiento**
- CSS purificado: solo clases usadas
- Optimización de Tailwind v4
- Fuentes importadas una sola vez

🔧 **Mantenimiento Simplificado**
- Clases de utilidad vs CSS personalizado
- Configuración centralizada en `tailwind.config.js`
- Fácil de escalar y mantener

## Bonus: Personalización

### Cambiar la Paleta de Colores
Edita `tailwind.config.js`:
```javascript
colors: {
  rose: {
    300: '#f7a8b8',  // Cambia estos valores
    500: '#e8849a',
  },
}
```

### Agregar Nuevos Efectos
En `styles.css`, dentro de `@layer components`:
```css
.my-button {
  @apply px-4 py-2 rounded-lg 
         hover:scale-105 
         transition-transform;
}
```

## Requisitos

- Node.js 16+
- npm 7+
- Navegador moderno con soporte CSS Grid y CSS Variables

## Compatibilidad de Navegadores

- ✅ Chrome/Edge 88+
- ✅ Firefox 87+
- ✅ Safari 14+
- ✅ Opera 74+

## Licencia

ISC - Ver package.json para más detalles

---

**Desarrollado con Tailwind CSS v4 y ❤️**
