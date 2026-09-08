using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using Vellon.Application.Services.Interfaces;

namespace Vellon.Infrastructure.Email;

public class EmailService : IEmailService
{
    private static readonly TimeSpan EmailTimeout = TimeSpan.FromSeconds(10);

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

        var safeName = WebUtility.HtmlEncode(toName);
        var safeLink = WebUtility.HtmlEncode(resetLink);

        var plainTextContent = $"""
            Hola {toName},

            Recibimos una solicitud para restablecer tu contraseña.

            Podés restablecer tu contraseña en el siguiente enlace:
            {resetLink}

            Este enlace es válido por 1 hora. Si no solicitaste este cambio, ignorá este correo.

            — Fundación Ovejitas de Costa Rica
            """;

        var htmlContent = $"""
            <!DOCTYPE html>
            <html lang="es">
              <body style="margin:0; padding:0; background-color:#ffffff; font-family: Arial, Helvetica, sans-serif;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
                  <tr>
                    <td align="center" style="padding: 32px 16px;">
                      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; text-align:center;">
                        <tr>
                          <td align="center" style="padding-bottom: 16px;">
                            <img src="https://vellon.onrender.com/logo.jpg" width="80" alt="Fundación Ovejitas" style="display:block; margin:0 auto; border-radius:50%;">
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="color:#29ABE2; font-size:20px; font-weight:bold; padding-bottom: 16px;">
                            Recuperación de contraseña
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="color:#000000; font-size:15px; line-height:1.5; padding-bottom: 8px;">
                            Hola {safeName},
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="color:#000000; font-size:15px; line-height:1.5; padding-bottom: 24px;">
                            Recibimos una solicitud para restablecer tu contraseña.
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-bottom: 24px;">
                            <a href="{safeLink}" style="background-color:#29ABE2; color:#ffffff; text-decoration:none; font-weight:bold; padding:12px 32px; border-radius:9999px; display:inline-block;">
                              Restablecer contraseña
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="color:#000000; font-size:13px; line-height:1.5; padding-bottom: 4px;">
                            Este enlace es válido por 1 hora.
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="color:#000000; font-size:13px; line-height:1.5; padding-bottom: 32px;">
                            Si no solicitaste este cambio, ignorá este correo.
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="border-top:1px solid #eeeeee; padding-top:16px; color:#666666; font-size:12px;">
                            Fundación Ovejitas de Costa Rica
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            """;

        var from = new EmailAddress(settings["FromEmail"]!, settings["FromName"]);
        var to = new EmailAddress(toEmail, toName);
        var message = MailHelper.CreateSingleEmail(
            from, to, "Recuperación de contraseña — Fundación Ovejitas", plainTextContent, htmlContent);

        using var timeoutCts = new CancellationTokenSource(EmailTimeout);
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct, timeoutCts.Token);
        var linkedToken = linkedCts.Token;

        using var httpClient = new HttpClient { Timeout = EmailTimeout };
        var client = new SendGridClient(httpClient, settings["SendGridApiKey"]!);

        try
        {
            var response = await client.SendEmailAsync(message, linkedToken);

            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Body.ReadAsStringAsync(linkedToken);
                _logger.LogError(
                    "SendGrid respondió con error al enviar el correo de recuperación de contraseña a {Email}. Status: {Status}. Body: {Body}",
                    toEmail, response.StatusCode, body);
                throw new InvalidOperationException($"SendGrid respondió con estado {response.StatusCode} al enviar el correo.");
            }
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested)
        {
            _logger.LogError(
                "Timeout ({Timeout}s) al enviar el correo de recuperación de contraseña a {Email} vía SendGrid",
                EmailTimeout.TotalSeconds, toEmail);
            throw;
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            _logger.LogError(ex,
                "Error al enviar el correo de recuperación de contraseña a {Email} vía SendGrid", toEmail);
            throw;
        }
    }
}
