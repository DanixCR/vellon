# 05 — Módulo: Estudio Socioeconómico

## Descripción
CRUD completo del formulario de estudio socioeconómico que usa la Fundación Ovejitas para evaluar a beneficiarios. Basado en el formulario oficial de la fundación.

## Entidades

### SocioeconomicStudy (principal)

```csharp
public class SocioeconomicStudy : BaseEntity
{
    // --- Ingresos ---
    public decimal? AlimonyAmount { get; set; }               // Pensión alimentaria
    public string? AlimonyDetails { get; set; }               // Nombre/cédula quien la otorga
    public bool IsAlimonyVoluntary { get; set; }

    public decimal? ImasSubsidy { get; set; }                 // Subsidio IMAS
    public string? ImasSubsidyProgram { get; set; }

    public decimal? OtherInstitutionAid { get; set; }
    public string? OtherInstitutionAidDetails { get; set; }

    public decimal? OtherIncome { get; set; }
    public string? OtherIncomeDetails { get; set; }

    // --- Gastos ---
    public decimal? FoodExpense { get; set; }
    public decimal? EducationExpense { get; set; }
    public decimal? ServicesExpense { get; set; }
    public decimal? MedicineExpense { get; set; }
    public decimal? RentExpense { get; set; }
    public decimal? CableExpense { get; set; }
    public decimal? DebtExpense { get; set; }
    public decimal? OtherExpenses { get; set; }
    public string? OtherExpensesDetails { get; set; }

    // --- Tarjeta de crédito ---
    public bool HasCreditCard { get; set; }
    public string? CreditCardBank { get; set; }
    public decimal? CreditCardDebt { get; set; }

    // --- Ahorros ---
    public bool HasSavings { get; set; }
    public string? SavingsBank { get; set; }
    public decimal? SavingsAmount { get; set; }

    // --- Vivienda ---
    public HousingType HousingType { get; set; }              // Propia/Alquilada/Prestada/Propia en lote prestado
    public string? HousingOwnerName { get; set; }             // Si prestada
    public string? HousingOwnerIdNumber { get; set; }
    public bool? RentIsUpToDate { get; set; }                 // Si alquilada
    public HousingDebtStatus? HousingDebtStatus { get; set; } // Si propia

    // --- Relaciones ---
    public ICollection<FamilyMember> FamilyMembers { get; set; }
    public ICollection<HouseholdItem> HouseholdItems { get; set; }
}

public enum HousingType { Propia, Alquilada, Prestada, PropiaEnLotePrestado }
public enum HousingDebtStatus { TotalmentePagada, ConDeudaAlDia, ConDeudaAtrasada }
```

### FamilyMember (núcleo familiar)

```csharp
public class FamilyMember : BaseEntity
{
    public int SocioeconomicStudyId { get; set; }
    public SocioeconomicStudy Study { get; set; }

    public string Name { get; set; }
    public int Age { get; set; }
    public string Occupation { get; set; }
    public string EmploymentType { get; set; }     // Permanente / Ocasional / Estacional
    public decimal? MonthlyIncome { get; set; }
    public string? Workplace { get; set; }
    public string? Phone { get; set; }
}
```

### HouseholdItem (menaje del hogar)

```csharp
public class HouseholdItem : BaseEntity
{
    public int SocioeconomicStudyId { get; set; }
    public SocioeconomicStudy Study { get; set; }

    public string ItemName { get; set; }           // Cocina, Refrigeradora, TV, etc.
    public int Quantity { get; set; }
    public string Condition { get; set; }          // Bueno / Regular / Malo
    public string AcquisitionType { get; set; }    // Comprado / Prestado / Regalado / Otro
    public bool HasPendingPayments { get; set; }
}
```

## Tablas en BD

