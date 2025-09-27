using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PerformancePeriods",
                columns: table => new
                {
                    PeriodId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PeriodName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TargetEntryStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TargetEntryEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TargetReviseStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TargetReviseEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ResultEntryStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ResultEntryEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SendNotification = table.Column<bool>(type: "boolean", nullable: false),
                    SendEmail = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformancePeriods", x => x.PeriodId);
                    table.ForeignKey(
                        name: "FK_PerformancePeriods_AspNetUsers_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PerformancePeriodAssignments",
                columns: table => new
                {
                    AssignmentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PeriodId = table.Column<int>(type: "integer", nullable: false),
                    DepartmentId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    AssignmentType = table.Column<string>(type: "text", nullable: false),
                    TargetEntryUserId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformancePeriodAssignments", x => x.AssignmentId);
                    table.ForeignKey(
                        name: "FK_PerformancePeriodAssignments_AspNetUsers_TargetEntryUserId",
                        column: x => x.TargetEntryUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformancePeriodAssignments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformancePeriodAssignments_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformancePeriodAssignments_PerformancePeriods_PeriodId",
                        column: x => x.PeriodId,
                        principalTable: "PerformancePeriods",
                        principalColumn: "PeriodId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PerformanceScorings",
                columns: table => new
                {
                    ScoringId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PeriodId = table.Column<int>(type: "integer", nullable: false),
                    MinValue = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: false),
                    MaxValue = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: true),
                    Score = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: false),
                    LetterGrade = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    IsForNegativeTarget = table.Column<bool>(type: "boolean", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceScorings", x => x.ScoringId);
                    table.ForeignKey(
                        name: "FK_PerformanceScorings_PerformancePeriods_PeriodId",
                        column: x => x.PeriodId,
                        principalTable: "PerformancePeriods",
                        principalColumn: "PeriodId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PerformanceTargets",
                columns: table => new
                {
                    TargetId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TargetName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    PeriodId = table.Column<int>(type: "integer", nullable: false),
                    DepartmentId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    TargetValue = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: false),
                    ActualValue = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: true),
                    Unit = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Weight = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    Direction = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    RejectionReason = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    AssignedToUserId = table.Column<int>(type: "integer", nullable: true),
                    AssignedToDepartmentId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceTargets", x => x.TargetId);
                    table.ForeignKey(
                        name: "FK_PerformanceTargets_AspNetUsers_AssignedToUserId",
                        column: x => x.AssignedToUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceTargets_AspNetUsers_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceTargets_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceTargets_Departments_AssignedToDepartmentId",
                        column: x => x.AssignedToDepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceTargets_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceTargets_PerformancePeriods_PeriodId",
                        column: x => x.PeriodId,
                        principalTable: "PerformancePeriods",
                        principalColumn: "PeriodId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PerformanceTargetProgresses",
                columns: table => new
                {
                    ProgressId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TargetId = table.Column<int>(type: "integer", nullable: false),
                    ProgressValue = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: false),
                    ProgressDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    RejectionReason = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EnteredBy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerformanceTargetProgresses", x => x.ProgressId);
                    table.ForeignKey(
                        name: "FK_PerformanceTargetProgresses_AspNetUsers_EnteredBy",
                        column: x => x.EnteredBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerformanceTargetProgresses_PerformanceTargets_TargetId",
                        column: x => x.TargetId,
                        principalTable: "PerformanceTargets",
                        principalColumn: "TargetId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PerformancePeriodAssignments_DepartmentId",
                table: "PerformancePeriodAssignments",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformancePeriodAssignments_PeriodId",
                table: "PerformancePeriodAssignments",
                column: "PeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformancePeriodAssignments_TargetEntryUserId",
                table: "PerformancePeriodAssignments",
                column: "TargetEntryUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformancePeriodAssignments_UserId",
                table: "PerformancePeriodAssignments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformancePeriods_CreatedBy",
                table: "PerformancePeriods",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceScorings_PeriodId",
                table: "PerformanceScorings",
                column: "PeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargetProgresses_EnteredBy",
                table: "PerformanceTargetProgresses",
                column: "EnteredBy");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargetProgresses_TargetId",
                table: "PerformanceTargetProgresses",
                column: "TargetId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargets_AssignedToDepartmentId",
                table: "PerformanceTargets",
                column: "AssignedToDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargets_AssignedToUserId",
                table: "PerformanceTargets",
                column: "AssignedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargets_CreatedBy",
                table: "PerformanceTargets",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargets_DepartmentId",
                table: "PerformanceTargets",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargets_PeriodId",
                table: "PerformanceTargets",
                column: "PeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_PerformanceTargets_UserId",
                table: "PerformanceTargets",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PerformancePeriodAssignments");

            migrationBuilder.DropTable(
                name: "PerformanceScorings");

            migrationBuilder.DropTable(
                name: "PerformanceTargetProgresses");

            migrationBuilder.DropTable(
                name: "PerformanceTargets");

            migrationBuilder.DropTable(
                name: "PerformancePeriods");
        }
    }
}
