# 09 — Módulo: Actividades

## Descripción
Las actividades son el puente entre el panel admin y el sitio público. El admin las crea y gestiona desde el panel; el sitio público las muestra dinámicamente. Este módulo cierra el ciclo público ↔ sistema.

## Flujo

```
Admin crea/edita actividad en el panel
           ↓
Se guarda en la BD (Activities)
           ↓
Sitio público consulta GET /api/activities/public
           ↓
La actividad aparece visible para cualquier visitante
```

---

## Entidad — Activity

```csharp
public class Activity : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime ActivityDate { get; set; }      // Fecha del evento
    public string? ImageUrl { get; set; }           // URL de imagen (opcional)
    public bool IsActive { get; set; }              // true = visible en sitio público
}
```

---

## Tabla en BD

```sql
CREATE TABLE Activities (
    Id              INT PRIMARY KEY IDENTITY,
    Title           NVARCHAR(150) NOT NULL,
    Description     NVARCHAR(1000) NOT NULL,
    ActivityDate    DATETIME2 NOT NULL,
    ImageUrl        NVARCHAR(500),
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

---

## DTOs

```csharp
// Para el sitio público (sin datos de auditoría)
public record ActivityPublicDto(
    int Id,
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl
);

// Para el panel admin (con todos los datos)
public record ActivityAdminDto(
    int Id,
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt
);

// Para crear/editar
public record CreateActivityDto(
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl,
    bool IsActive
);

public record UpdateActivityDto(
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl,
    bool IsActive
);
```

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/activities/public` | ❌ | Listar actividades activas (sitio público) |
| GET | `/api/activities` | ✅ | Listar todas (admin, incluye inactivas) |
| GET | `/api/activities/{id}` | ✅ | Ver detalle (admin) |
| POST | `/api/activities` | ✅ | Crear actividad |
| PUT | `/api/activities/{id}` | ✅ | Editar actividad |
| PATCH | `/api/activities/{id}/toggle` | ✅ | Activar / desactivar |
| DELETE | `/api/activities/{id}` | ✅ | Eliminar actividad |

### Lógica de `/api/activities/public`

```csharp
// Solo retorna IsActive = true, ordenadas por fecha descendente
var activities = await _repo.GetAllAsync(
    filter: a => a.IsActive,
    orderBy: a => a.ActivityDate,
    descending: true
);
```

---

## Validaciones (FluentValidation)

```csharp
public class CreateActivityValidator : AbstractValidator<CreateActivityDto>
{
    public CreateActivityValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.ActivityDate).NotEmpty();
        RuleFor(x => x.ImageUrl).MaximumLength(500).When(x => x.ImageUrl != null);
    }
}
```

---

## Vista Pública — `/actividades`

Cards con:
- Imagen (si tiene) o placeholder con logo de la fundación
- Título de la actividad
- Descripción (máximo 3 líneas con truncado)
- Fecha formateada en español: "15 de mayo, 2026"

Layout: grid de 3 columnas en desktop, 1 en móvil.

### En HomePage — últimas 3 actividades

```tsx
// Llama al mismo endpoint pero limita a 3
GET /api/activities/public?limit=3
```

---

## Vista Admin — Lista de Actividades

Tabla con columnas:
- Título
- Fecha
- Estado (badge: Activa / Inactiva)
- Acciones: Editar | Toggle | Eliminar

Botón "Nueva actividad" en la parte superior.

Toggle de estado visible directamente en la tabla — el admin puede activar/desactivar sin abrir el formulario.

## Vista Admin — Formulario (Crear / Editar)

Campos:
- Título (text, requerido)
- Descripción (textarea, requerido)
- Fecha del evento (date picker, requerido)
- URL de imagen (text, opcional)
- Visible en sitio público (checkbox/toggle)

Preview de la imagen si se ingresa una URL válida.

---

## Notas

- En v1 la imagen es una URL externa (no se sube archivo al servidor)
- En versiones futuras se puede agregar upload con Azure Blob Storage
- Si `IsActive = false`, la actividad NO aparece en el sitio público pero sí en el panel admin
- El toggle es un PATCH rápido — no requiere abrir el formulario completo
