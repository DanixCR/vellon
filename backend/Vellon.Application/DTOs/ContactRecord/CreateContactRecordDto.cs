using Vellon.Domain.Entities;

namespace Vellon.Application.DTOs.ContactRecord;

public record CreateContactRecordDto(
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    ContactType Type
);
