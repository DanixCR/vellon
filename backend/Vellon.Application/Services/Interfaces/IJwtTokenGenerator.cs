using Vellon.Domain.Entities;

namespace Vellon.Application.Services.Interfaces;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) GenerateToken(Admin admin);
}
