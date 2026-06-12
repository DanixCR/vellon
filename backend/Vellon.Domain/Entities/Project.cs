using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class Project : BaseEntity
{
    // Información general
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ProjectType { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EstimatedEndDate { get; set; }
    public string? Duration { get; set; }
    public string? ActivityFrequency { get; set; }

    // Objetivos
    public string MainObjective { get; set; } = string.Empty;
    public string? SpecificObjectives { get; set; }

    // Beneficiarios
    public string? TargetPopulation { get; set; }
    public int? EstimatedBeneficiaries { get; set; }
    public string? GeographicLocation { get; set; }
    public string? SelectionCriteria { get; set; }
    public string? PriorityPopulation { get; set; }

    // Presupuesto
    public decimal? TotalBudget { get; set; }
    public bool HasFunding { get; set; }
    public string? FundingSource { get; set; }
    public string? AdditionalResources { get; set; }

    // Responsable
    public string ResponsibleName { get; set; } = string.Empty;
    public string? ResponsibleRole { get; set; }
    public string? ResponsiblePhone { get; set; }
    public string? ResponsibleEmail { get; set; }
    public string? TeamMembers { get; set; }

    // Notas internas
    public string? AdminNotes { get; set; }

    // Relaciones
    public ICollection<ProjectActivity> Activities { get; set; } = [];
    public ICollection<ProjectBudgetItem> BudgetItems { get; set; } = [];
}
