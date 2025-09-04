using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIndicatorSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IndicatorGroups",
                columns: table => new
                {
                    GroupId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Indicators",
                columns: table => new
                {
                    IndicatorId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IndicatorCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IndicatorName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    GroupId = table.Column<int>(type: "integer", nullable: false),
                    DataType = table.Column<string>(type: "text", nullable: false),
                    PeriodType = table.Column<string>(type: "text", nullable: false),
                    PeriodStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NotificationPeriod = table.Column<int>(type: "integer", nullable: false),
                    IsAutomatic = table.Column<bool>(type: "boolean", nullable: false),
                    AssignedUserId = table.Column<int>(type: "integer", nullable: true),
                    NotificationUserId = table.Column<int>(type: "integer", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Indicators", x => x.IndicatorId);
                    table.ForeignKey(
                        name: "FK_Indicators_AspNetUsers_AssignedUserId",
                        column: x => x.AssignedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Indicators_AspNetUsers_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Indicators_AspNetUsers_NotificationUserId",
                        column: x => x.NotificationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Indicators_IndicatorGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "IndicatorGroups",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IndicatorData",
                columns: table => new
                {
                    DataId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IndicatorId = table.Column<int>(type: "integer", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Period = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    EnteredBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndicatorData", x => x.DataId);
                    table.ForeignKey(
                        name: "FK_IndicatorData_AspNetUsers_EnteredBy",
                        column: x => x.EnteredBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IndicatorData_Indicators_IndicatorId",
                        column: x => x.IndicatorId,
                        principalTable: "Indicators",
                        principalColumn: "IndicatorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IndicatorHistoricalData",
                columns: table => new
                {
                    HistoricalId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IndicatorId = table.Column<int>(type: "integer", nullable: false),
                    PeriodLabel = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Value = table.Column<decimal>(type: "numeric(20,4)", precision: 20, scale: 4, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndicatorHistoricalData", x => x.HistoricalId);
                    table.ForeignKey(
                        name: "FK_IndicatorHistoricalData_Indicators_IndicatorId",
                        column: x => x.IndicatorId,
                        principalTable: "Indicators",
                        principalColumn: "IndicatorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IndicatorRootValues",
                columns: table => new
                {
                    RootValueId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IndicatorId = table.Column<int>(type: "integer", nullable: false),
                    RootValue = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndicatorRootValues", x => x.RootValueId);
                    table.ForeignKey(
                        name: "FK_IndicatorRootValues_Indicators_IndicatorId",
                        column: x => x.IndicatorId,
                        principalTable: "Indicators",
                        principalColumn: "IndicatorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IndicatorData_EnteredBy",
                table: "IndicatorData",
                column: "EnteredBy");

            migrationBuilder.CreateIndex(
                name: "IX_IndicatorData_IndicatorId_Year_Period",
                table: "IndicatorData",
                columns: new[] { "IndicatorId", "Year", "Period" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IndicatorGroups_DepartmentId",
                table: "IndicatorGroups",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_IndicatorHistoricalData_IndicatorId",
                table: "IndicatorHistoricalData",
                column: "IndicatorId");

            migrationBuilder.CreateIndex(
                name: "IX_IndicatorRootValues_IndicatorId",
                table: "IndicatorRootValues",
                column: "IndicatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Indicators_AssignedUserId",
                table: "Indicators",
                column: "AssignedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Indicators_CreatedBy",
                table: "Indicators",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Indicators_GroupId",
                table: "Indicators",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Indicators_IndicatorCode",
                table: "Indicators",
                column: "IndicatorCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Indicators_NotificationUserId",
                table: "Indicators",
                column: "NotificationUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IndicatorData");

            migrationBuilder.DropTable(
                name: "IndicatorHistoricalData");

            migrationBuilder.DropTable(
                name: "IndicatorRootValues");

            migrationBuilder.DropTable(
                name: "Indicators");

            migrationBuilder.DropTable(
                name: "IndicatorGroups");
        }
    }
}
