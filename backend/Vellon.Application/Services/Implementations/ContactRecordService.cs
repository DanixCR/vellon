using Vellon.Application.DTOs.ContactRecord;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class ContactRecordService : IContactRecordService
{
    private readonly IContactRecordRepository _repo;

    public ContactRecordService(IContactRecordRepository repo) => _repo = repo;

    public async Task<IEnumerable<ContactRecordResponseDto>> GetAllAsync(
        ContactType? type = null, bool? isRead = null, CancellationToken ct = default)
    {
        var records = await _repo.GetAllAsync(ct);

        if (type.HasValue)
            records = records.Where(r => r.Type == type.Value);

        if (isRead.HasValue)
            records = records.Where(r => r.IsRead == isRead.Value);

        return records.Select(MapToDto);
    }

    public async Task<ContactRecordResponseDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var record = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el registro de contacto con ID {id}.");
        return MapToDto(record);
    }

    public async Task<ContactRecordResponseDto> CreateAsync(CreateContactRecordDto dto, CancellationToken ct = default)
    {
        var record = new ContactRecord
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Message = dto.Message,
            Type = dto.Type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(record, ct);
        return MapToDto(record);
    }

    public async Task MarkAsReadAsync(int id, CancellationToken ct = default)
    {
        var record = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el registro de contacto con ID {id}.");

        record.IsRead = true;
        record.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(record, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var record = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró el registro de contacto con ID {id}.");

        await _repo.DeleteAsync(record, ct);
    }

    private static ContactRecordResponseDto MapToDto(ContactRecord r) =>
        new(r.Id, r.FullName, r.Email, r.Phone, r.Message,
            r.Type.ToString(), r.IsRead, r.CreatedAt);
}
