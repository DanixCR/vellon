using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class HouseholdItem : BaseEntity
{
    public int SocioeconomicStudyId { get; set; }
    public SocioeconomicStudy Study { get; set; } = null!;
    public string ItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string? Condition { get; set; }
    public string? AcquisitionType { get; set; }
    public bool HasPendingPayments { get; set; }
}
