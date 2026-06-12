using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class FamilyMember : BaseEntity
{
    public int SocioeconomicStudyId { get; set; }
    public SocioeconomicStudy Study { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string? Occupation { get; set; }
    public string? EmploymentType { get; set; }
    public decimal? MonthlyIncome { get; set; }
    public string? Workplace { get; set; }
    public string? Phone { get; set; }
}
