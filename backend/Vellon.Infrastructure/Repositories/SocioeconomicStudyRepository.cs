using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class SocioeconomicStudyRepository : ISocioeconomicStudyRepository
{
    private readonly AppDbContext _context;

    public SocioeconomicStudyRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<SocioeconomicStudy>> GetAllAsync(CancellationToken ct = default)
        => await _context.SocioeconomicStudies
            .Include(s => s.FamilyMembers)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(ct);

    public async Task<SocioeconomicStudy?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.SocioeconomicStudies
            .Include(s => s.FamilyMembers)
            .Include(s => s.HouseholdItems)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task AddAsync(SocioeconomicStudy study, CancellationToken ct = default)
    {
        _context.SocioeconomicStudies.Add(study);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(SocioeconomicStudy study, CancellationToken ct = default)
    {
        _context.SocioeconomicStudies.Update(study);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(SocioeconomicStudy study, CancellationToken ct = default)
    {
        _context.SocioeconomicStudies.Remove(study);
        await _context.SaveChangesAsync(ct);
    }
}
