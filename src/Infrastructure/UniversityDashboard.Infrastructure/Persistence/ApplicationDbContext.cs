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
        
        // Indicator related DbSets
        public DbSet<Indicator> Indicators { get; set; }
        public DbSet<IndicatorRootValue> IndicatorRootValues { get; set; }
        public DbSet<IndicatorData> IndicatorData { get; set; }
        public DbSet<IndicatorHistoricalData> IndicatorHistoricalData { get; set; }

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

            // Indicator configuration
            builder.Entity<Indicator>(entity =>
            {
                entity.HasKey(i => i.IndicatorId);
                
                entity.HasIndex(i => i.IndicatorCode)
                    .IsUnique();
                    
                entity.Property(i => i.IndicatorCode)
                    .HasMaxLength(50)
                    .IsRequired();
                    
                entity.Property(i => i.IndicatorName)
                    .HasMaxLength(200)
                    .IsRequired();
                    
                entity.Property(i => i.DataType)
                    .HasConversion<string>();
                    
                entity.Property(i => i.PeriodType)
                    .HasConversion<string>();
                
                entity.HasOne(i => i.Department)
                    .WithMany(d => d.Indicators)
                    .HasForeignKey(i => i.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(i => i.AssignedUser)
                    .WithMany()
                    .HasForeignKey(i => i.AssignedUserId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(i => i.NotificationUser)
                    .WithMany()
                    .HasForeignKey(i => i.NotificationUserId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(i => i.Creator)
                    .WithMany()
                    .HasForeignKey(i => i.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // IndicatorRootValue configuration
            builder.Entity<IndicatorRootValue>(entity =>
            {
                entity.HasKey(irv => irv.RootValueId);
                
                entity.HasOne(irv => irv.Indicator)
                    .WithMany(i => i.RootValues)
                    .HasForeignKey(irv => irv.IndicatorId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.Property(irv => irv.RootValue)
                    .HasMaxLength(100)
                    .IsRequired();
            });

            // IndicatorData configuration
            builder.Entity<IndicatorData>(entity =>
            {
                entity.HasKey(id => id.DataId);
                
                entity.HasIndex(id => new { id.IndicatorId, id.Year, id.Period })
                    .IsUnique();
                    
                entity.Property(id => id.Status)
                    .HasConversion<string>();
                    
                entity.Property(id => id.Value)
                    .HasPrecision(20, 4);
                
                entity.HasOne(id => id.Indicator)
                    .WithMany(i => i.Data)
                    .HasForeignKey(id => id.IndicatorId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(id => id.EnteredByUser)
                    .WithMany()
                    .HasForeignKey(id => id.EnteredBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // IndicatorHistoricalData configuration
            builder.Entity<IndicatorHistoricalData>(entity =>
            {
                entity.HasKey(ihd => ihd.HistoricalId);
                
                entity.HasOne(ihd => ihd.Indicator)
                    .WithMany(i => i.HistoricalData)
                    .HasForeignKey(ihd => ihd.IndicatorId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.Property(ihd => ihd.PeriodLabel)
                    .HasMaxLength(50)
                    .IsRequired();
                    
                entity.Property(ihd => ihd.Value)
                    .HasPrecision(20, 4);
            });
        }
    }
}