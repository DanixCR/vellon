using Vellon.Domain.Entities;

namespace Vellon.Domain.Interfaces;

public interface IAdminRepository
{
    Task<Admin?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Admin?> GetByUsernameAsync(string username, CancellationToken ct = default);
    Task<Admin?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<IEnumerable<Admin>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Admin admin, CancellationToken ct = default);
    Task UpdateAsync(Admin admin, CancellationToken ct = default);
    Task DeleteAsync(Admin admin, CancellationToken ct = default);
}
