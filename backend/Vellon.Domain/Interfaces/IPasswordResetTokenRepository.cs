using Vellon.Domain.Entities;

namespace Vellon.Domain.Interfaces;

public interface IPasswordResetTokenRepository
{
    Task AddAsync(PasswordResetToken token, CancellationToken ct = default);
    Task<PasswordResetToken?> GetByHashAsync(string tokenHash, CancellationToken ct = default);
    Task UpdateAsync(PasswordResetToken token, CancellationToken ct = default);
    Task DeleteByAdminIdAsync(int adminId, CancellationToken ct = default);
}
