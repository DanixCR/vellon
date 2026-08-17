namespace Vellon.Application.DTOs.Volunteer;

public record VolunteerResponseDto(
    int Id,
    string FullName,
    string IdNumber,
    string Phone,
    string Email,
    string? AvailableSchedule,
    string Status,
    DateTime CreatedAt
);
