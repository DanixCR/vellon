using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vellon.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVolunteerAge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Volunteers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Volunteers");
        }
    }
}
