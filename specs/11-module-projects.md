# 11 — Módulo: Proyectos

## Descripción
Gestión interna de proyectos de la Fundación Ovejitas. Este módulo es exclusivamente administrativo — los proyectos no se muestran en el sitio público. El admin registra, actualiza y da seguimiento a los proyectos de la fundación.

---

## Flujo

```
Admin accede al panel → Gestión de Proyectos
           ↓
Crea / edita un proyecto con toda su información
           ↓
Registra actividades, presupuesto y cronograma
           ↓
Actualiza el estado conforme avanza el proyecto
           ↓
Archiva o elimina proyectos completados o cancelados
```

---

## Entidades

### Project (principal)

```csharp
public class Project : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string ProjectType { get; set; }           // Social, Educativo, Salud, Recreativo, Otro
    public ProjectStatus Status { get; set; }         // Planificado, EnCurso, Completado, Suspendido
    public DateTime StartDate { get; set; }
    public DateTime? EstimatedEndDate { get; set; }
    public string? Duration { get; set; }             // Ej: "3 meses", "6 semanas"
    public string? ActivityFrequency { get; set; }    // Semanal, mensual, única vez, etc.

    // Objetivos
    public string MainObjective { get; set; }
    public string? SpecificObjectives { get; set; }

    // Beneficiarios
    public string? TargetPopulation { get; set; }     // A quién va dirigido
    public int? EstimatedBeneficiaries { get; set; }
    public string? GeographicLocation { get; set; }
    public string? SelectionCriteria { get; set; }
    public string? PriorityPopulation { get; set; }   // JSON: ["Ninos","Familias",...]

    // Presupuesto
    public decimal? TotalBudget { get; set; }
    public bool HasFunding { get; set; }
    public string? FundingSource { get; set; }
    public string? AdditionalResources { get; set; }

    // Responsable
    public string ResponsibleName { get; set; }
    public string? ResponsibleRole { get; set; }
    public string? ResponsiblePhone { get; set; }
    public string? ResponsibleEmail { get; set; }
    public string? TeamMembers { get; set; }

    // Notas internas
    public string? AdminNotes { get; set; }

    // Relaciones
    public ICollection<ProjectActivity> Activities { get; set; }
    public ICollection<ProjectBudgetItem> BudgetItems { get; set; }
}

public enum ProjectStatus { Planificado, EnCurso, Completado, Suspendido }
```

### ProjectActivity (cronograma)

```csharp
public class ProjectActivity : BaseEntity
{
    public int ProjectId { get; set; }
    public Project Project { get; set; }
    public string ActivityName { get; set; }
    public DateTime? EstimatedDate { get; set; }
    public string? Responsible { get; set; }
    public bool IsCompleted { get; set; }
}
```

### ProjectBudgetItem (rubros de presupuesto)

```csharp
public class ProjectBudgetItem : BaseEntity
{
    public int ProjectId { get; set; }
    public Project Project { get; set; }
    public string Concept { get; set; }               // Rubro / concepto
    public decimal EstimatedAmount { get; set; }
    public string? FundingSource { get; set; }        // Donación, fondos propios, etc.
}
```

---

## Tablas en BD

```sql
CREATE TABLE Projects (
    Id                      INT PRIMARY KEY IDENTITY,
    Name                    NVARCHAR(150) NOT NULL,
    Description             NVARCHAR(2000) NOT NULL,
    ProjectType             NVARCHAR(100) NOT NULL,
    Status                  INT NOT NULL DEFAULT 0,
    StartDate               DATE NOT NULL,
    EstimatedEndDate        DATE,
    Duration                NVARCHAR(100),
    ActivityFrequency       NVARCHAR(100),
    MainObjective           NVARCHAR(500) NOT NULL,
    SpecificObjectives      NVARCHAR(1000),
    TargetPopulation        NVARCHAR(300),
    EstimatedBeneficiaries  INT,
    GeographicLocation      NVARCHAR(200),
    SelectionCriteria       NVARCHAR(300),
    PriorityPopulation      NVARCHAR(500),
    TotalBudget             DECIMAL(12,2),
    HasFunding              BIT NOT NULL DEFAULT 0,
    FundingSource           NVARCHAR(200),
    AdditionalResources     NVARCHAR(300),
    ResponsibleName         NVARCHAR(100) NOT NULL,
    ResponsibleRole         NVARCHAR(100),
    ResponsiblePhone        NVARCHAR(20),
    ResponsibleEmail        NVARCHAR(100),
    TeamMembers             NVARCHAR(500),
    AdminNotes              NVARCHAR(500),
    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE ProjectActivities (
    Id              INT PRIMARY KEY IDENTITY,
    ProjectId       INT NOT NULL REFERENCES Projects(Id) ON DELETE CASCADE,
    ActivityName    NVARCHAR(200) NOT NULL,
    EstimatedDate   DATE,
    Responsible     NVARCHAR(100),
    IsCompleted     BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE ProjectBudgetItems (
    Id              INT PRIMARY KEY IDENTITY,
    ProjectId       INT NOT NULL REFERENCES Projects(Id) ON DELETE CASCADE,
    Concept         NVARCHAR(200) NOT NULL,
    EstimatedAmount DECIMAL(12,2) NOT NULL,
    FundingSource   NVARCHAR(200),
    CreatedAt       DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

---

## DTOs

```csharp
public record CreateProjectDto(
    string Name, string Description, string ProjectType,
    DateTime StartDate, DateTime? EstimatedEndDate, string? Duration,
    string? ActivityFrequency, string MainObjective, string? SpecificObjectives,
    string? TargetPopulation, int? EstimatedBeneficiaries,
    string? GeographicLocation, string? SelectionCriteria, string? PriorityPopulation,
    decimal? TotalBudget, bool HasFunding, string? FundingSource, string? AdditionalResources,
    string ResponsibleName, string? ResponsibleRole, string? ResponsiblePhone, string? ResponsibleEmail,
    string? TeamMembers, string? AdminNotes,
    List<CreateProjectActivityDto> Activities,
    List<CreateProjectBudgetItemDto> BudgetItems
);

