namespace Vellon.Application.DTOs.Auth;

public record LoginResponseDto(string Token, string FullName, bool IsSuperAdmin, DateTime ExpiresAt);
