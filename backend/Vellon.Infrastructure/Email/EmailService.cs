using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using Vellon.Application.Services.Interfaces;

namespace Vellon.Infrastructure.Email;

public class EmailService : IEmailService
{
    private static readonly TimeSpan SmtpTimeout = TimeSpan.FromSeconds(10);

    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

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

        using var timeoutCts = new CancellationTokenSource(SmtpTimeout);
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct, timeoutCts.Token);
        var linkedToken = linkedCts.Token;

        try
        {
            using var client = new SmtpClient
            {
                Timeout = (int)SmtpTimeout.TotalMilliseconds
            };

            await client.ConnectAsync(settings["SmtpHost"]!, int.Parse(settings["SmtpPort"]!),
                MailKit.Security.SecureSocketOptions.StartTls, linkedToken);
            await client.AuthenticateAsync(settings["SmtpUser"]!, settings["SmtpPassword"]!, linkedToken);
            await client.SendAsync(message, linkedToken);
            await client.DisconnectAsync(true, linkedToken);
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested)
        {
            _logger.LogError(
                "Timeout ({Timeout}s) al enviar el correo de recuperación de contraseña a {Email} vía {Host}:{Port}",
                SmtpTimeout.TotalSeconds, toEmail, settings["SmtpHost"], settings["SmtpPort"]);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error al enviar el correo de recuperación de contraseña a {Email} vía {Host}:{Port}",
                toEmail, settings["SmtpHost"], settings["SmtpPort"]);
            throw;
        }
    }
}
