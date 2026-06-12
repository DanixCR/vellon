namespace Vellon.Application.DTOs.ContactRecord;

public record ContactRecordResponseDto(
    int Id,
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    string Type,
    bool IsRead,
    DateTime CreatedAt
);
