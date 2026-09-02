using Moq;
using Vellon.Application.DTOs.Auth;
using Vellon.Application.Exceptions;
using Vellon.Application.Services.Implementations;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Entities;
using Vellon.Domain.Interfaces;

namespace Vellon.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IAdminRepository> _adminRepo = new();
    private readonly Mock<IPasswordResetTokenRepository> _tokenRepo = new();
    private readonly Mock<IJwtTokenGenerator> _jwtGenerator = new();
    private readonly Mock<IEmailService> _emailService = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();

    private AuthService CreateService() => new(
        _adminRepo.Object,
        _tokenRepo.Object,
        _jwtGenerator.Object,
        _emailService.Object,
        _passwordHasher.Object);

    private static Admin CreateAdmin(bool isActive = true) => new()
    {
        Id = 1,
        Username = "admin",
        Email = "admin@ovejitas.org",
        PasswordHash = "hashed-password",
        FullName = "Administrador General",
        IsActive = isActive,
        IsSuperAdmin = true
    };

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsToken()
    {
        var admin = CreateAdmin();
        var expiresAt = DateTime.UtcNow.AddHours(1);

        _adminRepo.Setup(r => r.GetByUsernameAsync("admin", It.IsAny<CancellationToken>()))
            .ReturnsAsync(admin);
        _passwordHasher.Setup(h => h.Verify("Admin123!", admin.PasswordHash)).Returns(true);
        _jwtGenerator.Setup(j => j.GenerateToken(admin)).Returns(("jwt-token", expiresAt));

        var result = await CreateService().LoginAsync(new LoginRequestDto("admin", "Admin123!"));

        Assert.Equal("jwt-token", result.Token);
        Assert.Equal(admin.FullName, result.FullName);
        Assert.Equal(admin.IsSuperAdmin, result.IsSuperAdmin);
        Assert.Equal(expiresAt, result.ExpiresAt);
    }

    [Fact]
    public async Task LoginAsync_UserNotFound_ThrowsUnauthorizedException()
    {
        _adminRepo.Setup(r => r.GetByUsernameAsync("desconocido", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Admin?)null);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => CreateService().LoginAsync(new LoginRequestDto("desconocido", "cualquier")));
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsUnauthorizedException()
    {
        var admin = CreateAdmin();

        _adminRepo.Setup(r => r.GetByUsernameAsync("admin", It.IsAny<CancellationToken>()))
            .ReturnsAsync(admin);
        _passwordHasher.Setup(h => h.Verify("incorrecta", admin.PasswordHash)).Returns(false);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => CreateService().LoginAsync(new LoginRequestDto("admin", "incorrecta")));
    }

    [Fact]
    public async Task LoginAsync_InactiveAdmin_ThrowsUnauthorizedException()
    {
        var admin = CreateAdmin(isActive: false);

        _adminRepo.Setup(r => r.GetByUsernameAsync("admin", It.IsAny<CancellationToken>()))
            .ReturnsAsync(admin);

        await Assert.ThrowsAsync<UnauthorizedException>(
            () => CreateService().LoginAsync(new LoginRequestDto("admin", "Admin123!")));

        _jwtGenerator.Verify(j => j.GenerateToken(It.IsAny<Admin>()), Times.Never);
    }
}
