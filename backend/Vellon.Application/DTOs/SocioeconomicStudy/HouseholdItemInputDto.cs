namespace Vellon.Application.DTOs.SocioeconomicStudy;

public record HouseholdItemInputDto(
    string ItemName,
    int Quantity,
    string? Condition,
    string? AcquisitionType,
    bool HasPendingPayments
);
