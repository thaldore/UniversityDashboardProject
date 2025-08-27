using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UniversityDashBoardProject.Domain.Entities;

namespace UniversityDashBoardProject.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int, 
        IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, 
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Department> Departments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // UserRole configuration
            builder.Entity<UserRole>(entity =>
            {
                entity.HasKey(ur => new { ur.UserId, ur.RoleId });
                
                entity.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
                    
                entity.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            // Department configuration
            builder.Entity<Department>(entity =>
            {
                entity.HasKey(d => d.DepartmentId);
                
                entity.HasOne(d => d.Parent)
                    .WithMany(d => d.Children)
                    .HasForeignKey(d => d.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ApplicationUser configuration
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.HasOne(u => u.Department)
                    .WithMany(d => d.Users)
                    .HasForeignKey(u => u.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}