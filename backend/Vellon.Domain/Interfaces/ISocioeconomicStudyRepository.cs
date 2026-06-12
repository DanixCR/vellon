using Vellon.Domain.Entities;

namespace Vellon.Domain.Interfaces;

public interface ISocioeconomicStudyRepository
{
    Task<IEnumerable<SocioeconomicStudy>> GetAllAsync(CancellationToken ct = default);
    Task<SocioeconomicStudy?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(SocioeconomicStudy study, CancellationToken ct = default);
    Task UpdateAsync(SocioeconomicStudy study, CancellationToken ct = default);
    Task DeleteAsync(SocioeconomicStudy study, CancellationToken ct = default);
}
