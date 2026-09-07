using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Vellon.Infrastructure.Data;

namespace Vellon.Infrastructure.Postgres;

public class PostgresDesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(
            "Host=localhost;Database=vellon_design;Username=postgres;Password=postgres",
            npg => npg.MigrationsAssembly("Vellon.Infrastructure.Postgres"));

        return new AppDbContext(optionsBuilder.Options);
    }
}
