using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class PasswordResetToken : BaseEntity
{
    public int AdminId { get; set; }
    public Admin Admin { get; set; } = null!;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
}
