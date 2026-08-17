using Vellon.Domain.Entities;

namespace Vellon.Application.DTOs.Volunteer;

public record UpdateVolunteerStatusDto(VolunteerStatus Status, string? AdminNotes);
