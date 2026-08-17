using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vellon.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$KYNqFn.oE3gSp1qBQL38U.V3X24Ud5vIOlF66bEvPjLoJDcu9EEPO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$tPGbje4yjCzbY0nZZ0PPceNWehyaTv6ScDRZhyFz5pgugunZEFLp6");
        }
    }
}
