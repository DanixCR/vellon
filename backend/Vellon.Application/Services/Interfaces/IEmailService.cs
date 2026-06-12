namespace Vellon.Application.Services.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(string toName, string toEmail,
        string rawToken, CancellationToken ct = default);
}
