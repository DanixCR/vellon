namespace Vellon.Application.DTOs.Activity;

public record ActivityPublicDto(
    int Id,
    string Title,
    string Description,
    DateTime ActivityDate,
    string? ImageUrl
);
