using Vellon.Domain.Entities;

namespace Vellon.Domain.Interfaces;

public interface IVolunteerRepository
{
    Task<IEnumerable<Volunteer>> GetAllAsync(CancellationToken ct = default);
    Task<Volunteer?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(Volunteer volunteer, CancellationToken ct = default);
    Task UpdateAsync(Volunteer volunteer, CancellationToken ct = default);
    Task DeleteAsync(Volunteer volunteer, CancellationToken ct = default);
}
