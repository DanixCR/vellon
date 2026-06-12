using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly AppDbContext _context;

    public AdminRepository(AppDbContext context) => _context = context;

    public async Task<Admin?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Admins.FindAsync([id], ct);

    public async Task<Admin?> GetByUsernameAsync(string username, CancellationToken ct = default)
        => await _context.Admins.FirstOrDefaultAsync(a => a.Username == username, ct);

    public async Task<Admin?> GetByEmailAsync(string email, CancellationToken ct = default)
        => await _context.Admins.FirstOrDefaultAsync(a => a.Email == email, ct);

    public async Task<IEnumerable<Admin>> GetAllAsync(CancellationToken ct = default)
        => await _context.Admins.ToListAsync(ct);

    public async Task AddAsync(Admin admin, CancellationToken ct = default)
    {
        _context.Admins.Add(admin);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Admin admin, CancellationToken ct = default)
    {
        _context.Admins.Update(admin);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Admin admin, CancellationToken ct = default)
    {
        _context.Admins.Remove(admin);
        await _context.SaveChangesAsync(ct);
    }
}
