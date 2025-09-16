using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupHierarchyToChartGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // GroupType kolonu ekleme (1: ColorGroup, 2: NameGroup)
            migrationBuilder.AddColumn<string>(
                name: "GroupType",
                table: "ChartGroups",
                type: "text",
                nullable: false,
                defaultValue: "ColorGroup");

            // ParentGroupId kolonu ekleme
            migrationBuilder.AddColumn<int>(
                name: "ParentGroupId",
                table: "ChartGroups",
                type: "integer",
                nullable: true);

            // Foreign key constraint ekleme
            migrationBuilder.CreateIndex(
                name: "IX_ChartGroups_ParentGroupId",
                table: "ChartGroups",
                column: "ParentGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChartGroups_ChartGroups_ParentGroupId",
                table: "ChartGroups",
                column: "ParentGroupId",
                principalTable: "ChartGroups",
                principalColumn: "GroupId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Foreign key constraint kaldırma
            migrationBuilder.DropForeignKey(
                name: "FK_ChartGroups_ChartGroups_ParentGroupId",
                table: "ChartGroups");

            // Index kaldırma
            migrationBuilder.DropIndex(
                name: "IX_ChartGroups_ParentGroupId",
                table: "ChartGroups");

            // Kolonları kaldırma
            migrationBuilder.DropColumn(
                name: "GroupType",
                table: "ChartGroups");

            migrationBuilder.DropColumn(
                name: "ParentGroupId",
                table: "ChartGroups");
        }
    }
}
