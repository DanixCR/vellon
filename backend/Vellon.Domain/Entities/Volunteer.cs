using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class Volunteer : BaseEntity
{
    // Datos personales
    public string FullName { get; set; } = string.Empty;
    public string IdNumber { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public int? Age { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? CurrentOccupation { get; set; }

    // Disponibilidad
    public string? AvailableDays { get; set; }
    public string? AvailableSchedule { get; set; }
    public int? WeeklyHours { get; set; }
    public string? SpecialAvailability { get; set; }

    // Habilidades
    public string? Skills { get; set; }
    public string? OtherSkills { get; set; }
    public string? PreviousVolunteerExperience { get; set; }
    public string? EducationLevel { get; set; }
    public string? Languages { get; set; }

    // Áreas de interés
    public string? InterestAreas { get; set; }
    public string? OtherInterestArea { get; set; }

    // Referencias
    public string? Reference1Name { get; set; }
    public string? Reference1Relation { get; set; }
    public string? Reference1Phone { get; set; }
    public string? Reference1Email { get; set; }
    public string? Reference2Name { get; set; }
    public string? Reference2Relation { get; set; }
    public string? Reference2Phone { get; set; }
    public string? Reference2Email { get; set; }

    // Motivación
    public string? Motivation { get; set; }
    public string? ExpectedContribution { get; set; }

    // Estado
    public VolunteerStatus Status { get; set; }
    public string? AdminNotes { get; set; }
}
