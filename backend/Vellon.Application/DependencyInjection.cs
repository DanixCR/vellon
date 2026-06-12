using Microsoft.Extensions.DependencyInjection;
using Vellon.Application.Services.Implementations;
using Vellon.Application.Services.Interfaces;

namespace Vellon.Application;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IContactRecordService, ContactRecordService>();
        return services;
    }
}
