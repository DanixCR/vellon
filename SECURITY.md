# Auditoría de seguridad — Vellon

Fecha: 2026-09-02
Alcance: backend (`Vellon.Domain/Application/Infrastructure/WebAPI`) y frontend (`vellon-web`).
Basado en la checklist de `specs/07-ai-tooling.md` (sección Security Review) y en las reglas de `specs/CLAUDE.md`.

Este documento es el reporte de referencia; se actualiza cada vez que se repite la auditoría.

---

## 1. Autenticación y JWT

| Pregunta | Resultado |
|---|---|
| ¿`SecretKey` es el placeholder? | 🔴 Sí, en `appsettings.json` (correcto para dev). **Corregido**: `Program.cs` ahora falla al arrancar en `Production` si detecta el placeholder o una clave de menos de 32 caracteres. |
| ¿Endpoints admin con `[Authorize]`? | ✅ Sí, en todos los controllers. Los únicos endpoints públicos (`POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /contact-records`, `POST /volunteers`, `GET /activities/public`) lo son a propósito, según el spec. |
| ¿El JWT tiene expiración? | ✅ Sí — `JwtSettings:ExpirationHours = 8`, validado con `ValidateLifetime = true` en `Program.cs`. |
| ¿El reset de contraseña invalida el token tras usarlo? | ✅ Sí — `AuthService.ResetPasswordAsync` marca `resetToken.IsUsed = true` después de aplicar el cambio. |

## 2. Base de datos

| Pregunta | Resultado |
|---|---|
| ¿Riesgo de SQL Injection? | ✅ No — toda la capa de datos usa EF Core con LINQ; no hay `FromSqlRaw`/`ExecuteSqlRaw` en el proyecto. |
| ¿Las migraciones exponen datos sensibles? | ✅ No — el seed del admin (`InitialCreate`/`FixAdminSeed`) guarda un hash BCrypt, nunca la contraseña en texto plano. |
| ¿Connection string con credenciales hardcodeadas? | 🟡 No tiene usuario/contraseña (usa `Trusted_Connection`), pero exponía el nombre de la PC del desarrollador (`BLACKDRAGONPC\SQLEXPRESS`). **Corregido**: generalizado a `localhost\SQLEXPRESS` en la plantilla `appsettings.json`. |

## 3. CORS

| Pregunta | Resultado |
|---|---|
| ¿CORS configurado correctamente para producción? | 🟡 Antes: origen fijo a `http://localhost:5173`, hubiera bloqueado el frontend real en producción. **Corregido**: ahora lee `AppSettings:FrontendUrl` de configuración (con ese mismo localhost como fallback). |
| ¿Hay `AllowAnyOrigin()`? | ✅ No, en ningún lado del proyecto. |

## 4. Validaciones

| Pregunta | Resultado |
|---|---|
| ¿Todos los POST/PUT tienen FluentValidation? | 🔴 Faltaban 3: `ResetPasswordDto` (sin ningún validador — el spec exige mínimo 8 caracteres y 1 número, pero se aceptaba cualquier string), `UpdateVolunteerDto` y `UpdateProjectDto`. **Corregido**: se agregaron `ResetPasswordValidator`, `UpdateVolunteerValidator`, `UpdateProjectValidator`, y de paso `ForgotPasswordValidator` y `LoginRequestValidator` para dejar el 100% de los endpoints con body cubiertos. Se auto-registran vía el scan de ensamblado ya existente en `Program.cs` (`AddValidatorsFromAssemblyContaining<CreateContactRecordValidator>()`). |
| ¿Los DTOs públicos exponen campos sensibles? | ✅ No — ningún DTO de respuesta incluye `PasswordHash` (verificado con grep sobre `Vellon.Application/DTOs`). |

## 5. Datos sensibles

| Pregunta | Resultado |
|---|---|
| ¿`appsettings.json` en `.gitignore`? | 🔴 Ni `appsettings.json` ni `appsettings.Development.json` estaban ignorados, y el segundo **ya estaba trackeado** en git — pese a que el README instruye a poner ahí el `SecretKey` y `SmtpPassword` reales. **Corregido**: `.gitignore` ahora excluye `appsettings.Development.json` / `.Local.json` / `.Production.json`; se destrackeó el archivo (quedó en disco, solo dejó de versionarse — no tenía secretos reales al momento del cambio). `appsettings.json` se mantiene trackeado como plantilla con placeholders, que es la convención estándar de ASP.NET Core. |
| ¿API keys o secrets hardcodeados en código? | ✅ No — se buscaron patrones de claves (`sk-`, `AIza`, `AKIA`, contraseñas entre comillas, etc.) en todo `backend/` sin resultados. |
| ¿`PasswordHash` se retorna en algún DTO? | ✅ No, en ningún DTO de respuesta. |

## 6. Frontend

| Pregunta | Resultado |
|---|---|
| ¿El JWT se maneja de forma segura? | 🟡 Se guarda en `localStorage` (`AuthContext.tsx`) y se adjunta como `Bearer` en `services/api.ts`, con un interceptor que limpia la sesión y redirige a `/login` ante un 401. Es el patrón estándar para SPAs con JWT Bearer, pero es legible por un ataque XSS. Migrar a cookies `httpOnly` es un cambio de arquitectura mayor (CSRF, `SameSite`, reescribir el flujo de login) — **queda como recomendación**, no se implementó en esta auditoría. |
| ¿Las rutas admin están protegidas con `PrivateRoute`? | ✅ Sí — en `App.tsx`, todas las rutas `/admin/*` (incluida `/admin/users`) están anidadas dentro de `<Route element={<PrivateRoute />}>`. |

---

## Cambios aplicados en esta auditoría

