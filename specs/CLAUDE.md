# CLAUDE.md — Instrucciones para Claude Code

## Proyecto
**Vellon** — Sistema web de la Fundación Ovejitas de Costa Rica
TCU universitario · Universidad Fidélitas · Ingeniería en Sistemas
Repositorio: `github.com/DanixCR/vellon`

---

## Stack Cognitivo
- **Skills Registry:** Leer `/skills/SKILL.md` antes de actuar en cualquier módulo
- **Plan Mode:** Obligatorio para módulos grandes — generar plan, esperar aprobación humana, luego ejecutar
- **Engram:** Al terminar cada módulo guardar `what/why/where/learned`
- **HITL:** Nunca avanzar al siguiente módulo sin aprobación humana explícita
- **Commits:** Conventional Commits estrictamente — `feat:`, `fix:`, `chore:`, `test:`, `docs:`
- **CI/CD:** GitHub Actions corre en cada PR — lint + tests + security review con Claude

---

## Stack Tecnológico

- **Backend:** ASP.NET Core 8 Web API · C# · EF Core 8 · SQL Server
- **Frontend:** React · Vite · TypeScript
- **Auth:** JWT Bearer · BCrypt · MailKit
- **Arquitectura:** Clean Architecture (4 capas)
- **Naming solución:** `Vellon.Domain`, `Vellon.Application`, `Vellon.Infrastructure`, `Vellon.WebAPI`
- **Naming frontend:** `vellon-web`

---

## Reglas de Trabajo

1. **Leer el spec antes de codificar.** Cada módulo tiene su spec en `/specs/`. Seguirlo al pie de la letra.
2. **Un módulo a la vez.** No avanzar al siguiente sin aprobación humana.
3. **Commit por módulo.** Después de cada aprobación: `git add . && git commit -m "feat: [nombre]"`
4. **No inventar requisitos.** Si algo no está en el spec, preguntar antes de implementar.
5. **Validaciones siempre.** Nunca crear endpoint POST/PUT sin FluentValidation.
6. **JWT en rutas admin.** Todo endpoint marcado ✅ en specs lleva `[Authorize]`.
7. **Mensajes en español.** Todos los mensajes al usuario van en español costarricense, tono cálido.

---

## Orden de Implementación

```
Módulo 0: Setup del proyecto
  → Solución .NET (4 proyectos) + React app (Vite) + estructura de carpetas
  → SUBAGENTES: backend setup ‖ frontend setup (en paralelo)
         ↓
Módulo 1: Clean Architecture base
  → Domain, Application, Infrastructure, WebAPI vacíos con referencias correctas
         ↓
Módulo 2: Base de datos + EF Core
  → AppDbContext, todas las entidades, migración inicial, seed del admin
         ↓
Módulo 3: Autenticación
  → Login, JWT, recuperación de contraseña por email, PrivateRoute
         ↓
Módulo 4: Gestión de Contactos/Donantes
  → Formulario público + CRUD admin
         ↓
Módulo 5: Gestión de Actividades
  → CRUD admin + endpoint público para el sitio
         ↓
Módulo 6: Estudio Socioeconómico
  → CRUD completo (entidades complejas)
  → SUBAGENTES: backend ‖ frontend (en paralelo)
         ↓
Módulo 7: Panel Admin + Dashboard
  → AdminLayout, sidebar, stats cards, rutas protegidas
         ↓
Módulo 8: Sitio público completo
  → Home, Nosotros, Actividades (dinámico), Contacto, Navbar, Footer
         ↓
Módulo 9: Gestión de Usuarios Admin
  → CRUD de admins (solo SuperAdmin)
         ↓
Módulo 10: CI/CD
  → GitHub Actions (ci.yml + release.yml) + Security Review
```

---

## Estructura de Carpetas Esperada

```
vellon/
├── backend/
│   ├── Vellon.sln
│   ├── Vellon.Domain/
│   ├── Vellon.Application/
│   ├── Vellon.Infrastructure/
│   └── Vellon.WebAPI/
├── frontend/
│   └── vellon-web/
├── specs/
├── skills/
├── .github/workflows/
├── CLAUDE.md
└── README.md
```

---

## Comandos de Setup

```bash
# Backend
dotnet new sln -n Vellon
dotnet new classlib -n Vellon.Domain
dotnet new classlib -n Vellon.Application
dotnet new classlib -n Vellon.Infrastructure
dotnet new webapi -n Vellon.WebAPI
dotnet sln add Vellon.Domain Vellon.Application Vellon.Infrastructure Vellon.WebAPI
dotnet add Vellon.Application reference Vellon.Domain
dotnet add Vellon.Infrastructure reference Vellon.Application
dotnet add Vellon.WebAPI reference Vellon.Application
dotnet add Vellon.WebAPI reference Vellon.Infrastructure

# Frontend
npm create vite@latest vellon-web -- --template react-ts
cd vellon-web && npm install
npm install react-router-dom axios react-hook-form

# EF Core migrations
dotnet ef migrations add InitialCreate --project Vellon.Infrastructure --startup-project Vellon.WebAPI
dotnet ef database update --project Vellon.Infrastructure --startup-project Vellon.WebAPI
```

---

## Convenciones de Código

- **Idioma del código:** inglés (entidades, variables, métodos)
- **Idioma de mensajes al usuario:** español
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
- **Branches:** `feat/nombre-modulo` → PR → merge a `main`
- **Endpoints:** plural, kebab-case (`/api/contact-records`, `/api/activities`)
- **Componentes React:** PascalCase, un componente por archivo

---

## Testing — Prioridades

| Prioridad | Qué testear |
|-----------|------------|
| 🔴 Crítico | Auth: login válido, login inválido, token expirado |
| 🔴 Crítico | Activities: endpoint público solo retorna activas |
| 🔴 Crítico | ContactRecord: crear con datos válidos e inválidos |
| 🔴 Crítico | PrivateRoute: redirige si no hay token |
| 🟡 Importante | Validaciones FluentValidation de cada módulo |
| 🟢 Delegar a IA | Happy path de helpers y utilidades |
