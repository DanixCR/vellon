# 10 — Módulo: Voluntariado

## Descripción
Gestión de registros de voluntarios de la Fundación Ovejitas. El formulario de registro puede ser llenado desde el sitio público (sin login) o ingresado manualmente por el admin. El panel admin permite consultar, gestionar y dar seguimiento a los voluntarios.

---

## Flujo

```
[Opción A — Sitio público]
Visitante llena formulario en /voluntariado
           ↓
POST /api/volunteers (sin auth)
           ↓
Registro guardado en BD con estado "Pendiente"

[Opción B — Admin]
Admin ingresa registro manualmente desde el panel
           ↓
POST /api/volunteers (con auth)
           ↓
Registro guardado en BD
```

---

## Entidad — Volunteer

```csharp
public class Volunteer : BaseEntity
{
    // Datos personales
    public string FullName { get; set; }
    public string IdNumber { get; set; }              // Número de cédula
    public DateTime BirthDate { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }               // Provincia, cantón, distrito
    public string? CurrentOccupation { get; set; }

    // Disponibilidad
    public string AvailableDays { get; set; }         // JSON: ["Lunes","Martes",...]
    public string AvailableSchedule { get; set; }     // "Manana" | "Tarde" | "Ambos"
    public int? WeeklyHours { get; set; }
    public string? SpecialAvailability { get; set; }

    // Habilidades
    public string? Skills { get; set; }               // JSON: ["Educacion","Salud",...]
    public string? OtherSkills { get; set; }
    public string? PreviousVolunteerExperience { get; set; }
    public string? EducationLevel { get; set; }
    public string? Languages { get; set; }

    // Áreas de interés
    public string? InterestAreas { get; set; }        // JSON: ["Atencion directa","Logistica",...]
    public string? OtherInterestArea { get; set; }

    // Referencias
    public string? Reference1Name { get; set; }
    public string? Reference1Relation { get; set; }
    public string? Reference1Phone { get; set; }
    public string? Reference1Email { get; set; }
    public string? Reference2Name { get; set; }
    public string? Reference2Relation { get; set; }
    public string? Reference2Phone { get; set; }
    public string? Reference2Email { get; set; }

    // Motivación
    public string? Motivation { get; set; }
    public string? ExpectedContribution { get; set; }

    // Estado
    public VolunteerStatus Status { get; set; }       // Pendiente, Activo, Inactivo
    public string? AdminNotes { get; set; }           // Notas internas del admin
}

public enum VolunteerStatus { Pendiente, Activo, Inactivo }
```

---

## Tabla en BD

```sql
CREATE TABLE Volunteers (
    Id                          INT PRIMARY KEY IDENTITY,
    FullName                    NVARCHAR(100) NOT NULL,
    IdNumber                    NVARCHAR(20) NOT NULL,
    BirthDate                   DATE NOT NULL,
    Phone                       NVARCHAR(20) NOT NULL,
    Email                       NVARCHAR(100) NOT NULL,
    Address                     NVARCHAR(200),
    CurrentOccupation           NVARCHAR(100),
    AvailableDays               NVARCHAR(200),
    AvailableSchedule           NVARCHAR(50),
    WeeklyHours                 INT,
    SpecialAvailability         NVARCHAR(200),
    Skills                      NVARCHAR(500),
    OtherSkills                 NVARCHAR(200),
    PreviousVolunteerExperience NVARCHAR(500),
    EducationLevel              NVARCHAR(200),
    Languages                   NVARCHAR(200),
    InterestAreas               NVARCHAR(500),
    OtherInterestArea           NVARCHAR(200),
    Reference1Name              NVARCHAR(100),
    Reference1Relation          NVARCHAR(100),
    Reference1Phone             NVARCHAR(20),
    Reference1Email             NVARCHAR(100),
    Reference2Name              NVARCHAR(100),
    Reference2Relation          NVARCHAR(100),
    Reference2Phone             NVARCHAR(20),
    Reference2Email             NVARCHAR(100),
    Motivation                  NVARCHAR(1000),
    ExpectedContribution        NVARCHAR(500),
    Status                      INT NOT NULL DEFAULT 0,
    AdminNotes                  NVARCHAR(500),
    CreatedAt                   DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt                   DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

---

## DTOs

```csharp
// Formulario público y admin
public record CreateVolunteerDto(
    string FullName, string IdNumber, DateTime BirthDate,
    string Phone, string Email, string? Address, string? CurrentOccupation,
    string? AvailableDays, string? AvailableSchedule, int? WeeklyHours,
    string? SpecialAvailability, string? Skills, string? OtherSkills,
    string? PreviousVolunteerExperience, string? EducationLevel, string? Languages,
    string? InterestAreas, string? OtherInterestArea,
    string? Reference1Name, string? Reference1Relation, string? Reference1Phone, string? Reference1Email,
    string? Reference2Name, string? Reference2Relation, string? Reference2Phone, string? Reference2Email,
    string? Motivation, string? ExpectedContribution
);

