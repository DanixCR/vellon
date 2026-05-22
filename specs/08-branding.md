# 08 — Diseño y Branding: Fundación Ovejitas

## Identidad Visual

### Paleta de Colores

```css
:root {
  /* Primarios */
  --color-primary:        #29ABE2;   /* Celeste Ovejitas — color principal del logo */
  --color-primary-dark:   #0077B6;   /* Celeste oscuro — bordes, hover, énfasis */
  --color-primary-light:  #7DD3F0;   /* Celeste claro — backgrounds suaves */

  /* Neutros */
  --color-black:          #1A1A1A;   /* Texto principal ("Fundación") */
  --color-white:          #FFFFFF;   /* Fondo base, ovejita */
  --color-gray-100:       #F5F9FC;   /* Fondo de secciones claras */
  --color-gray-200:       #E8F4FB;   /* Cards, inputs */
  --color-gray-500:       #6B7280;   /* Texto secundario */

  /* Semánticos */
  --color-success:        #22C55E;
  --color-error:          #EF4444;
  --color-warning:        #F59E0B;

  /* Accent — del arcoíris del banner (uso puntual) */
  --color-accent-green:   #7EC850;
  --color-accent-orange:  #F7941D;
}
```

### Tipografía

El logo usa una tipografía redondeada y amigable. Para el sistema web:

```css
/* Fuente principal — redondeada, amigable, legible */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Nunito+Sans:wght@400;600&display=swap');

:root {
  --font-heading: 'Nunito', sans-serif;       /* Títulos, navbar, botones */
  --font-body:    'Nunito Sans', sans-serif;   /* Cuerpo, tablas, formularios */
}
```

**Por qué Nunito:** Es redondeada, cálida y legible — alineada con el espíritu de la marca. Evita tipografías corporativas frías.

---

## Assets del Proyecto

```
frontend/ovejitas-web/src/assets/
├── logo.jpg          ← Logo principal (ovejita + "Fundación Ovejitas")
├── banner.jpg        ← Banner completo con niños y arcoíris
└── favicon.ico       ← Generar desde el logo (usar realfavicongenerator.net)
```

---

## Componentes con Guía de Estilo

### Botón Primario
```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 9999px;        /* Pill shape — acorde al estilo redondeado */
  font-family: var(--font-heading);
  font-weight: 700;
  padding: 0.75rem 2rem;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: var(--color-primary-dark);
}
```

### Navbar Pública
- Fondo blanco con sombra suave
- Logo a la izquierda
- Links en negro `#1A1A1A` con hover en `--color-primary`
- Botón "Personal administrativo" en celeste pill

### Hero Section
- Fondo blanco o `--color-gray-100`
- Ilustración o banner de la fundación a la derecha
- Título en `--font-heading` bold, color `#1A1A1A`
- Subtítulo en celeste
- CTA en botón pill celeste

### Cards (actividades, stats del dashboard)
- Fondo blanco
- Borde izquierdo de 4px en `--color-primary`
- Border-radius: 12px
- Sombra: `box-shadow: 0 2px 8px rgba(41,171,226,0.12)`

### Panel Admin — Sidebar
- Fondo: `--color-primary` (celeste)
- Texto e íconos: blanco
- Item activo: `--color-primary-dark` con fondo ligeramente más oscuro
- Logo reducido en la parte superior

---

## Tono y Voz

El sistema es para una fundación que ayuda a familias vulnerables. El lenguaje debe ser:

- **Cálido y cercano** — no frío ni corporativo
- **Simple y claro** — los usuarios no son técnicos
- **Empático** — especialmente en mensajes de error o confirmación

### Ejemplos de mensajes

| ❌ Frío | ✅ Cálido |
|---------|----------|
| "Error 401: Unauthorized" | "Las credenciales ingresadas no son correctas." |
| "Record deleted successfully" | "El registro fue eliminado correctamente." |
| "Submit" | "Enviar información" |
| "Are you sure?" | "¿Estás seguro de que deseas eliminar este registro?" |

---

## Páginas Públicas — Directrices

### Home (`/`)
- Hero con logo grande + ilustración del banner
- Sección: misión de la fundación
- Sección: cómo colaborar
- CTA visible: "Quiero colaborar" → formulario de contacto
- Footer con celeste oscuro

### Login (`/login`)
- Card centrada, fondo `--color-gray-100`
- Logo de la fundación en la parte superior de la card
- Formulario minimalista
- Link "¿Olvidaste tu contraseña?" debajo del botón
- Sin opción de registro

---

## Dashboard Admin — Directrices

- Sidebar celeste con íconos blancos
- Header blanco con nombre del admin logueado
- Cards de estadísticas con borde celeste
- Tablas con header en `--color-primary-light`
- Badges de estado redondeados (pill)

---

## Generación de Imágenes con IA (opcional)

Si se necesitan imágenes adicionales para el sitio público, mantener consistencia con:

- Estilo: ilustración vectorial, colores planos, estilo amigable y alegre
- Paleta: celeste `#29ABE2`, verde `#7EC850`, blanco
- Temática: niños, familias, comunidad, esperanza, Costa Rica
- Herramientas sugeridas: Midjourney, Adobe Firefly, DALL-E con el prompt:
  ```
  "Flat vector illustration, friendly and warm style, children and families, 
   light blue #29ABE2 and white color palette, Costa Rica nonprofit foundation, 
   hope and community theme, clean white background"
  ```
