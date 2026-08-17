namespace Vellon.Application.DTOs.Project;

public record ProjectActivityDto(
    int Id,
    string ActivityName,
    DateTime? EstimatedDate,
    string? Responsible,
    bool IsCompleted
);
