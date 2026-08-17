namespace Vellon.Application.DTOs.Project;

public record ProjectBudgetItemDto(
    int Id,
    string Concept,
    decimal EstimatedAmount,
    string? FundingSource
);
