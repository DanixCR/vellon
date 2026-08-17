namespace Vellon.Application.DTOs.Activity;

public record UpdateActivityDto(
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl,
    bool IsActive
);
