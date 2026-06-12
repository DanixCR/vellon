using Vellon.Domain.Entities;

namespace Vellon.Domain.Interfaces;

public interface IActivityRepository
{
    Task<IEnumerable<Activity>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<Activity>> GetActiveAsync(CancellationToken ct = default);
    Task<Activity?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(Activity activity, CancellationToken ct = default);
    Task UpdateAsync(Activity activity, CancellationToken ct = default);
    Task DeleteAsync(Activity activity, CancellationToken ct = default);
}
