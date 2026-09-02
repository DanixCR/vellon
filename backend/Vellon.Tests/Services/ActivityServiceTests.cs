using Microsoft.EntityFrameworkCore;
using Vellon.Application.Services.Implementations;
using Vellon.Domain.Entities;
using Vellon.Infrastructure.Data;
using Vellon.Infrastructure.Repositories;

namespace Vellon.Tests.Services;

public class ActivityServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetPublicAsync_ReturnsOnlyActiveActivities()
    {
        await using var context = CreateContext();
        context.Activities.AddRange(
            new Activity
            {
                Title = "Feria de adopción",
                Description = "Actividad activa 1",
                ActivityDate = DateTime.UtcNow.AddDays(5),
                IsActive = true
            },
            new Activity
            {
                Title = "Campaña de esterilización",
                Description = "Actividad activa 2",
                ActivityDate = DateTime.UtcNow.AddDays(10),
                IsActive = true
            },
            new Activity
            {
                Title = "Actividad cancelada",
                Description = "No debería aparecer en el público",
                ActivityDate = DateTime.UtcNow.AddDays(-3),
                IsActive = false
            });
        await context.SaveChangesAsync();

        var service = new ActivityService(new ActivityRepository(context));

        var result = await service.GetPublicAsync();

        Assert.Equal(2, result.Count());
        Assert.DoesNotContain(result, a => a.Title == "Actividad cancelada");
        Assert.Contains(result, a => a.Title == "Feria de adopción");
        Assert.Contains(result, a => a.Title == "Campaña de esterilización");
    }
}
