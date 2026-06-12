using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class ProjectActivity : BaseEntity
{
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public string ActivityName { get; set; } = string.Empty;
    public DateTime? EstimatedDate { get; set; }
    public string? Responsible { get; set; }
    public bool IsCompleted { get; set; }
}
