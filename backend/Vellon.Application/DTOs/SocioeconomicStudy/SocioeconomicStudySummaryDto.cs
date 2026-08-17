namespace Vellon.Application.DTOs.SocioeconomicStudy;

public record SocioeconomicStudySummaryDto(
    int Id,
    DateTime CreatedAt,
    int FamilyMemberCount,
    decimal TotalIncome,
    decimal TotalExpenses
);
