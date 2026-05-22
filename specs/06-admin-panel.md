# 06 — Panel Administrativo (React)

## Descripción
Área protegida con JWT. Solo accesible tras autenticación exitosa. Centraliza la gestión de contactos, actividades, estudios socioeconómicos y usuarios administrativos.

---

## Rutas Privadas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin/dashboard` | `DashboardPage` | Resumen general |
| `/admin/contacts` | `ContactListPage` | Lista de contactos/donantes |
| `/admin/contacts/:id` | `ContactDetailPage` | Detalle de un contacto |
| `/admin/activities` | `ActivityListPage` | Lista de actividades |
| `/admin/activities/new` | `ActivityFormPage` | Crear actividad |
| `/admin/activities/:id/edit` | `ActivityFormPage` | Editar actividad |
| `/admin/socioeconomic` | `SocioeconomicListPage` | Lista de estudios |
| `/admin/socioeconomic/new` | `SocioeconomicFormPage` | Crear estudio |
| `/admin/socioeconomic/:id` | `SocioeconomicDetailPage` | Ver estudio completo |
| `/admin/socioeconomic/:id/edit` | `SocioeconomicFormPage` | Editar estudio |
| `/admin/users` | `UserListPage` | Gestión de admins (solo SuperAdmin) |

Todas estas rutas están envueltas en `<PrivateRoute>`.

---

## Dashboard

Cards de resumen:

| Card | Dato |
|------|------|
| Contactos recibidos | Total de registros |
| No leídos | Contactos sin leer (badge rojo) |
| Actividades activas | Total visibles en sitio público |
| Estudios registrados | Total de estudios socioeconómicos |

---

## Sidebar / Navegación Admin

```
[Logo Ovejitas — reducido]
────────────────────────
📊  Dashboard
📩  Contactos
🎯  Actividades
📋  Estudios Socioeconómicos
────────────────────────
👤  Usuarios Admin        ← solo si IsSuperAdmin
────────────────────────
[Nombre del admin]
🚪  Cerrar sesión
```

- Fondo: celeste `#29ABE2`
- Texto e íconos: blanco
- Item activo: fondo `#0077B6` (celeste oscuro)
- Logo en la parte superior

---

## Estructura de Archivos

```
src/pages/admin/
├── DashboardPage.tsx
├── contacts/
│   ├── ContactListPage.tsx
│   └── ContactDetailPage.tsx
├── activities/
│   ├── ActivityListPage.tsx
│   └── ActivityFormPage.tsx
├── socioeconomic/
│   ├── SocioeconomicListPage.tsx
│   ├── SocioeconomicDetailPage.tsx
│   └── SocioeconomicFormPage.tsx
└── users/
    └── UserListPage.tsx

src/components/admin/
├── AdminLayout.tsx            ← Sidebar + header + outlet
├── PrivateRoute.tsx
├── StatCard.tsx               ← Card de estadística del dashboard
├── ConfirmDialog.tsx          ← Modal de confirmación para eliminar
├── StatusBadge.tsx            ← Badge de estado (activo/inactivo/leído)
└── ActivityToggle.tsx         ← Toggle rápido de visibilidad

src/services/
├── api.ts                     ← axios instance con interceptor JWT
├── authService.ts
├── contactService.ts
├── activityService.ts
├── socioeconomicService.ts
└── userService.ts

src/context/
└── AuthContext.tsx
```

---

## AuthContext

```tsx
interface AuthContextType {
    token: string | null;
    admin: {
        id: number;
        fullName: string;
        username: string;
        isSuperAdmin: boolean;
    } | null;
    login: (token: string, admin: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}
```

---

## Servicios API (axios)

```ts
// services/api.ts
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);
```

---

## Comportamiento de Eliminar

Siempre mostrar `<ConfirmDialog>` antes de cualquier DELETE:

```
"¿Estás seguro de que deseas eliminar este registro?
Esta acción no se puede deshacer."

[Cancelar]   [Eliminar]
```

---

## Comportamiento del Toggle de Actividades

- Toggle visible directamente en la tabla (sin abrir formulario)
- Hace `PATCH /api/activities/{id}/toggle`
- Cambia el badge de estado en tiempo real
- Muestra tooltip: "Visible en sitio público" / "Oculta del sitio público"

---

## Visibilidad por Rol

| Sección | Admin normal | SuperAdmin |
|---------|-------------|-----------|
| Dashboard | ✅ | ✅ |
| Contactos | ✅ | ✅ |
| Actividades | ✅ | ✅ |
| Estudios Socioeconómicos | ✅ | ✅ |
| Usuarios Admin | ❌ | ✅ |

La sección "Usuarios Admin" en el sidebar solo se renderiza si `isSuperAdmin === true`.

---

## Variables de Entorno Frontend

```env
# frontend/vellon-web/.env
VITE_API_URL=http://localhost:5000/api
```

---

## Logout

1. Limpiar `localStorage` (token)
2. Limpiar `AuthContext`
3. Redirigir a `/login`
