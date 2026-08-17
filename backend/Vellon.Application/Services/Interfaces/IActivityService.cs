using Vellon.Application.DTOs.Activity;

namespace Vellon.Application.Services.Interfaces;

public interface IActivityService
{
    Task<IEnumerable<ActivityPublicDto>> GetPublicAsync(CancellationToken ct = default);
    Task<IEnumerable<ActivityAdminDto>> GetAllAsync(CancellationToken ct = default);
    Task<ActivityAdminDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ActivityAdminDto> CreateAsync(CreateActivityDto dto, CancellationToken ct = default);
    Task<ActivityAdminDto> UpdateAsync(int id, UpdateActivityDto dto, CancellationToken ct = default);
    Task<ActivityAdminDto> ToggleActiveAsync(int id, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
