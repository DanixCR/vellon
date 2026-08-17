namespace Vellon.Application.DTOs.Project;

public record CreateProjectBudgetItemDto(
    string Concept,
    decimal EstimatedAmount,
    string? FundingSource
);
