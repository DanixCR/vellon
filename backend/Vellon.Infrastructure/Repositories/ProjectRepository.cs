using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly AppDbContext _context;

    public ProjectRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Project>> GetAllAsync(CancellationToken ct = default)
        => await _context.Projects.OrderByDescending(p => p.CreatedAt).ToListAsync(ct);

    public async Task<Project?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Projects
            .Include(p => p.Activities)
            .Include(p => p.BudgetItems)
            .FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task AddAsync(Project project, CancellationToken ct = default)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Project project, CancellationToken ct = default)
    {
        _context.Projects.Update(project);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Project project, CancellationToken ct = default)
    {
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync(ct);
    }
}
