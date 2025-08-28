using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Departman verisi ekleme
            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "DepartmentName", "IsActive", "CreatedAt", "ParentId" },
                values: new object[] { "Öğrenci İşleri", true, DateTime.UtcNow, null });

            // Roller ekleme
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Name", "NormalizedName", "Description", "ConcurrencyStamp" },
                values: new object[,]
                {
                    { "Admin", "ADMIN", "Sistem yöneticisi", Guid.NewGuid().ToString() },
                    { "Manager", "MANAGER", "Yönetici", Guid.NewGuid().ToString() },
                    { "User", "USER", "Kullanıcı", Guid.NewGuid().ToString() }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Eklenen verileri geri al
            migrationBuilder.DeleteData(
                table: "Departments",
                keyColumn: "DepartmentName",
                keyValue: "Öğrenci İşleri");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Name",
                keyValues: new object[] { "Admin", "Manager", "User" });
        }
    }
}
