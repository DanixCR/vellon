# 00 — Project Overview: Vellon (Fundación Ovejitas)

## Descripción General
**Vellon** es el sistema web de la Fundación Ovejitas de Costa Rica, organización sin fines de lucro orientada al apoyo de familias en condición de vulnerabilidad. Centraliza la gestión de donantes, contactos, actividades y estudios socioeconómicos de beneficiarios.

**Repositorio:** `github.com/DanixCR/vellon`
**Descripción repo:** Sistema de gestión administrativa para Fundación Ovejitas de Costa Rica. Sitio público informativo + panel administrativo para donantes, actividades y estudios socioeconómicos. ASP.NET Core 8 · Clean Architecture · React · SQL Server.

---

## Separación del Sistema

```
┌─────────────────────────────────┐    LOGIN    ┌──────────────────────────────────────┐
│        PÁGINA PÚBLICA           │─────────────▶│      SISTEMA ADMINISTRATIVO          │
│     (sin login — público)       │             │     (con login — solo personal)       │
├─────────────────────────────────┤             ├──────────────────────────────────────┤
│ • Home                          │             │ • Dashboard                           │
│ • Nosotros                      │             │ • Gestión de Contactos/Donantes       │
│ • Actividades (dinámico ←BD)    │◀────────────│ • Gestión de Actividades ← crea aquí │
│ • Contacto / Donantes           │             │ • Gestión de Estudios Socioeconómicos │
│ • [Personal administrativo]     │             │ • Gestión de Usuarios Admin           │
└─────────────────────────────────┘             └──────────────────────────────────────┘
```

**El ciclo clave:** El admin crea una actividad en el panel → se guarda en BD → el sitio público la muestra automáticamente. Esto convierte el proyecto en un sistema web real.

---

## Módulos del Sistema

| # | Módulo | Tipo | Descripción |
|---|--------|------|-------------|
| 1 | Sitio Público | Frontend | Home, Nosotros, Actividades (dinámico), Contacto |
| 2 | Autenticación | Full Stack | Login, recuperación de contraseña por email, JWT |
| 3 | Gestión de Contactos/Donantes | Full Stack | Formulario público → CRUD admin |
| 4 | Gestión de Actividades | Full Stack | Admin crea → sitio público muestra |
| 5 | Estudio Socioeconómico | Full Stack | CRUD completo del formulario socioeconómico |
| 6 | Panel Admin + Dashboard | Frontend | Resumen + acceso a todos los módulos |
| 7 | Gestión de Usuarios Admin | Full Stack | SuperAdmin crea/gestiona otros admins |

---

## Stack Tecnológico

- **Frontend:** React + Vite + TypeScript
- **Backend:** ASP.NET Core 8 Web API — C#
- **ORM:** Entity Framework Core 8
- **Autenticación:** JWT Bearer + BCrypt + MailKit (recuperación por email)
- **Base de datos:** SQL Server local → Azure SQL (futuro)
- **Arquitectura:** Clean Architecture (4 capas)

---

## Estructura del Repositorio

```
vellon/
├── backend/
│   ├── Vellon.sln
│   ├── Vellon.Domain/
│   ├── Vellon.Application/
│   ├── Vellon.Infrastructure/
│   └── Vellon.WebAPI/
├── frontend/
│   └── vellon-web/                ← React app (Vite + TypeScript)
├── specs/
│   ├── 00-project-overview.md
│   ├── 01-architecture.md
│   ├── 02-public-site.md
│   ├── 03-auth.md
│   ├── 04-module-contacts.md
│   ├── 05-module-socioeconomic.md
│   ├── 06-admin-panel.md
│   ├── 07-ai-tooling.md
│   ├── 08-branding.md
│   └── 09-module-activities.md
├── skills/
│   ├── SKILL.md                   ← Router
│   ├── clean-architecture/SKILL.md
│   ├── ef-core/SKILL.md
│   ├── jwt-auth/SKILL.md
│   ├── react-frontend/SKILL.md
│   ├── testing/SKILL.md
│   ├── git-workflow/SKILL.md
│   └── branding/SKILL.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── CLAUDE.md
└── README.md
```

---

## Flujo General del Sistema

```
[Usuario público]                    [Admin]
  → visita el sitio                    → inicia sesión
  → ve actividades de la fundación     → gestiona actividades, contactos,
  → llena formulario de contacto         estudios socioeconómicos y usuarios
  → datos se guardan en BD            → cambios se reflejan en el sitio público
```

---

## Tablas en Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `Admins` | Usuarios administrativos del sistema |
| `PasswordResetTokens` | Tokens de recuperación de contraseña |
| `ContactRecords` | Registros del formulario público de contacto/donantes |
| `Activities` | Actividades de la fundación (gestionadas por admin, visibles al público) |
| `SocioeconomicStudies` | Estudios socioeconómicos completos |
| `FamilyMembers` | Miembros del núcleo familiar (relación con SocioeconomicStudy) |
| `HouseholdItems` | Menaje del hogar (relación con SocioeconomicStudy) |

---

## Alcance del Proyecto (según anteproyecto aprobado)

✅ Incluido:
- Sitio web informativo con contenido dinámico
- Formularios de recolección de datos
- Autenticación con recuperación de contraseña por email
- CRUD de registros en panel administrativo
- Base de datos relacional SQL Server

❌ Excluido:
- Aplicación móvil
- Pagos en línea
- Seguridad avanzada / escalabilidad empresarial

---

## Horas Estimadas (TCU — 150 horas)

| Actividad | Horas |
|-----------|-------|
| Análisis de requerimientos | 20 |
| Diseño del sistema | 25 |
| Desarrollo | 70 |
| Pruebas | 20 |
| Documentación | 15 |
| **Total** | **150** |

---

## Contacto de la Organización

- **Contacto:** Jessica Ramos Portillo — Coordinadora de Proyectos
- **Email:** fundacionovejitas@gmail.com
- **Teléfono:** 6480-1020
- **Cédula jurídica:** 3-006-924532
