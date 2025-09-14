using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHistoricalInChartOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HistoricalPeriodCount",
                table: "Charts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowHistoricalInChart",
                table: "Charts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HistoricalPeriodCount",
                table: "Charts");

            migrationBuilder.DropColumn(
                name: "ShowHistoricalInChart",
                table: "Charts");
        }
    }
}
