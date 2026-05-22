# 07 — AI Tooling Stack (Curso BIG school + Gentleman Programming)

## Resumen
Este spec define las herramientas de IA que se integran al flujo de desarrollo de Ovejitas,
basado en el stack cognitivo completo del curso "De 0 a Producción".

---

## 1. CLAUDE.md (ya existe) → Reglas del Agente

El archivo `CLAUDE.md` en la raíz del proyecto actúa como **system prompt persistente** para Claude Code.
Sigue la filosofía AGENT.md del curso: máximo ~500 líneas, sin ruido innecesario.

Incluye:
- Stack tecnológico del proyecto
- Convenciones de código (Clean Architecture, naming, idioma)
- Flujo de trabajo: spec → código → commit
- Prohibiciones (no inventar requisitos, no tocar entidades sin spec)
- Estilo de commits (Conventional Commits: `feat:`, `fix:`, `chore:`)
- Testing: qué testear y cómo

---

## 2. Skills Registry — Carga Modular de Contexto

En lugar de un CLAUDE.md monolítico con 1000+ líneas, se usan **Skills modulares** que Claude Code carga solo cuando los necesita.

### Estructura

```
/skills/
├── SKILL.md                    ← Router: detecta la tarea y carga el skill correcto
├── clean-architecture/
│   └── SKILL.md                ← Reglas de Clean Architecture para .NET
├── react-frontend/
│   └── SKILL.md                ← Convenciones de React + TypeScript
├── ef-core/
│   └── SKILL.md                ← Patrones de EF Core 10, migraciones, repos
├── jwt-auth/
│   └── SKILL.md                ← Flujo JWT, BCrypt, claims estándar
├── testing/
│   └── SKILL.md                ← Qué testear, cómo escribir tests en xUnit/Jest
└── git-workflow/
    └── SKILL.md                ← Conventional Commits, PR, branch strategy
```

### Ventaja
- Claude Code carga ~200 líneas relevantes en lugar de 1000+ siempre
- Contexto limpio → respuestas más precisas → menos alucinaciones

---

## 3. MCP — Model Context Protocol

Servidores MCP que extienden las capacidades de Claude Code en el proyecto.

### MCPs recomendados para Ovejitas

| MCP | Propósito | Uso en el proyecto |
|-----|-----------|-------------------|
| **GitHub MCP** | Leer/crear PRs, issues, branches | Crear PRs desde terminal, ver issues |
| **SQLite/SQL Server MCP** | Consultar BD directamente | Verificar migraciones, consultar datos |
| **Filesystem MCP** | Acceso a archivos del proyecto | Leer specs antes de codificar |

### Configuración (claude_code_config.json)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "TU_TOKEN" }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/ruta/al/proyecto"]
    }
  }
}
```

---

## 4. Plan Mode — Para Tareas Grandes

Antes de ejecutar módulos grandes (ej. Módulo Socioeconómico completo), usar **Plan Mode** en Claude Code:

```
> Antes de codificar, muéstrame el plan completo de lo que vas a crear para el módulo de Estudio Socioeconómico. No escribas código aún.
```

Claude Code genera el plan → tú lo revisás → aprobás → ejecuta.

**Cuándo usarlo en Ovejitas:**
- Setup inicial del proyecto (Clean Architecture desde cero)
- Módulo Estudio Socioeconómico (formulario complejo)
- Configuración del CI/CD

---

## 5. Engram — Memoria Persistente

Sistema de memoria entre sesiones de Claude Code para no perder contexto entre días de trabajo.

**Repo:** https://github.com/Gentleman-Programming/engram

### Qué guardar en Engram para Ovejitas

```
what: Implementé módulo ContactRecord completo
why: Era el primer módulo del panel admin
where: backend/OvejitasFoundation.WebAPI/Controllers/ContactRecordController.cs
learned: FluentValidation requiere registrarse antes de AddControllers() en Program.cs

what: Configuré JWT con BCrypt
why: El seed del admin necesita hash en la migración inicial
where: backend/OvejitasFoundation.Infrastructure/Security/JwtTokenGenerator.cs
learned: BCrypt.HashPassword() en HasData() no es determinístico, usar hash precalculado
```

---

## 6. Agent Teams Lite — Orquestación Multi-Agente

Para el módulo más complejo (Estudio Socioeconómico + Panel Admin), usar **Agent Teams Lite** para ejecutar en paralelo.

**Repo:** https://github.com/Gentleman-Programming/agent-teams-lite

### Pipeline SDD para un módulo

```
Explorer → Proposer → [Human Gate ✅] → Spec Writer + Designer (paralelo) → merge
    ↓
