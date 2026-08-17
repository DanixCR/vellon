using Vellon.Application.DTOs.Project;
using Vellon.Domain.Entities;

namespace Vellon.Application.Services.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectListDto>> GetAllAsync(ProjectStatus? status = null, CancellationToken ct = default);
    Task<ProjectDetailDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProjectDetailDto> CreateAsync(CreateProjectDto dto, CancellationToken ct = default);
    Task<ProjectDetailDto> UpdateAsync(int id, UpdateProjectDto dto, CancellationToken ct = default);
    Task<ProjectDetailDto> UpdateStatusAsync(int id, UpdateProjectStatusDto dto, CancellationToken ct = default);
    Task<ProjectDetailDto> CompleteActivityAsync(int projectId, int activityId, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