- `.gitignore`: excluye `appsettings.{Development,Local,Production}.json`.
- `backend/Vellon.WebAPI/appsettings.Development.json`: destrackeado de git (permanece en disco).
- `backend/Vellon.WebAPI/appsettings.json`: connection string genérica (sin nombre de PC personal).
- `backend/Vellon.WebAPI/Program.cs`: guardia fail-fast del `SecretKey` en `Production`; CORS lee `AppSettings:FrontendUrl`.
- `backend/Vellon.Application/Validators/`: `ResetPasswordValidator`, `ForgotPasswordValidator`, `LoginRequestValidator`, `UpdateVolunteerValidator`, `UpdateProjectValidator`.
- `README.md`: nota sobre `appsettings.Development.json` en `.gitignore` + sección "⚠️ Antes de producción".

## Recomendaciones pendientes (requieren decisión de producto/arquitectura, no se tocaron)

1. **Rotar credenciales del admin semilla** (`admin` / `Admin123!`) antes de cualquier despliegue real — están documentadas en texto plano en el README para facilitar el onboarding local.
2. **JWT en `localStorage`** — considerar cookies `httpOnly` + `SameSite` si en algún momento el riesgo de XSS se vuelve una preocupación concreta (ej. si se agrega contenido de terceros o HTML no sanitizado al panel).
3. **`AdminController`** verifica `IsSuperAdmin()` manualmente en cada acción (hoy correcto en las 6, pero frágil para futuros endpoints). Considerar migrar a `[Authorize(Policy = "SuperAdmin")]` con una policy centralizada.

---

## Ronda 2 — 2026-09-02: cambios de Voluntariado/Proyectos/Socioeconómico/Donaciones

Auditoría enfocada en el diff que agregó `Volunteer.Age`, expuso 4 campos de habilidades ya existentes en el backend, agregó "Estado"/"Fecha de registro" al form de Proyectos, un total calculado en Socioeconómico, y la sección pública "Cómo donar" (`DonationInfo.tsx`).

| # | Punto | Resultado |
|---|---|---|
| 1 | `DonationInfo.tsx` — XSS en números de cuenta | ✅ Sin riesgo. `ACCOUNTS` es un array hardcodeado en el propio archivo (no viene de API ni de input de usuario), se renderiza con `{account.value}` — interpolación JSX que React escapa automáticamente. No hay `dangerouslySetInnerHTML` en el archivo. |
| 2 | `VolunteerPage.tsx` — validación de campos nuevos | 🟡 `age` solo tenía el atributo HTML `min={0}`, sin regla de `react-hook-form` ni mensaje de error, y no coincidía con el rango real del backend (1-120). **Corregido**: se agregaron reglas `min`/`max` (1-120) con mensaje inline, igual patrón que el resto del formulario. Los otros campos nuevos (`previousVolunteerExperience`, `educationLevel`, `languages`, `expectedContribution`) son texto libre opcional, consistente con `otherSkills`/`currentOccupation` ya existentes — sin cambios ahí. |
| 3 | `SocioeconomicFormPage.tsx` — total manipulable | ✅ Sin riesgo. `CreateSocioeconomicStudyDto`/`UpdateSocioeconomicStudyDto` no tienen ningún campo `TotalExpenses` — el total del formulario es una vista derivada puramente en el cliente (suma de los mismos campos que ya se envían), nunca se transmite como valor independiente. El backend recalcula el total de forma autónoma en `SocioeconomicStudyService.MapToSummaryDto` sumando los campos persistidos. |
| 4 | `ProjectFormPage.tsx` — `[Authorize]` en PATCH status | ✅ Confirmado. `ProjectController` tiene `[Authorize]` a nivel de clase, sin `[AllowAnonymous]` en ninguna acción — cubre `PATCH /api/projects/{id}/status` igual que el resto. |
| 5 | Campos nuevos de `Volunteer` cubiertos por FluentValidation | 🟡 `Age` (el único campo realmente nuevo) ya estaba cubierto (`InclusiveBetween(1,120)`). Pero los 4 campos que esta sesión expuso por primera vez en el formulario **público sin autenticación** (`PreviousVolunteerExperience`, `EducationLevel`, `Languages`, `ExpectedContribution`) mapeaban a columnas `nvarchar(max)` sin ningún `MaximumLength` — antes solo eran alcanzables vía API directa, ahora cualquiera puede mandar texto arbitrariamente largo por un input público real (riesgo de bloat de almacenamiento / DoS barato). **Corregido**: se agregó `MaximumLength` a los 4 campos en `CreateVolunteerValidator`/`UpdateVolunteerValidator` (500 caracteres para los 3 campos cortos, 1000 para `ExpectedContribution` por ser la pregunta gemela de `Motivation`). |
| 6 | Migración `AddVolunteerAge` — datos sensibles | ✅ Limpia. Solo `AddColumn<int>("Age", "Volunteers", nullable: true)` / `DropColumn` simétrico. Sin seed data, sin PII, sin secretos. |

### Cambios aplicados en esta ronda
- `frontend/vellon-web/src/pages/public/VolunteerPage.tsx`: validación `min`/`max` (1-120) en el campo `age`.
- `backend/Vellon.Application/Validators/CreateVolunteerValidator.cs` y `UpdateVolunteerValidator.cs`: `MaximumLength` en `PreviousVolunteerExperience`, `EducationLevel`, `Languages` (500) y `ExpectedContribution` (1000).
- `backend/Vellon.Tests/Services/VolunteerServiceTests.cs`: nuevo test `CreateAsync_MapsAgeCorrectly`.
- `backend/Vellon.Tests/Services/VolunteerValidatorTests.cs` (nuevo archivo): cobertura del rango de `Age` (1-120) en `CreateVolunteerValidator`, incluyendo el caso `null` (opcional).