Task Planner → Implementer → [Human Gate ✅] → Verifier → Archiver
```

### Agentes para Ovejitas (Nivel 1 — básico, usando task tool nativo)

```
Orquestador principal
├── Sub-agente: Backend (genera entidades + EF Core + repos + services + controller)
└── Sub-agente: Frontend (genera páginas React + servicios axios + formularios)
```

---

## 7. Human in the Loop (HITL)

**Puntos de aprobación obligatorios en el proyecto:**

| Punto | Qué aprobar |
|-------|------------|
| Después de Plan Mode | El plan del agente antes de ejecutar |
| Después de cada módulo | Revisar código generado antes de commit |
| Antes de merge a main | PR review con CI pasando |
| Antes de deploy | Verificar que todos los tests pasan |

---

## 8. CI/CD con GitHub Actions

### Workflows a configurar

```
.github/workflows/
├── ci.yml              ← Se ejecuta en cada PR
└── release.yml         ← Se ejecuta al hacer merge en main
```

### ci.yml — Backend (.NET)

```yaml
name: CI Backend
on:
  pull_request:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - run: dotnet restore backend/
      - run: dotnet build backend/ --no-restore
      - run: dotnet test backend/ --no-build
```

### ci.yml — Frontend (React/Vite)

```yaml
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend/ovejitas-web && npm ci
      - run: cd frontend/ovejitas-web && npm run lint
      - run: cd frontend/ovejitas-web && npm run build
```

### Security Review con Claude (Anthropic Action oficial)

```yaml
# En ci.yml — agrega este job
  security-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-security-review@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

Detecta automáticamente en cada PR: SQL injection, auth débil, datos sensibles expuestos, XSS.

### Release Please — Versionado automático

```yaml
# release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
          token: ${{ secrets.GITHUB_TOKEN }}
```

Tras cada merge en main → crea Release PR automáticamente → al aprobar: tag vX.Y.Z + GitHub Release con notas generadas por IA.

---

## 9. Testing Strategy

Basado en el criterio del curso: **blindar el valor de negocio, no testearlo todo.**

### Backend (xUnit)

| Prioridad | Qué testear | Por qué |
|-----------|------------|---------|
| 🔴 Crítico | Auth: login válido, login inválido, JWT expirado | Seguridad |
| 🔴 Crítico | ContactRecord: crear, validar campos requeridos | Datos del negocio |
| 🔴 Crítico | SocioeconomicStudy: CRUD completo | Módulo principal |
| 🟡 Importante | Validaciones FluentValidation | Edge cases |
| 🟢 Delegar a IA | Happy path de helpers y utilidades | Bajo riesgo |

### Frontend (Vitest + React Testing Library)

| Prioridad | Qué testear |
|-----------|------------|
| 🔴 Crítico | Formulario de contacto: submit, validación, error |
| 🔴 Crítico | Login: credenciales inválidas bloquean acceso |
| 🔴 Crítico | PrivateRoute: redirige si no hay token |

---

## 10. Conventional Commits

Estándar de commits para que **Release Please** genere release notes automáticas.

```
feat: implementar módulo ContactRecord (backend + frontend)
feat: agregar CRUD estudio socioeconómico
fix: corregir validación de email en formulario público
chore: configurar GitHub Actions CI/CD
docs: actualizar specs con flujo de autenticación
test: agregar tests de integración para AuthService
```

---

## Flujo Completo de Desarrollo (por módulo)

```
1. Leer spec del módulo (/specs/0X-nombre.md)
      ↓
2. Plan Mode → Claude Code genera plan → Revisás → Aprobás
      ↓
3. Claude Code implementa (Skills Registry carga skills relevantes)
      ↓
4. Tests automáticos corren localmente
      ↓
5. Engram: guardar aprendizajes del módulo
      ↓
6. git add . && git commit -m "feat: [módulo]"
      ↓
7. git push → PR → GitHub Actions CI corre (lint + tests + security review)
      ↓
8. PR aprobado → merge a main → Release Please crea release PR
```
