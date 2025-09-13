using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChartSystemTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChartSections",
                columns: table => new
                {
                    SectionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SectionName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ParentId = table.Column<int>(type: "integer", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartSections", x => x.SectionId);
                    table.ForeignKey(
                        name: "FK_ChartSections_ChartSections_ParentId",
                        column: x => x.ParentId,
                        principalTable: "ChartSections",
                        principalColumn: "SectionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Charts",
                columns: table => new
                {
                    ChartId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChartName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ChartType = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Subtitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    SectionId = table.Column<int>(type: "integer", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    ShowHistoricalData = table.Column<bool>(type: "boolean", nullable: false),
                    HistoricalDataDisplayType = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Charts", x => x.ChartId);
                    table.ForeignKey(
                        name: "FK_Charts_AspNetUsers_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Charts_ChartSections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "ChartSections",
                        principalColumn: "SectionId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChartFilters",
                columns: table => new
                {
                    FilterId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChartId = table.Column<int>(type: "integer", nullable: false),
                    FilterName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FilterType = table.Column<string>(type: "text", nullable: false),
                    FilterValue = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartFilters", x => x.FilterId);
                    table.ForeignKey(
                        name: "FK_ChartFilters_Charts_ChartId",
                        column: x => x.ChartId,
                        principalTable: "Charts",
                        principalColumn: "ChartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChartGroups",
                columns: table => new
                {
                    GroupId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChartId = table.Column<int>(type: "integer", nullable: false),
                    GroupName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartGroups", x => x.GroupId);
                    table.ForeignKey(
                        name: "FK_ChartGroups_Charts_ChartId",
                        column: x => x.ChartId,
                        principalTable: "Charts",
                        principalColumn: "ChartId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChartIndicators",
                columns: table => new
                {
                    ChartId = table.Column<int>(type: "integer", nullable: false),
                    IndicatorId = table.Column<int>(type: "integer", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: true),
                    Label = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    IsVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartIndicators", x => new { x.ChartId, x.IndicatorId });
                    table.ForeignKey(
                        name: "FK_ChartIndicators_Charts_ChartId",
                        column: x => x.ChartId,
                        principalTable: "Charts",
                        principalColumn: "ChartId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChartIndicators_Indicators_IndicatorId",
                        column: x => x.IndicatorId,
                        principalTable: "Indicators",
                        principalColumn: "IndicatorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChartFilterIndicators",
                columns: table => new
                {
                    FilterId = table.Column<int>(type: "integer", nullable: false),
                    IndicatorId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartFilterIndicators", x => new { x.FilterId, x.IndicatorId });
                    table.ForeignKey(
                        name: "FK_ChartFilterIndicators_ChartFilters_FilterId",
                        column: x => x.FilterId,
                        principalTable: "ChartFilters",
                        principalColumn: "FilterId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChartFilterIndicators_Indicators_IndicatorId",
                        column: x => x.IndicatorId,
                        principalTable: "Indicators",
                        principalColumn: "IndicatorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChartGroupIndicators",
                columns: table => new
                {
                    GroupId = table.Column<int>(type: "integer", nullable: false),
                    IndicatorId = table.Column<int>(type: "integer", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartGroupIndicators", x => new { x.GroupId, x.IndicatorId });
                    table.ForeignKey(
                        name: "FK_ChartGroupIndicators_ChartGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "ChartGroups",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChartGroupIndicators_Indicators_IndicatorId",
                        column: x => x.IndicatorId,
                        principalTable: "Indicators",
                        principalColumn: "IndicatorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChartFilterIndicators_IndicatorId",
                table: "ChartFilterIndicators",
                column: "IndicatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartFilters_ChartId",
                table: "ChartFilters",
                column: "ChartId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartGroupIndicators_IndicatorId",
                table: "ChartGroupIndicators",
                column: "IndicatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartGroups_ChartId",
                table: "ChartGroups",
                column: "ChartId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartIndicators_IndicatorId",
                table: "ChartIndicators",
                column: "IndicatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Charts_CreatedBy",
                table: "Charts",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Charts_SectionId",
                table: "Charts",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartSections_ParentId",
                table: "ChartSections",
                column: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChartFilterIndicators");

            migrationBuilder.DropTable(
                name: "ChartGroupIndicators");

            migrationBuilder.DropTable(
                name: "ChartIndicators");

            migrationBuilder.DropTable(
                name: "ChartFilters");

            migrationBuilder.DropTable(
                name: "ChartGroups");

            migrationBuilder.DropTable(
                name: "Charts");

            migrationBuilder.DropTable(
                name: "ChartSections");
        }
    }
}