```sql
CREATE TABLE SocioeconomicStudies (
    Id                      INT PRIMARY KEY IDENTITY,
    AlimonyAmount           DECIMAL(12,2),
    AlimonyDetails          NVARCHAR(200),
    IsAlimonyVoluntary      BIT NOT NULL DEFAULT 0,
    ImasSubsidy             DECIMAL(12,2),
    ImasSubsidyProgram      NVARCHAR(200),
    OtherInstitutionAid     DECIMAL(12,2),
    OtherInstitutionAidDetails NVARCHAR(200),
    OtherIncome             DECIMAL(12,2),
    OtherIncomeDetails      NVARCHAR(200),
    FoodExpense             DECIMAL(12,2),
    EducationExpense        DECIMAL(12,2),
    ServicesExpense         DECIMAL(12,2),
    MedicineExpense         DECIMAL(12,2),
    RentExpense             DECIMAL(12,2),
    CableExpense            DECIMAL(12,2),
    DebtExpense             DECIMAL(12,2),
    OtherExpenses           DECIMAL(12,2),
    OtherExpensesDetails    NVARCHAR(200),
    HasCreditCard           BIT NOT NULL DEFAULT 0,
    CreditCardBank          NVARCHAR(100),
    CreditCardDebt          DECIMAL(12,2),
    HasSavings              BIT NOT NULL DEFAULT 0,
    SavingsBank             NVARCHAR(100),
    SavingsAmount           DECIMAL(12,2),
    HousingType             INT NOT NULL,
    HousingOwnerName        NVARCHAR(100),
    HousingOwnerIdNumber    NVARCHAR(20),
    RentIsUpToDate          BIT,
    HousingDebtStatus       INT,
    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE FamilyMembers (
    Id                      INT PRIMARY KEY IDENTITY,
    SocioeconomicStudyId    INT NOT NULL REFERENCES SocioeconomicStudies(Id) ON DELETE CASCADE,
    Name                    NVARCHAR(100) NOT NULL,
    Age                     INT NOT NULL,
    Occupation              NVARCHAR(100),
    EmploymentType          NVARCHAR(50),
    MonthlyIncome           DECIMAL(12,2),
    Workplace               NVARCHAR(100),
    Phone                   NVARCHAR(20),
    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE HouseholdItems (
    Id                      INT PRIMARY KEY IDENTITY,
    SocioeconomicStudyId    INT NOT NULL REFERENCES SocioeconomicStudies(Id) ON DELETE CASCADE,
    ItemName                NVARCHAR(100) NOT NULL,
    Quantity                INT NOT NULL DEFAULT 1,
    Condition               NVARCHAR(20),
    AcquisitionType         NVARCHAR(50),
    HasPendingPayments      BIT NOT NULL DEFAULT 0,
    CreatedAt               DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt               DATETIME2 NOT NULL DEFAULT GETDATE()
);
```

## Endpoints (todos requieren auth ✅)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/socioeconomic-studies` | Listar todos los estudios |
| GET | `/api/socioeconomic-studies/{id}` | Ver estudio completo con miembros y menaje |
| POST | `/api/socioeconomic-studies` | Crear nuevo estudio |
| PUT | `/api/socioeconomic-studies/{id}` | Actualizar estudio completo |
| DELETE | `/api/socioeconomic-studies/{id}` | Eliminar estudio |

## Vista Admin — Formulario

El formulario en el panel admin se divide en secciones visuales:

1. **Núcleo Familiar** — tabla dinámica (agregar/quitar filas)
2. **Ingresos** — campos de pensión, IMAS, otras ayudas
3. **Gastos** — campos de alimentación, servicios, etc. + total calculado
4. **Situación Financiera** — tarjeta de crédito, ahorros
5. **Vivienda** — tipo de vivienda con campos condicionales
6. **Menaje del Hogar** — tabla con ítems predefinidos (Cocina, Refrigeradora, TV, Microondas, Equipo de sonido, DVD, Consola de videojuegos, Camas, Muebles, Computador, Teléfono fijo, Celular, Otros)

## Vista Admin — Lista

- Tabla con columnas: ID | Fecha | Miembros del hogar | Total ingresos | Total gastos | Acciones
- Botones: Ver | Editar | Eliminar
