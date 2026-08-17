namespace Vellon.Application.DTOs.Project;

public record CreateProjectActivityDto(
    string ActivityName,
    DateTime? EstimatedDate,
    string? Responsible
);
