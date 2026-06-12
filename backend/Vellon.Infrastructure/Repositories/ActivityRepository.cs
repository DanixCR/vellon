using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class ActivityRepository : IActivityRepository
{
    private readonly AppDbContext _context;

    public ActivityRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Activity>> GetAllAsync(CancellationToken ct = default)
        => await _context.Activities.OrderByDescending(a => a.ActivityDate).ToListAsync(ct);

    public async Task<IEnumerable<Activity>> GetActiveAsync(CancellationToken ct = default)
        => await _context.Activities
            .Where(a => a.IsActive)
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync(ct);

    public async Task<Activity?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Activities.FindAsync([id], ct);

    public async Task AddAsync(Activity activity, CancellationToken ct = default)
    {
        _context.Activities.Add(activity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Activity activity, CancellationToken ct = default)
    {
        _context.Activities.Update(activity);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Activity activity, CancellationToken ct = default)
    {
        _context.Activities.Remove(activity);
        await _context.SaveChangesAsync(ct);
    }
}
