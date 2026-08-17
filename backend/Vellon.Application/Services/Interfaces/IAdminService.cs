using Vellon.Application.DTOs.Auth;

namespace Vellon.Application.Services.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<AdminResponseDto>> GetAllAsync(CancellationToken ct = default);
    Task<AdminResponseDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<AdminResponseDto> CreateAsync(CreateAdminDto dto, CancellationToken ct = default);
    Task<AdminResponseDto> UpdateAsync(int id, UpdateAdminDto dto, CancellationToken ct = default);
    Task ToggleActiveAsync(int id, CancellationToken ct = default);
    Task DeleteAsync(int id, int currentAdminId, CancellationToken ct = default);
}
