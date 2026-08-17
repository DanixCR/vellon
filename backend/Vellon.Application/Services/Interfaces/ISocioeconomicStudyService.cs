using Vellon.Application.DTOs.SocioeconomicStudy;

namespace Vellon.Application.Services.Interfaces;

public interface ISocioeconomicStudyService
{
    Task<IEnumerable<SocioeconomicStudySummaryDto>> GetAllAsync(CancellationToken ct = default);
    Task<SocioeconomicStudyResponseDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<SocioeconomicStudyResponseDto> CreateAsync(CreateSocioeconomicStudyDto dto, CancellationToken ct = default);
    Task<SocioeconomicStudyResponseDto> UpdateAsync(int id, UpdateSocioeconomicStudyDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
