using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class VolunteerRepository : IVolunteerRepository
{
    private readonly AppDbContext _context;

    public VolunteerRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Volunteer>> GetAllAsync(CancellationToken ct = default)
        => await _context.Volunteers.OrderByDescending(v => v.CreatedAt).ToListAsync(ct);

    public async Task<Volunteer?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Volunteers.FindAsync([id], ct);

    public async Task AddAsync(Volunteer volunteer, CancellationToken ct = default)
    {
        _context.Volunteers.Add(volunteer);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Volunteer volunteer, CancellationToken ct = default)
    {
        _context.Volunteers.Update(volunteer);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Volunteer volunteer, CancellationToken ct = default)
    {
        _context.Volunteers.Remove(volunteer);
        await _context.SaveChangesAsync(ct);
    }
}
