using Vellon.Domain.Entities;

namespace Vellon.Domain.Interfaces;

public interface IContactRecordRepository
{
    Task<IEnumerable<ContactRecord>> GetAllAsync(CancellationToken ct = default);
    Task<ContactRecord?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(ContactRecord record, CancellationToken ct = default);
    Task UpdateAsync(ContactRecord record, CancellationToken ct = default);
    Task DeleteAsync(ContactRecord record, CancellationToken ct = default);
}
