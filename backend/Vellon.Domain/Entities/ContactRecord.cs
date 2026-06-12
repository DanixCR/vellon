using Vellon.Domain.Common;

namespace Vellon.Domain.Entities;

public class ContactRecord : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Message { get; set; }
    public ContactType Type { get; set; }
    public bool IsRead { get; set; }
}
