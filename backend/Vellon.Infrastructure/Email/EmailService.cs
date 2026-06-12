using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Vellon.Application.Services.Interfaces;

namespace Vellon.Infrastructure.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config) => _config = config;

    public async Task SendPasswordResetEmailAsync(string toName, string toEmail,
        string rawToken, CancellationToken ct = default)
    {
        var settings = _config.GetSection("EmailSettings");
        var frontendUrl = _config["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
        var resetLink = $"{frontendUrl}/reset-password?token={rawToken}";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(settings["FromName"], settings["FromEmail"]!));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = "Recuperación de contraseña — Fundación Ovejitas";
        message.Body = new TextPart("plain")
        {
            Text = $"""
                Hola {toName},

                Recibimos una solicitud para restablecer tu contraseña.

                Podés restablecer tu contraseña en el siguiente enlace:
                {resetLink}

                Este enlace es válido por 1 hora. Si no solicitaste este cambio, ignorá este correo.

                — Fundación Ovejitas de Costa Rica
                """
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(settings["SmtpHost"]!, int.Parse(settings["SmtpPort"]!),
            MailKit.Security.SecureSocketOptions.StartTls, ct);
        await client.AuthenticateAsync(settings["SmtpUser"]!, settings["SmtpPassword"]!, ct);
        await client.SendAsync(message, ct);
        await client.DisconnectAsync(true, ct);
    }
}
