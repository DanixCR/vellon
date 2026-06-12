using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class ProjectBudgetItem : BaseEntity
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public string Concept { get; set; } = string.Empty;
    public decimal EstimatedAmount { get; set; }
    public string? FundingSource { get; set; }
}
