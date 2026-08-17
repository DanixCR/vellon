namespace Vellon.Application.DTOs.SocioeconomicStudy;

public record FamilyMemberInputDto(
    string Name,
    int Age,
    string? Occupation,
    string? EmploymentType,
    decimal? MonthlyIncome,
    string? Workplace,
    string? Phone
);
