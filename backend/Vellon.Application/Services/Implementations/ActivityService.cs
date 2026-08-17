using Vellon.Application.DTOs.Activity;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class ActivityService : IActivityService
{
    private readonly IActivityRepository _repo;

    public ActivityService(IActivityRepository repo) => _repo = repo;

    public async Task<IEnumerable<ActivityPublicDto>> GetPublicAsync(CancellationToken ct = default)
    {
        var activities = await _repo.GetActiveAsync(ct);
        return activities.Select(MapToPublicDto);
    }

    public async Task<IEnumerable<ActivityAdminDto>> GetAllAsync(CancellationToken ct = default)
    {
        var activities = await _repo.GetAllAsync(ct);
        return activities.Select(MapToAdminDto);
    }

    public async Task<ActivityAdminDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var activity = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró la actividad con ID {id}.");
        return MapToAdminDto(activity);
    }

    public async Task<ActivityAdminDto> CreateAsync(CreateActivityDto dto, CancellationToken ct = default)
    {
        var activity = new Activity
        {
            Title = dto.Title,
            Description = dto.Description,
            ActivityDate = dto.ActivityDate,
            ImageUrl = dto.ImageUrl,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(activity, ct);
        return MapToAdminDto(activity);
    }

    public async Task<ActivityAdminDto> UpdateAsync(int id, UpdateActivityDto dto, CancellationToken ct = default)
    {
        var activity = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró la actividad con ID {id}.");

        activity.Title = dto.Title;
        activity.Description = dto.Description;
        activity.ActivityDate = dto.ActivityDate;
        activity.ImageUrl = dto.ImageUrl;
        activity.IsActive = dto.IsActive;
        activity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(activity, ct);
        return MapToAdminDto(activity);
    }

    public async Task<ActivityAdminDto> ToggleActiveAsync(int id, CancellationToken ct = default)
    {
        var activity = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró la actividad con ID {id}.");

        activity.IsActive = !activity.IsActive;
        activity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(activity, ct);
        return MapToAdminDto(activity);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var activity = await _repo.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"No se encontró la actividad con ID {id}.");

        await _repo.DeleteAsync(activity, ct);
    }

    private static ActivityPublicDto MapToPublicDto(Activity a) =>
        new(a.Id, a.Title, a.Description, a.ActivityDate, a.ImageUrl);

    private static ActivityAdminDto MapToAdminDto(Activity a) =>
        new(a.Id, a.Title, a.Description, a.ActivityDate, a.ImageUrl, a.IsActive, a.CreatedAt);
}
