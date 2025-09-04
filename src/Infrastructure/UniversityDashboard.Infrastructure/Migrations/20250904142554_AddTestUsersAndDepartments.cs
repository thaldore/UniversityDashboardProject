using Microsoft.EntityFrameworkCore.Migrations;
using System;

#nullable disable

namespace UniversityDashboard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTestUsersAndDepartments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Yeni departmanları ekle
            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "DepartmentName", "IsActive", "CreatedAt", "ParentId" },
                values: new object[,]
                {
                    { "İnsan Kaynakları", true, DateTime.UtcNow, null },
                    { "Teknoloji Ofisi", true, DateTime.UtcNow, null }
                });

            // Test kullanıcıları ekle
            migrationBuilder.Sql(@"
                -- ManagerTest1 kullanıcısını ekle
                INSERT INTO ""AspNetUsers"" (""UserName"", ""NormalizedUserName"", ""Email"", ""NormalizedEmail"", ""EmailConfirmed"", ""PasswordHash"", ""SecurityStamp"", ""ConcurrencyStamp"", ""PhoneNumberConfirmed"", ""TwoFactorEnabled"", ""LockoutEnabled"", ""AccessFailedCount"", ""FirstName"", ""LastName"", ""IsActive"", ""CreatedAt"", ""DepartmentId"")
                VALUES 
                ('ManagerTest1', 'MANAGERTEST1', 'ManagerTest1@example.com', 'MANAGERTEST1@EXAMPLE.COM', true, 'AQAAAAIAAYagAAAAEOYZZWY5zQtT1n0G4xS3JLGy4GjFUlzEzqPqSGJ8aXVH3K7KQzLpN9uY2mR8zW3vPw==', md5(random()::text), md5(random()::text), false, false, true, 0, 'Manager Test', 'One', true, NOW(), (SELECT ""DepartmentId"" FROM ""Departments"" WHERE ""DepartmentName"" = 'İnsan Kaynakları' LIMIT 1)),
                ('ManagerTest2', 'MANAGERTEST2', 'ManagerTest2@example.com', 'MANAGERTEST2@EXAMPLE.COM', true, 'AQAAAAIAAYagAAAAEOYZZWY5zQtT1n0G4xS3JLGy4GjFUlzEzqPqSGJ8aXVH3K7KQzLpN9uY2mR8zW3vPw==', md5(random()::text), md5(random()::text), false, false, true, 0, 'Manager Test', 'Two', true, NOW(), (SELECT ""DepartmentId"" FROM ""Departments"" WHERE ""DepartmentName"" = 'Teknoloji Ofisi' LIMIT 1)),
                ('AdminTest1', 'ADMINTEST1', 'AdminTest1@example.com', 'ADMINTEST1@EXAMPLE.COM', true, 'AQAAAAIAAYagAAAAEOYZZWY5zQtT1n0G4xS3JLGy4GjFUlzEzqPqSGJ8aXVH3K7KQzLpN9uY2mR8zW3vPw==', md5(random()::text), md5(random()::text), false, false, true, 0, 'Admin Test', 'One', true, NOW(), (SELECT ""DepartmentId"" FROM ""Departments"" WHERE ""DepartmentName"" = 'İnsan Kaynakları' LIMIT 1)),
                ('AdminTest2', 'ADMINTEST2', 'AdminTest2@example.com', 'ADMINTEST2@EXAMPLE.COM', true, 'AQAAAAIAAYagAAAAEOYZZWY5zQtT1n0G4xS3JLGy4GjFUlzEzqPqSGJ8aXVH3K7KQzLpN9uY2mR8zW3vPw==', md5(random()::text), md5(random()::text), false, false, true, 0, 'Admin Test', 'Two', true, NOW(), (SELECT ""DepartmentId"" FROM ""Departments"" WHERE ""DepartmentName"" = 'Teknoloji Ofisi' LIMIT 1)),
                ('UserTest1', 'USERTEST1', 'UserTest1@example.com', 'USERTEST1@EXAMPLE.COM', true, 'AQAAAAIAAYagAAAAEOYZZWY5zQtT1n0G4xS3JLGy4GjFUlzEzqPqSGJ8aXVH3K7KQzLpN9uY2mR8zW3vPw==', md5(random()::text), md5(random()::text), false, false, true, 0, 'User Test', 'One', true, NOW(), (SELECT ""DepartmentId"" FROM ""Departments"" WHERE ""DepartmentName"" = 'İnsan Kaynakları' LIMIT 1)),
                ('UserTest2', 'USERTEST2', 'UserTest2@example.com', 'USERTEST2@EXAMPLE.COM', true, 'AQAAAAIAAYagAAAAEOYZZWY5zQtT1n0G4xS3JLGy4GjFUlzEzqPqSGJ8aXVH3K7KQzLpN9uY2mR8zW3vPw==', md5(random()::text), md5(random()::text), false, false, true, 0, 'User Test', 'Two', true, NOW(), (SELECT ""DepartmentId"" FROM ""Departments"" WHERE ""DepartmentName"" = 'Teknoloji Ofisi' LIMIT 1));
            ");

            // Kullanıcılara rolleri atama
            migrationBuilder.Sql(@"
                INSERT INTO ""AspNetUserRoles"" (""UserId"", ""RoleId"")
                SELECT u.""Id"", r.""Id""
                FROM ""AspNetUsers"" u, ""AspNetRoles"" r
                WHERE u.""UserName"" IN ('ManagerTest1', 'ManagerTest2') AND r.""Name"" = 'Manager'
                
                UNION ALL
                
                SELECT u.""Id"", r.""Id""
                FROM ""AspNetUsers"" u, ""AspNetRoles"" r
                WHERE u.""UserName"" IN ('AdminTest1', 'AdminTest2') AND r.""Name"" = 'Admin'
                
                UNION ALL
                
                SELECT u.""Id"", r.""Id""
                FROM ""AspNetUsers"" u, ""AspNetRoles"" r
                WHERE u.""UserName"" IN ('UserTest1', 'UserTest2') AND r.""Name"" = 'User';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Test kullanıcılarını ve rol atamalarını sil
            migrationBuilder.Sql(@"
                DELETE FROM ""AspNetUserRoles"" 
                WHERE ""UserId"" IN (
                    SELECT ""Id"" FROM ""AspNetUsers"" 
                    WHERE ""UserName"" IN ('ManagerTest1', 'ManagerTest2', 'AdminTest1', 'AdminTest2', 'UserTest1', 'UserTest2')
                );
            ");

            migrationBuilder.Sql(@"
                DELETE FROM ""AspNetUsers"" 
                WHERE ""UserName"" IN ('ManagerTest1', 'ManagerTest2', 'AdminTest1', 'AdminTest2', 'UserTest1', 'UserTest2');
            ");

            // Eklenen departmanları sil
            migrationBuilder.DeleteData(
                table: "Departments",
                keyColumn: "DepartmentName",
                keyValues: new object[] { "İnsan Kaynakları", "Teknoloji Ofisi" });
        }
    }
}
