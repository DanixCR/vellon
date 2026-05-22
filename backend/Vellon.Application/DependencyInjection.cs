using Microsoft.Extensions.DependencyInjection;

namespace Vellon.Application;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services;
    }
}
