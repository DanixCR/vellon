namespace Vellon.Application.DTOs.Project;

public record ProjectDetailDto(
    int Id,
    string Name,
    string Description,
    string ProjectType,
    string Status,
    DateTime StartDate,
    DateTime? EstimatedEndDate,
    string? Duration,
    string MainObjective,
    string? SpecificObjectives,
    string? TargetPopulation,
    int? EstimatedBeneficiaries,
    string? GeographicLocation,
    decimal? TotalBudget,
    bool HasFunding,
    string? FundingSource,
    string ResponsibleName,
    string? ResponsibleRole,
    string? ResponsiblePhone,
    string? ResponsibleEmail,
    string? TeamMembers,
    string? AdminNotes,
    List<ProjectActivityDto> Activities,
    List<ProjectBudgetItemDto> BudgetItems,
    DateTime CreatedAt
);
