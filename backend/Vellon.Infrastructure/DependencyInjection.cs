using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            if (environment.IsProduction())
            {
                var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL")
                    ?? throw new InvalidOperationException(
                        "La variable de entorno DATABASE_URL no está configurada. " +
                        "En Render, conectá el servicio a la base de datos PostgreSQL para que Render la defina automáticamente.");

                options.UseNpgsql(
                    BuildNpgsqlConnectionString(databaseUrl),
                    npg => npg.MigrationsAssembly("Vellon.Infrastructure.Postgres"));
            }
            else
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            }
        });

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

    private static string BuildNpgsqlConnectionString(string databaseUrl)
    {
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':', 2);
        var username = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
        var database = uri.AbsolutePath.TrimStart('/');
        var port = uri.Port == -1 ? 5432 : uri.Port;

        return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true";
    }
}
