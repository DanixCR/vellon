using Microsoft.EntityFrameworkCore;
using Vellon.Domain.Entities;

namespace Vellon.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
    public DbSet<ContactRecord> ContactRecords => Set<ContactRecord>();
    public DbSet<SocioeconomicStudy> SocioeconomicStudies => Set<SocioeconomicStudy>();
    public DbSet<FamilyMember> FamilyMembers => Set<FamilyMember>();
    public DbSet<HouseholdItem> HouseholdItems => Set<HouseholdItem>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<Volunteer> Volunteers => Set<Volunteer>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectActivity> ProjectActivities => Set<ProjectActivity>();
    public DbSet<ProjectBudgetItem> ProjectBudgetItems => Set<ProjectBudgetItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Admin — índices únicos y longitudes
        modelBuilder.Entity<Admin>(e =>
        {
            e.HasIndex(a => a.Username).IsUnique();
            e.HasIndex(a => a.Email).IsUnique();
            e.Property(a => a.Username).HasMaxLength(50).IsRequired();
            e.Property(a => a.Email).HasMaxLength(100).IsRequired();
            e.Property(a => a.PasswordHash).HasMaxLength(256).IsRequired();
            e.Property(a => a.FullName).HasMaxLength(100).IsRequired();
        });

        // PasswordResetToken → Admin (cascade)
        modelBuilder.Entity<PasswordResetToken>(e =>
        {
            e.HasOne(t => t.Admin)
             .WithMany(a => a.ResetTokens)
             .HasForeignKey(t => t.AdminId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(t => t.TokenHash).HasMaxLength(256).IsRequired();
        });

        // ContactRecord
        modelBuilder.Entity<ContactRecord>(e =>
        {
            e.Property(c => c.FullName).HasMaxLength(100).IsRequired();
            e.Property(c => c.Email).HasMaxLength(100).IsRequired();
            e.Property(c => c.Phone).HasMaxLength(20);
            e.Property(c => c.Message).HasMaxLength(500);
        });

        // SocioeconomicStudy — precision decimal
        modelBuilder.Entity<SocioeconomicStudy>(e =>
        {
            e.Property(s => s.AlimonyAmount).HasColumnType("decimal(12,2)");
            e.Property(s => s.ImasSubsidy).HasColumnType("decimal(12,2)");
            e.Property(s => s.OtherInstitutionAid).HasColumnType("decimal(12,2)");
            e.Property(s => s.OtherIncome).HasColumnType("decimal(12,2)");
            e.Property(s => s.FoodExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.EducationExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.ServicesExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.MedicineExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.RentExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.CableExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.DebtExpense).HasColumnType("decimal(12,2)");
            e.Property(s => s.OtherExpenses).HasColumnType("decimal(12,2)");
            e.Property(s => s.CreditCardDebt).HasColumnType("decimal(12,2)");
            e.Property(s => s.SavingsAmount).HasColumnType("decimal(12,2)");
        });

        // FamilyMember → SocioeconomicStudy (cascade)
        modelBuilder.Entity<FamilyMember>(e =>
        {
            e.HasOne(f => f.Study)
             .WithMany(s => s.FamilyMembers)
             .HasForeignKey(f => f.SocioeconomicStudyId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(f => f.Name).HasMaxLength(100).IsRequired();
            e.Property(f => f.MonthlyIncome).HasColumnType("decimal(12,2)");
        });

        // HouseholdItem → SocioeconomicStudy (cascade)
        modelBuilder.Entity<HouseholdItem>(e =>
        {
            e.HasOne(h => h.Study)
             .WithMany(s => s.HouseholdItems)
             .HasForeignKey(h => h.SocioeconomicStudyId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(h => h.ItemName).HasMaxLength(100).IsRequired();
        });

        // Activity
        modelBuilder.Entity<Activity>(e =>
        {
            e.Property(a => a.Title).HasMaxLength(150).IsRequired();
            e.Property(a => a.Description).HasMaxLength(1000).IsRequired();
            e.Property(a => a.ImageUrl).HasMaxLength(500);
        });

        // Volunteer
        modelBuilder.Entity<Volunteer>(e =>
        {
            e.Property(v => v.FullName).HasMaxLength(100).IsRequired();
            e.Property(v => v.IdNumber).HasMaxLength(20).IsRequired();
            e.Property(v => v.Phone).HasMaxLength(20).IsRequired();
            e.Property(v => v.Email).HasMaxLength(100).IsRequired();
        });

        // Project
        modelBuilder.Entity<Project>(e =>
        {
            e.Property(p => p.Name).HasMaxLength(150).IsRequired();
            e.Property(p => p.Description).HasMaxLength(2000).IsRequired();
            e.Property(p => p.ProjectType).HasMaxLength(100).IsRequired();
            e.Property(p => p.MainObjective).HasMaxLength(500).IsRequired();
            e.Property(p => p.ResponsibleName).HasMaxLength(100).IsRequired();
            e.Property(p => p.TotalBudget).HasColumnType("decimal(12,2)");
        });

        // ProjectActivity → Project (cascade)
        modelBuilder.Entity<ProjectActivity>(e =>
        {
            e.HasOne(a => a.Project)
             .WithMany(p => p.Activities)
             .HasForeignKey(a => a.ProjectId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(a => a.ActivityName).HasMaxLength(200).IsRequired();
        });

        // ProjectBudgetItem → Project (cascade)
        modelBuilder.Entity<ProjectBudgetItem>(e =>
        {
            e.HasOne(b => b.Project)
             .WithMany(p => p.BudgetItems)
             .HasForeignKey(b => b.ProjectId)
             .OnDelete(DeleteBehavior.Cascade);
            e.Property(b => b.Concept).HasMaxLength(200).IsRequired();
            e.Property(b => b.EstimatedAmount).HasColumnType("decimal(12,2)");
        });

        // Seed del admin inicial — contraseña: Admin123!
        modelBuilder.Entity<Admin>().HasData(new Admin
        {
            Id = 1,
            Username = "admin",
            Email = "fundacionovejitas@gmail.com",
            PasswordHash = "$2a$11$tPGbje4yjCzbY0nZZ0PPceNWehyaTv6ScDRZhyFz5pgugunZEFLp6",
            FullName = "Administrador General",
            IsActive = true,
            IsSuperAdmin = true,
            CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}
