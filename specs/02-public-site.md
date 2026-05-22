# 02 — Sitio Público (React)

## Descripción
Interfaz pública accesible por cualquier persona sin autenticación. Presenta información de la fundación, muestra actividades dinámicas desde la BD, y expone el formulario de contacto/donantes.

---

## Rutas Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomePage` | Landing principal con hero y CTA |
| `/nosotros` | `AboutPage` | Misión, visión, quiénes somos |
| `/actividades` | `ActivitiesPage` | Actividades dinámicas desde BD |
| `/contacto` | `ContactPage` | Formulario de contacto / donantes |
| `/login` | `LoginPage` | Acceso admin (no visible en nav principal) |
| `/forgot-password` | `ForgotPasswordPage` | Recuperación de contraseña |
| `/reset-password` | `ResetPasswordPage` | Nueva contraseña con token |

---

## Componentes por Página

### `HomePage`
- Hero con logo de la fundación + ilustración del banner
- Slogan: "Por un futuro mejor..."
- Breve descripción del propósito de la fundación
- Sección de actividades recientes (3 últimas desde BD, con link a `/actividades`)
- CTA visible: "Quiero colaborar" → `/contacto`

### `AboutPage`
- Misión
- Visión
- Historia / quiénes somos
- Datos de contacto de la fundación

### `ActivitiesPage`
- Lista de todas las actividades activas ordenadas por fecha
- Cada actividad muestra: título, descripción, fecha, imagen (si tiene)
- Datos vienen del API: `GET /api/activities/public`
- Si no hay actividades: mensaje amigable "Próximamente nuevas actividades"

### `ContactPage`
- Formulario con campos del módulo Contactos (ver spec 04)
- Mensaje de confirmación al enviar exitosamente
- Manejo de errores con mensaje amigable

---

## Navbar

```
[Logo Ovejitas]   Inicio | Nosotros | Actividades | Contacto   [Personal administrativo →]
```

- Fondo blanco con sombra suave
- Logo a la izquierda
- Links centrados en negro con hover celeste
- "Personal administrativo" como link discreto a la derecha (no botón prominente)
- Responsive: hamburger menu en móvil

## Footer

- Logo pequeño de la fundación
- Email: fundacionovejitas@gmail.com
- Teléfono: 6480-1020
- Fondo celeste oscuro `#0077B6`, texto blanco
- "© 2026 Fundación Ovejitas de Costa Rica"

---

## Estructura de Archivos React

```
frontend/vellon-web/src/
├── pages/
│   ├── public/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ActivitiesPage.tsx
│   │   └── ContactPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ResetPasswordPage.tsx
│   └── admin/
│       └── [ver spec 06]
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── public/
│   │   ├── ActivityCard.tsx       ← Card de una actividad
│   │   ├── ContactForm.tsx
│   │   └── HeroSection.tsx
│   └── admin/
│       └── [ver spec 06]
├── services/
│   ├── api.ts                     ← axios instance base
│   ├── activityService.ts
│   └── contactService.ts
├── App.tsx
└── main.tsx
```

---

## Dependencias Frontend

```bash
npm install react-router-dom axios react-hook-form
```

---

## Comportamiento del Formulario de Contacto

1. Usuario llena el formulario
2. React hace `POST /api/contact-records`
3. API guarda en BD → retorna 201
4. Frontend muestra: "¡Gracias! Tu información fue registrada. Nos pondremos en contacto contigo pronto."
5. Si error → "Ocurrió un error al enviar tu información. Por favor intentá de nuevo."

---

## Comportamiento de Actividades

1. Al cargar `/actividades` → `GET /api/activities/public`
2. API retorna solo actividades con `IsActive = true`, ordenadas por fecha descendente
3. Se renderizan como cards con imagen, título, descripción y fecha
4. En `HomePage` se muestran solo las 3 más recientes

---

## Notas de Diseño (ver spec 08-branding.md)

- Paleta: celeste `#29ABE2` + blanco + negro
- Tipografía: Nunito (headings) + Nunito Sans (body)
- Botones: pill shape, celeste
- Tono: cálido, amigable, en español costarricense
- Responsive: mobile-first
