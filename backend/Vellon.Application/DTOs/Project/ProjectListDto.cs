namespace Vellon.Application.DTOs.Project;

public record ProjectListDto(
    int Id,
    string Name,
    string ProjectType,
    string Status,
    DateTime StartDate,
    DateTime? EstimatedEndDate,
    string ResponsibleName,
    int? EstimatedBeneficiaries,
    DateTime CreatedAt
);
