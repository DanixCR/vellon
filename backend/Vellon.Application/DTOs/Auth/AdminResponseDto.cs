namespace Vellon.Application.DTOs.Auth;

public record AdminResponseDto(
    int Id,
    string Username,
    string Email,
    string FullName,
    bool IsActive,
    bool IsSuperAdmin,
    DateTime CreatedAt);
