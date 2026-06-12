using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class Activity : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime ActivityDate { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
}
