namespace Vellon.Application.DTOs.SocioeconomicStudy;

public record FamilyMemberResponseDto(
    int Id,
    string Name,
    int Age,
    string? Occupation,
    string? EmploymentType,
    decimal? MonthlyIncome,
    string? Workplace,
    string? Phone
);
