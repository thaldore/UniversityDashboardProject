using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePerformancePeriodAssignmentRoleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PerformancePeriodAssignments_AspNetUsers_TargetEntryUserId",
                table: "PerformancePeriodAssignments");

            migrationBuilder.DropIndex(
                name: "IX_PerformancePeriodAssignments_TargetEntryUserId",
                table: "PerformancePeriodAssignments");

            migrationBuilder.DropColumn(
                name: "TargetEntryUserId",
                table: "PerformancePeriodAssignments");

            migrationBuilder.AddColumn<string>(
                name: "ResultEntryRole",
                table: "PerformancePeriodAssignments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetEntryRole",
                table: "PerformancePeriodAssignments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResultEntryRole",
                table: "PerformancePeriodAssignments");

            migrationBuilder.DropColumn(
                name: "TargetEntryRole",
                table: "PerformancePeriodAssignments");

            migrationBuilder.AddColumn<int>(
                name: "TargetEntryUserId",
                table: "PerformancePeriodAssignments",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PerformancePeriodAssignments_TargetEntryUserId",
                table: "PerformancePeriodAssignments",
                column: "TargetEntryUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PerformancePeriodAssignments_AspNetUsers_TargetEntryUserId",
                table: "PerformancePeriodAssignments",
                column: "TargetEntryUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
