using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveIndicatorGroupMoveToDirectDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Önce foreign key constraint'lerini kaldır
            migrationBuilder.DropForeignKey(
                name: "FK_Indicators_IndicatorGroups_GroupId",
                table: "Indicators");

            migrationBuilder.DropIndex(
                name: "IX_Indicators_GroupId",
                table: "Indicators");

            // GroupId kolonunu DepartmentId olarak yeniden adlandır
            migrationBuilder.RenameColumn(
                name: "GroupId",
                table: "Indicators",
                newName: "DepartmentId");

            // DepartmentId için index oluştur
            migrationBuilder.CreateIndex(
                name: "IX_Indicators_DepartmentId",
                table: "Indicators",
                column: "DepartmentId");

            // Department ile foreign key ilişkisi kur
            migrationBuilder.AddForeignKey(
                name: "FK_Indicators_Departments_DepartmentId",
                table: "Indicators",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Cascade);

            // IndicatorGroups tablosunu kaldır
            migrationBuilder.DropTable(
                name: "IndicatorGroups");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Foreign key constraint'i kaldır
            migrationBuilder.DropForeignKey(
                name: "FK_Indicators_Departments_DepartmentId",
                table: "Indicators");

            migrationBuilder.DropIndex(
                name: "IX_Indicators_DepartmentId",
                table: "Indicators");

            // IndicatorGroups tablosunu yeniden oluştur
            migrationBuilder.CreateTable(
                name: "IndicatorGroups",
                columns: table => new
                {
                    GroupId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", Npgsql.EntityFrameworkCore.PostgreSQL.Metadata.NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GroupName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DepartmentId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndicatorGroups", x => x.GroupId);
                    table.ForeignKey(
                        name: "FK_IndicatorGroups_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            // DepartmentId'yi GroupId olarak yeniden adlandır
            migrationBuilder.RenameColumn(
                name: "DepartmentId",
                table: "Indicators",
                newName: "GroupId");

            // GroupId için index oluştur
            migrationBuilder.CreateIndex(
                name: "IX_Indicators_GroupId",
                table: "Indicators",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_IndicatorGroups_DepartmentId",
                table: "IndicatorGroups",
                column: "DepartmentId");

            // IndicatorGroup ile foreign key ilişkisi kur
            migrationBuilder.AddForeignKey(
                name: "FK_Indicators_IndicatorGroups_GroupId",
                table: "Indicators",
                column: "GroupId",
                principalTable: "IndicatorGroups",
                principalColumn: "GroupId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
