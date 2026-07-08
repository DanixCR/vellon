# 🐑 Vellon

> Sistema web de la Fundación Ovejitas de Costa Rica — gestión de donantes, voluntarios, actividades, proyectos y estudios socioeconómicos. Desarrollado como TCU universitario en Universidad Fidélitas.

![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![EF Core](https://img.shields.io/badge/EF%20Core-10.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![MailKit](https://img.shields.io/badge/MailKit-Email-0B7CBD?style=for-the-badge&logo=maildotru&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-4%20capas-29ABE2?style=for-the-badge&logoColor=white)

---

## 📋 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Stack tecnológico](#-stack-tecnológico)
- [Instalación](#-instalación-local)
- [Variables de entorno](#-variables-de-entorno)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Créditos](#-créditos)

---

## 📌 Descripción

**Vellon** es el sistema web de la **Fundación Ovejitas de Costa Rica**, organización sin fines de lucro orientada al apoyo de familias en condición de vulnerabilidad. Centraliza la gestión de donantes, contactos, actividades, voluntarios, proyectos y estudios socioeconómicos bajo una arquitectura limpia y escalable.

El sistema tiene planificada la integración de un **sitio público generado con Google Stitch (IA)** para la difusión de actividades y captación de nuevos colaboradores, así como el despliegue en **Azure App Service + Azure SQL**.

---

## ✨ Características

### ✅ Implementado

| Módulo | Descripción |
|--------|-------------|
| 🔐 **Autenticación** | Login con JWT + BCrypt, recuperación de contraseña por email con MailKit y tokens de un uso |
| 📩 **Contactos / Donantes** | CRUD completo con estados de lectura (leído / no leído) y filtros por tipo |
| 🎯 **Actividades** | CRUD admin con toggle de visibilidad + endpoint público dinámico para el sitio web |
| 📋 **Estudio Socioeconómico** | CRUD completo con núcleo familiar, menaje del hogar e ingresos/gastos detallados |
| 👥 **Voluntariado** | Registro público + gestión admin con estados (Pendiente / Activo / Inactivo) |
| 📁 **Proyectos** | CRUD con cronograma de actividades, presupuesto por ítem y seguimiento por estado |
| 👤 **Usuarios Administrativos** | CRUD de admins con roles SuperAdmin / Admin, protegido por claim en JWT |
| ⚙️ **CI/CD** | GitHub Actions con build, test y security review automático con Claude (Anthropic) |

### 🔜 Próximamente

- 🌐 **Sitio público** — Diseño generado con Google Stitch (IA), páginas Home, Nosotros, Actividades y Contacto
- ☁️ **Deploy en Azure** — App Service + Azure SQL Database

---

## 🏛️ Arquitectura

Vellon implementa **Clean Architecture** con 4 capas. La regla fundamental es que las dependencias apuntan siempre **hacia adentro**: la capa exterior conoce a la interior, nunca al revés.

```
┌─────────────────────────────────────────────────┐
│                  Vellon.WebAPI                   │
│   Controllers · Middleware · Program.cs          │
│         (Capa de presentación / HTTP)            │
├─────────────────────────────────────────────────┤
│              Vellon.Infrastructure               │
│  EF Core · Repositories · JWT · BCrypt · Email  │
│         (Implementaciones concretas)             │
├─────────────────────────────────────────────────┤
│               Vellon.Application                 │
│    DTOs · Services · Validators · Exceptions    │
│    (Casos de uso — orquesta el dominio)          │
├─────────────────────────────────────────────────┤
│                 Vellon.Domain                    │
│        Entities · Interfaces · Common           │
│    (Corazón del negocio — sin dependencias)      │
└─────────────────────────────────────────────────┘

         vellon-web  (React + Vite + TypeScript)
         Axios · React Router v7 · React Hook Form
```

### ¿Por qué Clean Architecture?

- **Testabilidad** — `Domain` y `Application` son C# puro, testeables sin base de datos ni HTTP.
- **Intercambiabilidad** — Cambiar SQL Server por PostgreSQL solo toca `Infrastructure`.
- **Separación de responsabilidades** — Los controllers no tienen lógica de negocio; las entidades no saben de HTTP.

### Estructura de carpetas

```
vellon/
├── backend/
│   ├── Vellon.Domain/
│   │   ├── Entities/           # Modelos de dominio (Admin, Activity, Project…)
│   │   ├── Interfaces/         # Contratos (IRepository)
│   │   └── Common/             # BaseEntity
│   │
│   ├── Vellon.Application/
│   │   ├── DTOs/               # Objetos de transferencia por módulo
│   │   ├── Services/           # Lógica de negocio pura
│   │   ├── Validators/         # FluentValidation
│   │   └── Exceptions/         # NotFoundException, BadRequestException…
│   │
│   ├── Vellon.Infrastructure/
│   │   ├── Data/               # AppDbContext (EF Core)
│   │   ├── Repositories/       # Implementaciones de IRepository
│   │   ├── Migrations/         # Migraciones EF Core
│   │   ├── Security/           # JwtTokenGenerator, BCryptPasswordHasher
│   │   └── Email/              # EmailService (MailKit)
│   │
│   └── Vellon.WebAPI/
│       ├── Controllers/        # Endpoints HTTP por módulo
│       ├── Middleware/         # ExceptionHandlingMiddleware
│       └── Program.cs          # DI y configuración
│
└── frontend/
    └── vellon-web/             # React + Vite + TypeScript
        └── src/
            ├── pages/          # Páginas admin y auth
            ├── components/     # AdminLayout, StatCard, ConfirmDialog…
            ├── services/       # Clientes HTTP por módulo (Axios)
            ├── context/        # AuthContext
            └── styles/         # admin.css, auth.css
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | ASP.NET Core Web API | 10.0 |
| **ORM** | Entity Framework Core | 10.0 |
| **Base de datos** | SQL Server | 2022 |
| **Autenticación** | JWT + BCrypt | — |
| **Email** | MailKit (recuperación de contraseña) | — |
| **Validaciones** | FluentValidation | — |
| **Frontend** | React + Vite | 19.2 / 8.0 |
| **Lenguaje frontend** | TypeScript | 6.0 |
| **Routing** | React Router | v7 |
| **HTTP Client** | Axios | — |
| **Forms** | React Hook Form | v7 |
| **CI/CD** | GitHub Actions + Release Please | — |
| **Security Review** | Claude (Anthropic) | — |

---

## 🚀 Instalación local

### Prerrequisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/sql-server) (o SQL Server Express / Docker)
- [EF Core CLI](https://learn.microsoft.com/ef/core/cli/dotnet): `dotnet tool install --global dotnet-ef`

### 1. Clonar el repositorio

```bash
git clone https://github.com/DanixCR/vellon.git
cd vellon
```

### 2. Configurar el backend

Editá `backend/Vellon.WebAPI/appsettings.Development.json` con tu connection string, JWT secret y credenciales de email:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VellonDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "tu-clave-secreta-de-al-menos-32-caracteres",
    "Issuer": "Vellon",
    "Audience": "Vellon",
    "ExpirationHours": 8
  },
  "EmailSettings": {
    "FromEmail": "fundacionovejitas@gmail.com",
    "FromName": "Fundación Ovejitas",
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUser": "fundacionovejitas@gmail.com",
    "SmtpPassword": "TU_GOOGLE_APP_PASSWORD"
  }
}
```

### 3. Crear la base de datos

```bash
dotnet ef database update --project backend/Vellon.Infrastructure --startup-project backend/Vellon.WebAPI
```

> El seed inicial crea el usuario superadmin con usuario `admin` y contraseña `Admin123!`.

### 4. Iniciar el backend

```bash
dotnet run --project backend/Vellon.WebAPI
# API disponible en https://localhost:7xxx
# OpenAPI en https://localhost:7xxx/openapi
```

### 5. Instalar dependencias del frontend

```bash
cd frontend/vellon-web
npm install
```

### 6. Configurar la URL del backend

Creá o editá `frontend/vellon-web/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Iniciar el frontend

```bash
npm run dev
# App disponible en http://localhost:5173
# Panel admin en http://localhost:5173/login
```

---

## 🔧 Variables de entorno

### Backend (`appsettings.json`)

| Clave | Descripción |
|-------|-------------|
| `ConnectionStrings:DefaultConnection` | Cadena de conexión a SQL Server |
| `JwtSettings:SecretKey` | Clave secreta para firmar tokens JWT (mín. 32 caracteres) |
| `JwtSettings:Issuer` | Emisor del token |
| `JwtSettings:Audience` | Audiencia del token |
| `JwtSettings:ExpirationHours` | Duración del token en horas |
| `EmailSettings:FromEmail` | Dirección de correo del remitente |
| `EmailSettings:FromName` | Nombre del remitente |
| `EmailSettings:SmtpHost` | Host SMTP (ej. `smtp.gmail.com`) |
| `EmailSettings:SmtpPort` | Puerto SMTP (ej. `587`) |
| `EmailSettings:SmtpUser` | Usuario SMTP |
| `EmailSettings:SmtpPassword` | Contraseña SMTP (Google App Password) |

### Frontend (`.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del API backend |

---

## 📸 Screenshots

> 🚧 *Screenshots en construcción — se agregarán en la próxima versión del README.*

| Vista | Preview |
|-------|---------|
| Login | *(próximamente)* |
| Dashboard | *(próximamente)* |
| Contactos / Donantes | *(próximamente)* |
| Estudio Socioeconómico | *(próximamente)* |
| Proyectos | *(próximamente)* |

---

## 🗺️ Roadmap

### ✅ Fase 1 — Core Backend & Auth
- [x] Solución con Clean Architecture (4 capas)
- [x] Entity Framework Core 10 + SQL Server + migraciones
- [x] Autenticación JWT con BCrypt
- [x] Recuperación de contraseña por email (MailKit + tokens de un uso)
- [x] Seed inicial del superadmin
- [x] Middleware de manejo global de errores

### ✅ Fase 2 — Módulos de negocio
- [x] Módulo Contactos / Donantes (CRUD + estados de lectura)
- [x] Módulo Actividades (CRUD + toggle de visibilidad + endpoint público)
- [x] Módulo Estudio Socioeconómico (CRUD + núcleo familiar + menaje)
- [x] Módulo Voluntariado (registro público + gestión admin con estados)
- [x] Módulo Proyectos (CRUD + cronograma + presupuesto por ítem)
- [x] Panel administrativo React (AuthContext + AdminLayout + 14 páginas CRUD)
- [x] Gestión de Usuarios Administrativos (SuperAdmin / Admin)

### ✅ Fase 3 — CI/CD con GitHub Actions
- [x] `ci.yml` — build + test backend (.NET 10) en cada PR
- [x] `ci.yml` — lint + build frontend (Node 20) en cada PR
- [x] `ci.yml` — security review automático con Claude (Anthropic)
- [x] `release.yml` — Release Please para versionado automático en main

### 📋 Fase 4 — Sitio público con Google Stitch
- [ ] Diseño visual generado con Google Stitch (IA)
- [ ] Páginas públicas: Home, Nosotros, Actividades, Contacto, Voluntariado
- [ ] Formulario de contacto integrado con el backend
- [ ] Registro de voluntarios desde el sitio público

### ☁️ Fase 5 — Deploy en Azure
- [ ] Deploy backend en Azure App Service
- [ ] Azure SQL Database
- [ ] Deploy frontend en Azure Static Web Apps
- [ ] Variables de entorno en Azure Key Vault

---

## 🤝 Créditos

Este sistema fue desarrollado como **Trabajo Comunal Universitario (TCU)** en la Universidad Fidélitas, Ingeniería en Sistemas.

| Rol | Persona |
|-----|---------|
| **Desarrollador** | Daniel Eduardo Chaves Mora |
| **Universidad** | Universidad Fidélitas — Ingeniería en Sistemas |
| **Organización beneficiada** | Fundación Ovejitas de Costa Rica |
| **Coordinadora TCU** | Jessica Ramos Portillo |

---

## 📄 Licencia

MIT © [DanixCR](https://github.com/DanixCR)
