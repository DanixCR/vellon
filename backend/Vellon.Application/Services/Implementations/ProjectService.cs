using Vellon.Application.DTOs.Project;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repo;

    public ProjectService(IProjectRepository repo) => _repo = repo;

    public async Task<IEnumerable<ProjectListDto>> GetAllAsync(
        ProjectStatus? status = null, CancellationToken ct = default)
    {
        var projects = await _repo.GetAllAsync(ct);

        if (status.HasValue)
            projects = projects.Where(p => p.Status == status.Value);

        return projects.Select(MapToListDto);
    }

    public async Task<ProjectDetailDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el proyecto con ID {id}.");
        return MapToDetailDto(project);
    }

    public async Task<ProjectDetailDto> CreateAsync(CreateProjectDto dto, CancellationToken ct = default)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            ProjectType = dto.ProjectType,
            Status = ProjectStatus.Planificado,
            StartDate = dto.StartDate,
            EstimatedEndDate = dto.EstimatedEndDate,
            Duration = dto.Duration,
            ActivityFrequency = dto.ActivityFrequency,
            MainObjective = dto.MainObjective,
            SpecificObjectives = dto.SpecificObjectives,
            TargetPopulation = dto.TargetPopulation,
            EstimatedBeneficiaries = dto.EstimatedBeneficiaries,
            GeographicLocation = dto.GeographicLocation,
            SelectionCriteria = dto.SelectionCriteria,
            PriorityPopulation = dto.PriorityPopulation,
            TotalBudget = dto.TotalBudget,
            HasFunding = dto.HasFunding,
            FundingSource = dto.FundingSource,
            AdditionalResources = dto.AdditionalResources,
            ResponsibleName = dto.ResponsibleName,
            ResponsibleRole = dto.ResponsibleRole,
            ResponsiblePhone = dto.ResponsiblePhone,
            ResponsibleEmail = dto.ResponsibleEmail,
            TeamMembers = dto.TeamMembers,
            AdminNotes = dto.AdminNotes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        foreach (var a in dto.Activities)
            project.Activities.Add(MapToActivity(a));

        foreach (var b in dto.BudgetItems)
            project.BudgetItems.Add(MapToBudgetItem(b));

        await _repo.AddAsync(project, ct);
        return MapToDetailDto(project);
    }

    public async Task<ProjectDetailDto> UpdateAsync(int id, UpdateProjectDto dto, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el proyecto con ID {id}.");

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.ProjectType = dto.ProjectType;
        project.StartDate = dto.StartDate;
        project.EstimatedEndDate = dto.EstimatedEndDate;
        project.Duration = dto.Duration;
        project.ActivityFrequency = dto.ActivityFrequency;
        project.MainObjective = dto.MainObjective;
        project.SpecificObjectives = dto.SpecificObjectives;
        project.TargetPopulation = dto.TargetPopulation;
        project.EstimatedBeneficiaries = dto.EstimatedBeneficiaries;
        project.GeographicLocation = dto.GeographicLocation;
        project.SelectionCriteria = dto.SelectionCriteria;
        project.PriorityPopulation = dto.PriorityPopulation;
        project.TotalBudget = dto.TotalBudget;
        project.HasFunding = dto.HasFunding;
        project.FundingSource = dto.FundingSource;
        project.AdditionalResources = dto.AdditionalResources;
        project.ResponsibleName = dto.ResponsibleName;
        project.ResponsibleRole = dto.ResponsibleRole;
        project.ResponsiblePhone = dto.ResponsiblePhone;
        project.ResponsibleEmail = dto.ResponsibleEmail;
        project.TeamMembers = dto.TeamMembers;
        project.AdminNotes = dto.AdminNotes;
        project.UpdatedAt = DateTime.UtcNow;

        // Reemplazar colecciones hijas — EF Core cascade delete elimina huérfanos
        project.Activities.Clear();
        foreach (var a in dto.Activities)
            project.Activities.Add(MapToActivity(a));

        project.BudgetItems.Clear();
        foreach (var b in dto.BudgetItems)
            project.BudgetItems.Add(MapToBudgetItem(b));

        await _repo.UpdateAsync(project, ct);
        return MapToDetailDto(project);
    }

    public async Task<ProjectDetailDto> UpdateStatusAsync(
        int id, UpdateProjectStatusDto dto, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el proyecto con ID {id}.");

        project.Status = dto.Status;
        project.AdminNotes = dto.AdminNotes;
        project.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(project, ct);
        return MapToDetailDto(project);
    }

    public async Task<ProjectDetailDto> CompleteActivityAsync(
        int projectId, int activityId, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(projectId, ct)
            ?? throw new NotFoundException($"No se encontró el proyecto con ID {projectId}.");

        var activity = project.Activities.FirstOrDefault(a => a.Id == activityId)
            ?? throw new NotFoundException($"No se encontró la actividad con ID {activityId} en el proyecto {projectId}.");

        activity.IsCompleted = true;
        activity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(project, ct);
        return MapToDetailDto(project);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var project = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el proyecto con ID {id}.");

        await _repo.DeleteAsync(project, ct);
    }

    private static ProjectListDto MapToListDto(Project p) => new(
        p.Id, p.Name, p.ProjectType, p.Status.ToString(),
        p.StartDate, p.EstimatedEndDate, p.ResponsibleName,
        p.EstimatedBeneficiaries, p.CreatedAt
    );

    private static ProjectDetailDto MapToDetailDto(Project p) => new(
        p.Id, p.Name, p.Description, p.ProjectType, p.Status.ToString(),
        p.StartDate, p.EstimatedEndDate, p.Duration,
        p.MainObjective, p.SpecificObjectives,
        p.TargetPopulation, p.EstimatedBeneficiaries, p.GeographicLocation,
        p.TotalBudget, p.HasFunding, p.FundingSource,
        p.ResponsibleName, p.ResponsibleRole, p.ResponsiblePhone, p.ResponsibleEmail,
        p.TeamMembers, p.AdminNotes,
        p.Activities.Select(a => new ProjectActivityDto(
            a.Id, a.ActivityName, a.EstimatedDate, a.Responsible, a.IsCompleted)).ToList(),
        p.BudgetItems.Select(b => new ProjectBudgetItemDto(
            b.Id, b.Concept, b.EstimatedAmount, b.FundingSource)).ToList(),
        p.CreatedAt
    );

    private static ProjectActivity MapToActivity(CreateProjectActivityDto a) => new()
    {
        ActivityName = a.ActivityName,
        EstimatedDate = a.EstimatedDate,
        Responsible = a.Responsible,
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    private static ProjectBudgetItem MapToBudgetItem(CreateProjectBudgetItemDto b) => new()
    {
        Concept = b.Concept,
        EstimatedAmount = b.EstimatedAmount,
        FundingSource = b.FundingSource,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };
}
