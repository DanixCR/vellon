# 03 — Autenticación + Gestión de Usuarios Admin (ACTUALIZADO)

## Descripción
Módulo de autenticación completo con:
- Login con credenciales (sin registro público)
- Recuperación de contraseña por correo electrónico
- Gestión de usuarios administrativos (CRUD desde el panel)

---

## Flujo Completo del Login

```
[Sitio público]
      ↓
Usuario hace clic en "Personal administrativo" (link discreto en navbar/footer)
      ↓
Pantalla de login → ingresa Username + Password
      ↓
POST /api/auth/login
      ↓
¿Credenciales válidas?
  ✅ Sí → JWT generado → redirigir a /admin/dashboard
  ❌ No → mostrar "Las credenciales ingresadas no son correctas."
```

---

## Flujo de Recuperación de Contraseña

```
Login → clic en "¿Olvidaste tu contraseña?"
      ↓
Pantalla: ingresar correo electrónico
      ↓
POST /api/auth/forgot-password
      ↓
Sistema busca admin con ese email
  ✅ Encontrado → genera token único (GUID) con expiración 1 hora
               → guarda token hasheado en BD
               → envía email con link: https://tudominio.com/reset-password?token=XXX
               → muestra "Si el correo existe, recibirás un enlace."
  ❌ No encontrado → MISMO MENSAJE (no revelar si el email existe)
      ↓
Admin recibe email → clic en link
      ↓
Pantalla: ingresar nueva contraseña + confirmar
      ↓
POST /api/auth/reset-password
      ↓
Sistema verifica token (válido + no expirado + no usado)
  ✅ Válido → hashea nueva contraseña → guarda → invalida token → redirigir a login
  ❌ Inválido/expirado → "Este enlace no es válido o ha expirado."
```

---

## Entidades

### Admin

```csharp
public class Admin : BaseEntity
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string FullName { get; set; }
    public bool IsActive { get; set; }
    public bool IsSuperAdmin { get; set; }
    public ICollection<PasswordResetToken> ResetTokens { get; set; }
}
```

### PasswordResetToken

```csharp
public class PasswordResetToken : BaseEntity
{
    public int AdminId { get; set; }
    public Admin Admin { get; set; }
    public string TokenHash { get; set; }    // SHA256 del token enviado por email
    public DateTime ExpiresAt { get; set; }  // Now + 1 hora
    public bool IsUsed { get; set; }
}
```

---

## Tablas en BD

```sql
CREATE TABLE Admins (
    Id              INT PRIMARY KEY IDENTITY,
    Username        NVARCHAR(50) NOT NULL UNIQUE,
    Email           NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(256) NOT NULL,
    FullName        NVARCHAR(100) NOT NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    IsSuperAdmin    BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE PasswordResetTokens (
    Id          INT PRIMARY KEY IDENTITY,
    AdminId     INT NOT NULL REFERENCES Admins(Id) ON DELETE CASCADE,
    TokenHash   NVARCHAR(256) NOT NULL,
    ExpiresAt   DATETIME2 NOT NULL,
    IsUsed      BIT NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt   DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

## Seed Inicial

```csharp
modelBuilder.Entity<Admin>().HasData(new Admin
{
    Id = 1,
    Username = "admin",
    Email = "fundacionovejitas@gmail.com",
    PasswordHash = "$2a$11$HASH_PRECALCULADO",
    FullName = "Administrador General",
    IsActive = true,
    IsSuperAdmin = true,
    CreatedAt = DateTime.UtcNow,
    UpdatedAt = DateTime.UtcNow
});
```

---

## DTOs

```csharp
public record LoginRequestDto(string Username, string Password);
public record LoginResponseDto(string Token, string FullName, bool IsSuperAdmin, DateTime ExpiresAt);
public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string Token, string NewPassword, string ConfirmPassword);
public record CreateAdminDto(string Username, string Email, string FullName, string Password);
public record UpdateAdminDto(string Email, string FullName, bool IsActive);
public record AdminResponseDto(int Id, string Username, string Email, string FullName, bool IsActive, bool IsSuperAdmin, DateTime CreatedAt);
```

---

## Endpoints de Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login, retorna JWT |
| POST | `/api/auth/forgot-password` | ❌ | Envía email con link de recuperación |
| POST | `/api/auth/reset-password` | ❌ | Restablece contraseña con token |
| GET | `/api/auth/me` | ✅ | Info del admin logueado |

## Endpoints de Gestión de Admins (solo SuperAdmin)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/admins` | ✅ SuperAdmin | Listar todos los admins |
| POST | `/api/admins` | ✅ SuperAdmin | Crear nuevo admin |
| PUT | `/api/admins/{id}` | ✅ SuperAdmin | Editar admin |
| PATCH | `/api/admins/{id}/toggle-active` | ✅ SuperAdmin | Activar/desactivar |
| DELETE | `/api/admins/{id}` | ✅ SuperAdmin | Eliminar admin |

**Reglas:**
- Un admin no puede eliminarse a sí mismo
- El admin con Id=1 (superadmin original) no puede ser eliminado

---

## Servicio de Email

```json
// appsettings.json
"EmailSettings": {
  "FromEmail": "fundacionovejitas@gmail.com",
  "FromName": "Fundación Ovejitas",
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": 587,
  "SmtpUser": "fundacionovejitas@gmail.com",
  "SmtpPassword": "GOOGLE_APP_PASSWORD"
}
```

Template del email:
```
Asunto: Recuperación de contraseña — Fundación Ovejitas

Hola [NombreAdmin],

Recibimos una solicitud para restablecer tu contraseña.

[RESTABLECER CONTRASEÑA] → https://tudominio.com/reset-password?token=XXX

Este enlace es válido por 1 hora. Si no solicitaste este cambio, ignora este correo.

— Fundación Ovejitas de Costa Rica
```

---

## Frontend — Pantallas

### `/login`
- Card centrada con logo de la fundación
- Campos: Username + Password
- Botón "Ingresar" pill celeste
- Link: "¿Olvidaste tu contraseña?" → `/forgot-password`

### `/forgot-password`
- Campo email
- Botón "Enviar enlace"
- Mensaje neutral al enviar (no revela si el email existe)

### `/reset-password?token=XXX`
- Campo nueva contraseña + confirmar contraseña
- Validación: mínimo 8 caracteres, al menos 1 número
- Botón "Cambiar contraseña"

### `/admin/users` (solo visible si IsSuperAdmin)
- Tabla: Nombre | Email | Estado | Acciones
- Botón "Nuevo administrador"
- Toggle activar/desactivar
- Botón eliminar con ConfirmDialog

---

## Dependencias Backend

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package MailKit
```
