namespace Vellon.Application.DTOs.Activity;

public record CreateActivityDto(
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl,
    bool IsActive
);
