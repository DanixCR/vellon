using Vellon.Domain.Entities;

namespace Vellon.Application.DTOs.Project;

public record UpdateProjectStatusDto(ProjectStatus Status, string? AdminNotes);
