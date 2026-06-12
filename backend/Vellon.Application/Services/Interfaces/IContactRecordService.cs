using Vellon.Application.DTOs.ContactRecord;
using Vellon.Domain.Entities;

namespace Vellon.Application.Services.Interfaces;

public interface IContactRecordService
{
    Task<IEnumerable<ContactRecordResponseDto>> GetAllAsync(
        ContactType? type = null, bool? isRead = null, CancellationToken ct = default);
    Task<ContactRecordResponseDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ContactRecordResponseDto> CreateAsync(CreateContactRecordDto dto, CancellationToken ct = default);
    Task MarkAsReadAsync(int id, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
