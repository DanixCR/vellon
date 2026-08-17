using Vellon.Application.DTOs.Volunteer;
using Vellon.Domain.Entities;

namespace Vellon.Application.Services.Interfaces;

public interface IVolunteerService
{
    Task<IEnumerable<VolunteerResponseDto>> GetAllAsync(VolunteerStatus? status = null, CancellationToken ct = default);
    Task<VolunteerDetailDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<VolunteerDetailDto> CreateAsync(CreateVolunteerDto dto, CancellationToken ct = default);
    Task<VolunteerDetailDto> UpdateStatusAsync(int id, UpdateVolunteerStatusDto dto, CancellationToken ct = default);
    Task<VolunteerDetailDto> UpdateAsync(int id, UpdateVolunteerDto dto, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
