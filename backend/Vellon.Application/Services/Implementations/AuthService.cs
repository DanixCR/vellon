using System.Security.Cryptography;
using System.Text;
using Vellon.Application.DTOs.Auth;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Application.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IAdminRepository _adminRepo;
    private readonly IPasswordResetTokenRepository _tokenRepo;
    private readonly IJwtTokenGenerator _jwtGenerator;
    private readonly IEmailService _emailService;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(
        IAdminRepository adminRepo,
        IPasswordResetTokenRepository tokenRepo,
        IJwtTokenGenerator jwtGenerator,
        IEmailService emailService,
        IPasswordHasher passwordHasher)
    {
        _adminRepo = adminRepo;
        _tokenRepo = tokenRepo;
        _jwtGenerator = jwtGenerator;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default)
    {
        var admin = await _adminRepo.GetByUsernameAsync(dto.Username, ct);

        if (admin is null || !admin.IsActive || !_passwordHasher.Verify(dto.Password, admin.PasswordHash))
            throw new UnauthorizedException("Las credenciales ingresadas no son correctas.");

        var (token, expiresAt) = _jwtGenerator.GenerateToken(admin);
        return new LoginResponseDto(token, admin.FullName, admin.IsSuperAdmin, expiresAt);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken ct = default)
    {
        var admin = await _adminRepo.GetByEmailAsync(dto.Email, ct);
        if (admin is null) return; // No revelar si el email existe

        await _tokenRepo.DeleteByAdminIdAsync(admin.Id, ct);

        var rawToken = Guid.NewGuid().ToString("N");
        var tokenHash = ComputeSha256(rawToken);

        await _tokenRepo.AddAsync(new PasswordResetToken
        {
            AdminId = admin.Id,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            IsUsed = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        }, ct);

        await _emailService.SendPasswordResetEmailAsync(admin.FullName, admin.Email, rawToken, ct);
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto, CancellationToken ct = default)
    {
        if (dto.NewPassword != dto.ConfirmPassword)
            throw new BadRequestException("Las contraseñas no coinciden.");

        var tokenHash = ComputeSha256(dto.Token);
        var resetToken = await _tokenRepo.GetByHashAsync(tokenHash, ct);

        if (resetToken is null || resetToken.IsUsed || resetToken.ExpiresAt < DateTime.UtcNow)
            throw new BadRequestException("Este enlace no es válido o ha expirado.");

        var admin = await _adminRepo.GetByIdAsync(resetToken.AdminId, ct)
            ?? throw new BadRequestException("Este enlace no es válido o ha expirado.");

        admin.PasswordHash = _passwordHasher.Hash(dto.NewPassword);
        admin.UpdatedAt = DateTime.UtcNow;
        await _adminRepo.UpdateAsync(admin, ct);

        resetToken.IsUsed = true;
        resetToken.UpdatedAt = DateTime.UtcNow;
        await _tokenRepo.UpdateAsync(resetToken, ct);
    }

    public async Task<AdminResponseDto> GetMeAsync(int adminId, CancellationToken ct = default)
    {
        var admin = await _adminRepo.GetByIdAsync(adminId, ct)
            ?? throw new NotFoundException("Administrador no encontrado.");

        return new AdminResponseDto(
            admin.Id, admin.Username, admin.Email,
            admin.FullName, admin.IsActive, admin.IsSuperAdmin, admin.CreatedAt);
    }

    private static string ComputeSha256(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLower();
    }
}
