# 04 — Módulo: Donantes / Contacto

## Descripción
Formulario público para capturar datos de personas interesadas en donar o colaborar. El admin puede consultar, ver detalle y eliminar registros desde el panel.

## Entidad — ContactRecord

```csharp
// Domain/Entities/ContactRecord.cs
public class ContactRecord : BaseEntity
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Message { get; set; }         // Mensaje o motivo de contacto
    public ContactType Type { get; set; }       // Donante | Voluntario | Información
    public bool IsRead { get; set; }            // El admin lo marcó como leído
}

public enum ContactType { Donante, Voluntario, Información }
```

## Tabla en BD

```sql
CREATE TABLE ContactRecords (
    Id          INT PRIMARY KEY IDENTITY,
    FullName    NVARCHAR(100) NOT NULL,
    Email       NVARCHAR(100) NOT NULL,
    Phone       NVARCHAR(20),
    Message     NVARCHAR(500),
    Type        INT NOT NULL DEFAULT 0,
    IsRead      BIT NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt   DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

## DTOs

```csharp
// CreateContactRecordDto — usado en formulario público
public record CreateContactRecordDto(
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    ContactType Type
);

// ContactRecordResponseDto — retornado al admin
public record ContactRecordResponseDto(
    int Id,
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    string Type,
    bool IsRead,
    DateTime CreatedAt
);
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/contact-records` | ❌ | Crear registro desde formulario público |
| GET | `/api/contact-records` | ✅ | Listar todos los registros |
| GET | `/api/contact-records/{id}` | ✅ | Ver detalle de un registro |
| PATCH | `/api/contact-records/{id}/read` | ✅ | Marcar como leído |
| DELETE | `/api/contact-records/{id}` | ✅ | Eliminar registro |

## Validaciones (FluentValidation)

```csharp
public class CreateContactRecordValidator : AbstractValidator<CreateContactRecordDto>
{
    public CreateContactRecordValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Phone).MaximumLength(20);
        RuleFor(x => x.Message).MaximumLength(500);
    }
}
```

## Formulario Público (React)

Campos visibles en `/contacto`:

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Nombre completo | text | ✅ |
| Correo electrónico | email | ✅ |
| Teléfono | tel | ❌ |
| Tipo de contacto | select (Donante/Voluntario/Información) | ✅ |
| Mensaje | textarea | ❌ |

## Vista Admin — Lista de Contactos

- Tabla con columnas: Nombre | Email | Tipo | Fecha | Estado (leído/no leído) | Acciones
- Filtro por tipo y por estado
- Botón "Ver detalle"
- Botón "Eliminar" con confirmación
- Badge visual para registros no leídos
