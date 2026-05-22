# 01 — Architecture: Clean Architecture

## Estructura de Proyectos (.NET Solution)

```
OvejitasFoundation.sln
├── OvejitasFoundation.Domain          ← Capa 1: Entidades y contratos
├── OvejitasFoundation.Application     ← Capa 2: Casos de uso, DTOs, interfaces
├── OvejitasFoundation.Infrastructure  ← Capa 3: EF Core, repos, JWT
└── OvejitasFoundation.WebAPI          ← Capa 4: Controllers, Program.cs, middleware
```

## Capa 1 — Domain

**No depende de nada.**

```
Domain/
├── Entities/
│   ├── Admin.cs
│   ├── ContactRecord.cs          ← Donante/contacto del formulario público
│   └── SocioeconomicStudy.cs     ← Estudio socioeconómico completo
├── Interfaces/
│   ├── IContactRecordRepository.cs
│   ├── ISocioeconomicStudyRepository.cs
│   └── IAdminRepository.cs
└── Common/
    └── BaseEntity.cs             ← Id, CreatedAt, UpdatedAt
```

## Capa 2 — Application

**Depende solo de Domain.**

```
Application/
├── DTOs/
│   ├── ContactRecord/
│   │   ├── CreateContactRecordDto.cs
│   │   └── ContactRecordResponseDto.cs
│   ├── SocioeconomicStudy/
│   │   ├── CreateSocioeconomicStudyDto.cs
│   │   ├── UpdateSocioeconomicStudyDto.cs
│   │   └── SocioeconomicStudyResponseDto.cs
│   └── Auth/
│       ├── LoginRequestDto.cs
│       └── LoginResponseDto.cs
├── Services/
│   ├── Interfaces/
│   │   ├── IContactRecordService.cs
│   │   ├── ISocioeconomicStudyService.cs
│   │   └── IAuthService.cs
│   └── Implementations/
│       ├── ContactRecordService.cs
│       ├── SocioeconomicStudyService.cs
│       └── AuthService.cs
└── Validators/                   ← FluentValidation
    ├── CreateContactRecordValidator.cs
    └── CreateSocioeconomicStudyValidator.cs
```

## Capa 3 — Infrastructure

**Depende de Domain y Application.**

```
Infrastructure/
├── Data/
│   ├── AppDbContext.cs
│   └── Migrations/
├── Repositories/
│   ├── ContactRecordRepository.cs
│   ├── SocioeconomicStudyRepository.cs
│   └── AdminRepository.cs
├── Security/
│   └── JwtTokenGenerator.cs
└── DependencyInjection.cs        ← Registra todos los servicios de infra
```

## Capa 4 — WebAPI

**Depende de Application e Infrastructure.**

```
WebAPI/
├── Controllers/
│   ├── AuthController.cs
│   ├── ContactRecordController.cs
│   └── SocioeconomicStudyController.cs
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs
├── Program.cs
└── appsettings.json
```

## Reglas de Dependencia

```
WebAPI → Application → Domain
          ↑
    Infrastructure
```

- **Domain** no importa nada externo
- **Application** no referencia EF Core ni infraestructura
- **Infrastructure** implementa las interfaces de Domain
- **WebAPI** solo conoce DTOs y servicios de Application

## Configuración Base — Program.cs

```csharp
builder.Services.AddInfrastructure(builder.Configuration);  // desde Infrastructure/DependencyInjection.cs
builder.Services.AddApplication();                          // desde Application/DependencyInjection.cs
builder.Services.AddAuthentication(...).AddJwtBearer(...);
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
```

## Base de Datos — Convenciones EF Core

- Tabla `Admins` — usuarios administrativos (seed inicial)
- Tabla `ContactRecords` — registros del formulario público
- Tabla `SocioeconomicStudies` — estudios socioeconómicos completos
- Tabla `FamilyMembers` — miembros del núcleo familiar (relación 1:N con SocioeconomicStudy)

## CORS

El API permite requests desde `http://localhost:5173` (Vite dev server) en desarrollo.

## Variables de Entorno (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=OvejitasDB;Trusted_Connection=True;"
  },
  "JwtSettings": {
    "SecretKey": "CHANGE_THIS_IN_PRODUCTION",
    "Issuer": "OvejitasAPI",
    "Audience": "OvejitasClient",
    "ExpirationHours": 8
  }
}
```
