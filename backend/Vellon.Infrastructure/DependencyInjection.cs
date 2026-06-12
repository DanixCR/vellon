using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Vellon.Application.Services.Interfaces;
using Vellon.Domain.Interfaces;
using Vellon.Infrastructure.Data;
using Vellon.Infrastructure.Email;
using Vellon.Infrastructure.Repositories;
using Vellon.Infrastructure.Security;

namespace Vellon.Infrastructure;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IAdminRepository, AdminRepository>();
        services.AddScoped<IContactRecordRepository, ContactRecordRepository>();
        services.AddScoped<ISocioeconomicStudyRepository, SocioeconomicStudyRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<IActivityRepository, ActivityRepository>();
        services.AddScoped<IVolunteerRepository, VolunteerRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();

        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();

        return services;
    }
}
