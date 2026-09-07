using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Vellon.Infrastructure.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class PostgreSQLSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    ActivityDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsSuperAdmin = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Message = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactRecords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    ProjectType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EstimatedEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Duration = table.Column<string>(type: "text", nullable: true),
                    ActivityFrequency = table.Column<string>(type: "text", nullable: true),
                    MainObjective = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SpecificObjectives = table.Column<string>(type: "text", nullable: true),
                    TargetPopulation = table.Column<string>(type: "text", nullable: true),
                    EstimatedBeneficiaries = table.Column<int>(type: "integer", nullable: true),
                    GeographicLocation = table.Column<string>(type: "text", nullable: true),
                    SelectionCriteria = table.Column<string>(type: "text", nullable: true),
                    PriorityPopulation = table.Column<string>(type: "text", nullable: true),
                    TotalBudget = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    HasFunding = table.Column<bool>(type: "boolean", nullable: false),
                    FundingSource = table.Column<string>(type: "text", nullable: true),
                    AdditionalResources = table.Column<string>(type: "text", nullable: true),
                    ResponsibleName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ResponsibleRole = table.Column<string>(type: "text", nullable: true),
                    ResponsiblePhone = table.Column<string>(type: "text", nullable: true),
                    ResponsibleEmail = table.Column<string>(type: "text", nullable: true),
                    TeamMembers = table.Column<string>(type: "text", nullable: true),
                    AdminNotes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SocioeconomicStudies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AlimonyAmount = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    AlimonyDetails = table.Column<string>(type: "text", nullable: true),
                    IsAlimonyVoluntary = table.Column<bool>(type: "boolean", nullable: false),
                    ImasSubsidy = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    ImasSubsidyProgram = table.Column<string>(type: "text", nullable: true),
                    OtherInstitutionAid = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    OtherInstitutionAidDetails = table.Column<string>(type: "text", nullable: true),
                    OtherIncome = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    OtherIncomeDetails = table.Column<string>(type: "text", nullable: true),
                    FoodExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    EducationExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    ServicesExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    MedicineExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    RentExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    CableExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    DebtExpense = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    OtherExpenses = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    OtherExpensesDetails = table.Column<string>(type: "text", nullable: true),
                    HasCreditCard = table.Column<bool>(type: "boolean", nullable: false),
                    CreditCardBank = table.Column<string>(type: "text", nullable: true),
                    CreditCardDebt = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    HasSavings = table.Column<bool>(type: "boolean", nullable: false),
                    SavingsBank = table.Column<string>(type: "text", nullable: true),
                    SavingsAmount = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    HousingType = table.Column<int>(type: "integer", nullable: false),
                    HousingOwnerName = table.Column<string>(type: "text", nullable: true),
                    HousingOwnerIdNumber = table.Column<string>(type: "text", nullable: true),
                    RentIsUpToDate = table.Column<bool>(type: "boolean", nullable: true),
                    HousingDebtStatus = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocioeconomicStudies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Volunteers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IdNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    BirthDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: true),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    CurrentOccupation = table.Column<string>(type: "text", nullable: true),
                    AvailableDays = table.Column<string>(type: "text", nullable: true),
                    AvailableSchedule = table.Column<string>(type: "text", nullable: true),
                    WeeklyHours = table.Column<int>(type: "integer", nullable: true),
                    SpecialAvailability = table.Column<string>(type: "text", nullable: true),
                    Skills = table.Column<string>(type: "text", nullable: true),
                    OtherSkills = table.Column<string>(type: "text", nullable: true),
                    PreviousVolunteerExperience = table.Column<string>(type: "text", nullable: true),
                    EducationLevel = table.Column<string>(type: "text", nullable: true),
                    Languages = table.Column<string>(type: "text", nullable: true),
                    InterestAreas = table.Column<string>(type: "text", nullable: true),
                    OtherInterestArea = table.Column<string>(type: "text", nullable: true),
                    Reference1Name = table.Column<string>(type: "text", nullable: true),
                    Reference1Relation = table.Column<string>(type: "text", nullable: true),
                    Reference1Phone = table.Column<string>(type: "text", nullable: true),
                    Reference1Email = table.Column<string>(type: "text", nullable: true),
                    Reference2Name = table.Column<string>(type: "text", nullable: true),
                    Reference2Relation = table.Column<string>(type: "text", nullable: true),
                    Reference2Phone = table.Column<string>(type: "text", nullable: true),
                    Reference2Email = table.Column<string>(type: "text", nullable: true),
                    Motivation = table.Column<string>(type: "text", nullable: true),
                    ExpectedContribution = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AdminNotes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Volunteers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AdminId = table.Column<int>(type: "integer", nullable: false),
                    TokenHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_Admins_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Admins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectActivities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    ActivityName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EstimatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Responsible = table.Column<string>(type: "text", nullable: true),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectActivities_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectBudgetItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    Concept = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EstimatedAmount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    FundingSource = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectBudgetItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectBudgetItems_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilyMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SocioeconomicStudyId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: false),
                    Occupation = table.Column<string>(type: "text", nullable: true),
                    EmploymentType = table.Column<string>(type: "text", nullable: true),
                    MonthlyIncome = table.Column<decimal>(type: "numeric(12,2)", nullable: true),
                    Workplace = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyMembers_SocioeconomicStudies_SocioeconomicStudyId",
                        column: x => x.SocioeconomicStudyId,
                        principalTable: "SocioeconomicStudies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HouseholdItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SocioeconomicStudyId = table.Column<int>(type: "integer", nullable: false),
                    ItemName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Condition = table.Column<string>(type: "text", nullable: true),
                    AcquisitionType = table.Column<string>(type: "text", nullable: true),
                    HasPendingPayments = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseholdItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HouseholdItems_SocioeconomicStudies_SocioeconomicStudyId",
                        column: x => x.SocioeconomicStudyId,
                        principalTable: "SocioeconomicStudies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "IsSuperAdmin", "PasswordHash", "UpdatedAt", "Username" },
                values: new object[] { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "fundacionovejitas@gmail.com", "Administrador General", true, true, "$2a$11$KYNqFn.oE3gSp1qBQL38U.V3X24Ud5vIOlF66bEvPjLoJDcu9EEPO", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Email",
                table: "Admins",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Username",
                table: "Admins",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMembers_SocioeconomicStudyId",
                table: "FamilyMembers",
                column: "SocioeconomicStudyId");

            migrationBuilder.CreateIndex(
                name: "IX_HouseholdItems_SocioeconomicStudyId",
                table: "HouseholdItems",
                column: "SocioeconomicStudyId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_AdminId",
                table: "PasswordResetTokens",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectActivities_ProjectId",
                table: "ProjectActivities",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBudgetItems_ProjectId",
                table: "ProjectBudgetItems",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "ContactRecords");

            migrationBuilder.DropTable(
                name: "FamilyMembers");

            migrationBuilder.DropTable(
                name: "HouseholdItems");

            migrationBuilder.DropTable(
                name: "PasswordResetTokens");

            migrationBuilder.DropTable(
                name: "ProjectActivities");

            migrationBuilder.DropTable(
                name: "ProjectBudgetItems");

            migrationBuilder.DropTable(
                name: "Volunteers");

            migrationBuilder.DropTable(
                name: "SocioeconomicStudies");

            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