public record VolunteerResponseDto(
    int Id, string FullName, string IdNumber, string Phone, string Email,
    string AvailableSchedule, string Status, DateTime CreatedAt
);

public record VolunteerDetailDto(
    int Id, string FullName, string IdNumber, DateTime BirthDate,
    string Phone, string Email, string? Address, string? CurrentOccupation,
    string? AvailableDays, string? AvailableSchedule, int? WeeklyHours,
    string? Skills, string? InterestAreas, string? Motivation,
    string? Reference1Name, string? Reference1Phone,
    string? Reference2Name, string? Reference2Phone,
    string Status, string? AdminNotes, DateTime CreatedAt
);

public record UpdateVolunteerStatusDto(VolunteerStatus Status, string? AdminNotes);
```

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/volunteers` | ❌ | Registrar voluntario (formulario público) |
| GET | `/api/volunteers` | ✅ | Listar todos los voluntarios |
| GET | `/api/volunteers/{id}` | ✅ | Ver detalle completo |
| PATCH | `/api/volunteers/{id}/status` | ✅ | Cambiar estado (Pendiente/Activo/Inactivo) |
| PUT | `/api/volunteers/{id}` | ✅ | Editar registro completo |
| DELETE | `/api/volunteers/{id}` | ✅ | Eliminar registro |

---

## Validaciones (FluentValidation)

```csharp
public class CreateVolunteerValidator : AbstractValidator<CreateVolunteerDto>
{
    public CreateVolunteerValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.IdNumber).NotEmpty().MaximumLength(20);
        RuleFor(x => x.BirthDate).NotEmpty().LessThan(DateTime.Today);
        RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Motivation).MaximumLength(1000);
    }
}
```

---

## Sitio Público — `/voluntariado`

Formulario basado en el documento Word aprobado por Jessica Ramos:
- Datos personales
- Disponibilidad: checkboxes de días + horario (solo Mañana / Tarde — sin noche)
- Habilidades con checkboxes
- Áreas de interés con checkboxes
- Referencias personales (2)
- Motivación (textarea)
- Mensaje de confirmación al enviar

---

## Panel Admin — Lista de Voluntarios

Tabla con columnas: Nombre | Cédula | Teléfono | Horario | Estado | Acciones

Filtros: por estado (Pendiente / Activo / Inactivo)

Badge de estado con colores:
- Pendiente → amarillo
- Activo → verde
- Inactivo → gris

Acciones: Ver detalle | Cambiar estado | Eliminar

---

## Navbar Pública — Actualización

Agregar link "Voluntariado" en la navbar pública:

```
Inicio | Nosotros | Actividades | Voluntariado | Contacto
```

---

## Notas

- El horario nocturno NO aplica para la fundación (confirmado por Jessica Ramos, coordinadora)
- El estado inicial de todo voluntario que se registre desde el sitio público es `Pendiente`
- El admin puede cambiar el estado desde el panel sin editar el registro completo
