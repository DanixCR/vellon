using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Repositories;

public class ContactRecordRepository : IContactRecordRepository
{
    private readonly AppDbContext _context;

    public ContactRecordRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<ContactRecord>> GetAllAsync(CancellationToken ct = default)
        => await _context.ContactRecords.OrderByDescending(c => c.CreatedAt).ToListAsync(ct);

    public async Task<ContactRecord?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.ContactRecords.FindAsync([id], ct);

    public async Task AddAsync(ContactRecord record, CancellationToken ct = default)
    {
        _context.ContactRecords.Add(record);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(ContactRecord record, CancellationToken ct = default)
    {
        _context.ContactRecords.Update(record);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(ContactRecord record, CancellationToken ct = default)
    {
        _context.ContactRecords.Remove(record);
        await _context.SaveChangesAsync(ct);
    }
}
