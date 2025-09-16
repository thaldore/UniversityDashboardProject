using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIsNestedGroupingColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // IsNestedGrouping kolonunu sil
            migrationBuilder.DropColumn(
                name: "IsNestedGrouping",
                table: "ChartGroups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // IsNestedGrouping kolonunu geri ekle
            migrationBuilder.AddColumn<bool>(
                name: "IsNestedGrouping",
                table: "ChartGroups",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
