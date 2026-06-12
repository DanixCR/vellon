using Vellon.Application.DTOs.Auth;

namespace Vellon.Application.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default);
    Task ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken ct = default);
    Task ResetPasswordAsync(ResetPasswordDto dto, CancellationToken ct = default);
    Task<AdminResponseDto> GetMeAsync(int adminId, CancellationToken ct = default);
}
