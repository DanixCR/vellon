namespace Vellon.Application.DTOs.SocioeconomicStudy;

public record HouseholdItemResponseDto(
    int Id,
    string ItemName,
    int Quantity,
    string? Condition,
    string? AcquisitionType,
    bool HasPendingPayments
);