public record CreateProjectActivityDto(
    string ActivityName, DateTime? EstimatedDate, string? Responsible
);

public record CreateProjectBudgetItemDto(
    string Concept, decimal EstimatedAmount, string? FundingSource
);

public record ProjectListDto(
    int Id, string Name, string ProjectType, string Status,
    DateTime StartDate, DateTime? EstimatedEndDate,
    string ResponsibleName, int? EstimatedBeneficiaries, DateTime CreatedAt
);

public record ProjectDetailDto(
    int Id, string Name, string Description, string ProjectType, string Status,
    DateTime StartDate, DateTime? EstimatedEndDate, string? Duration,
    string MainObjective, string? SpecificObjectives,
    string? TargetPopulation, int? EstimatedBeneficiaries, string? GeographicLocation,
    decimal? TotalBudget, bool HasFunding, string? FundingSource,
    string ResponsibleName, string? ResponsibleRole, string? ResponsiblePhone, string? ResponsibleEmail,
    string? TeamMembers, string? AdminNotes,
    List<ProjectActivityDto> Activities,
    List<ProjectBudgetItemDto> BudgetItems,
    DateTime CreatedAt
);

public record UpdateProjectStatusDto(ProjectStatus Status, string? AdminNotes);
```

---

## Endpoints (todos requieren auth ✅)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects` | Listar todos los proyectos |
| GET | `/api/projects/{id}` | Ver proyecto completo con actividades y presupuesto |
| POST | `/api/projects` | Crear proyecto |
| PUT | `/api/projects/{id}` | Editar proyecto completo |
| PATCH | `/api/projects/{id}/status` | Cambiar estado |
| DELETE | `/api/projects/{id}` | Eliminar proyecto |
| PATCH | `/api/projects/{id}/activities/{actId}/complete` | Marcar actividad como completada |

---

## Validaciones (FluentValidation)

```csharp
public class CreateProjectValidator : AbstractValidator<CreateProjectDto>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.ProjectType).NotEmpty();
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.MainObjective).NotEmpty().MaximumLength(500);
        RuleFor(x => x.ResponsibleName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.TotalBudget).GreaterThanOrEqualTo(0).When(x => x.TotalBudget.HasValue);
    }
}
```

---

## Panel Admin — Lista de Proyectos

Tabla con columnas: Nombre | Tipo | Estado | Fecha inicio | Responsable | Beneficiarios | Acciones

Filtros: por estado (Planificado / En curso / Completado / Suspendido)

Badge de estado con colores:
- Planificado → azul
- En curso → verde
- Completado → gris
- Suspendido → rojo

---

## Panel Admin — Formulario (Crear / Editar)

Formulario dividido en secciones (acordeón o tabs):

1. **Información general** — nombre, tipo, estado, fechas
2. **Descripción y objetivos** — descripción, objetivo principal, específicos
3. **Beneficiarios** — población, cantidad, ubicación, criterios
4. **Cronograma** — tabla dinámica de actividades (agregar/quitar filas)
5. **Presupuesto** — tabla dinámica de rubros + total calculado automáticamente
6. **Responsable** — datos del responsable y equipo
7. **Notas internas** — campo de texto libre para el admin

---

## Notas

- Este módulo es **solo administrativo** — no hay vista pública de proyectos
- El total del presupuesto se calcula automáticamente sumando los rubros en el frontend
- Las actividades del cronograma se pueden marcar como completadas individualmente
- El estado del proyecto lo actualiza el admin manualmente conforme avanza
