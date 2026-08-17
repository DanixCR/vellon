namespace Vellon.Application.DTOs.Activity;

public record ActivityAdminDto(
    int Id,
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt
);
