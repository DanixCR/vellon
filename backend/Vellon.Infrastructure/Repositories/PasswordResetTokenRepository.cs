using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class PasswordResetTokenRepository : IPasswordResetTokenRepository
{
    private readonly AppDbContext _context;

    public PasswordResetTokenRepository(AppDbContext context) => _context = context;

    public async Task AddAsync(PasswordResetToken token, CancellationToken ct = default)
    {
        _context.PasswordResetTokens.Add(token);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<PasswordResetToken?> GetByHashAsync(string tokenHash, CancellationToken ct = default)
        => await _context.PasswordResetTokens
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && !t.IsUsed, ct);

    public async Task UpdateAsync(PasswordResetToken token, CancellationToken ct = default)
    {
        _context.PasswordResetTokens.Update(token);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteByAdminIdAsync(int adminId, CancellationToken ct = default)
    {
        var tokens = await _context.PasswordResetTokens
            .Where(t => t.AdminId == adminId)
            .ToListAsync(ct);
        _context.PasswordResetTokens.RemoveRange(tokens);
        await _context.SaveChangesAsync(ct);
    }
}
