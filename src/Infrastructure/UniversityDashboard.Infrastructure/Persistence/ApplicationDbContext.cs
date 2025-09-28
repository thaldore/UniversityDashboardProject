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

        // Chart related DbSets
        public DbSet<Chart> Charts { get; set; }
        public DbSet<ChartSection> ChartSections { get; set; }
        public DbSet<ChartIndicator> ChartIndicators { get; set; }
        public DbSet<ChartFilter> ChartFilters { get; set; }
        public DbSet<ChartGroup> ChartGroups { get; set; }
        public DbSet<ChartFilterIndicator> ChartFilterIndicators { get; set; }
        public DbSet<ChartGroupIndicator> ChartGroupIndicators { get; set; }

        // Performance related DbSets
        public DbSet<PerformancePeriod> PerformancePeriods { get; set; }
        public DbSet<PerformancePeriodAssignment> PerformancePeriodAssignments { get; set; }
        public DbSet<PerformanceTarget> PerformanceTargets { get; set; }
        public DbSet<PerformanceTargetProgress> PerformanceTargetProgresses { get; set; }
        public DbSet<PerformanceScoring> PerformanceScorings { get; set; }

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

            // Chart configuration
            builder.Entity<Chart>(entity =>
            {
                entity.HasKey(c => c.ChartId);
                
                entity.Property(c => c.ChartName)
                    .HasMaxLength(200)
                    .IsRequired();
                    
                entity.Property(c => c.Title)
                    .HasMaxLength(200)
                    .IsRequired();
                    
                entity.Property(c => c.Subtitle)
                    .HasMaxLength(200);
                    
                entity.Property(c => c.ChartType)
                    .HasConversion<string>();
                    
                entity.Property(c => c.HistoricalDataDisplayType)
                    .HasConversion<string>();
                
                entity.HasOne(c => c.Section)
                    .WithMany(s => s.Charts)
                    .HasForeignKey(c => c.SectionId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(c => c.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(c => c.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ChartSection configuration
            builder.Entity<ChartSection>(entity =>
            {
                entity.HasKey(cs => cs.SectionId);
                
                entity.Property(cs => cs.SectionName)
                    .HasMaxLength(200)
                    .IsRequired();
                
                entity.HasOne(cs => cs.Parent)
                    .WithMany(cs => cs.Children)
                    .HasForeignKey(cs => cs.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ChartIndicator configuration
            builder.Entity<ChartIndicator>(entity =>
            {
                entity.HasKey(ci => new { ci.ChartId, ci.IndicatorId });
                
                entity.Property(ci => ci.Color)
                    .HasMaxLength(7);
                    
                entity.Property(ci => ci.Label)
                    .HasMaxLength(200);
                
                entity.HasOne(ci => ci.Chart)
                    .WithMany(c => c.ChartIndicators)
                    .HasForeignKey(ci => ci.ChartId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(ci => ci.Indicator)
                    .WithMany()
                    .HasForeignKey(ci => ci.IndicatorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ChartFilter configuration
            builder.Entity<ChartFilter>(entity =>
            {
                entity.HasKey(cf => cf.FilterId);
                
                entity.Property(cf => cf.FilterName)
                    .HasMaxLength(100)
                    .IsRequired();
                    
                entity.Property(cf => cf.FilterType)
                    .HasConversion<string>();
                    
                entity.Property(cf => cf.FilterValue)
                    .HasMaxLength(100)
                    .IsRequired();
                
                entity.HasOne(cf => cf.Chart)
                    .WithMany(c => c.ChartFilters)
                    .HasForeignKey(cf => cf.ChartId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ChartGroup configuration
            builder.Entity<ChartGroup>(entity =>
            {
                entity.HasKey(cg => cg.GroupId);
                
                entity.Property(cg => cg.GroupName)
                    .HasMaxLength(100)
                    .IsRequired();
                    
                entity.Property(cg => cg.Color)
                    .HasMaxLength(7);
                    
                entity.Property(cg => cg.GroupType)
                    .HasConversion<string>();
                
                entity.HasOne(cg => cg.Chart)
                    .WithMany(c => c.ChartGroups)
                    .HasForeignKey(cg => cg.ChartId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                // Grup hiyerarşisi için self-referencing relationship
                entity.HasOne(cg => cg.ParentGroup)
                    .WithMany(cg => cg.ChildGroups)
                    .HasForeignKey(cg => cg.ParentGroupId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ChartFilterIndicator configuration
            builder.Entity<ChartFilterIndicator>(entity =>
            {
                entity.HasKey(cfi => new { cfi.FilterId, cfi.IndicatorId });
                
                entity.HasOne(cfi => cfi.Filter)
                    .WithMany(cf => cf.ChartFilterIndicators)
                    .HasForeignKey(cfi => cfi.FilterId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(cfi => cfi.Indicator)
                    .WithMany()
                    .HasForeignKey(cfi => cfi.IndicatorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ChartGroupIndicator configuration
            builder.Entity<ChartGroupIndicator>(entity =>
            {
                entity.HasKey(cgi => new { cgi.GroupId, cgi.IndicatorId });
                
                entity.HasOne(cgi => cgi.Group)
                    .WithMany(cg => cg.ChartGroupIndicators)
                    .HasForeignKey(cgi => cgi.GroupId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(cgi => cgi.Indicator)
                    .WithMany()
                    .HasForeignKey(cgi => cgi.IndicatorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Performance Period configuration
            builder.Entity<PerformancePeriod>(entity =>
            {
                entity.HasKey(pp => pp.PeriodId);
                
                entity.Property(pp => pp.PeriodName)
                    .HasMaxLength(200)
                    .IsRequired();
                    
                entity.HasOne(pp => pp.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(pp => pp.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Performance Period Assignment configuration
            builder.Entity<PerformancePeriodAssignment>(entity =>
            {
                entity.HasKey(ppa => ppa.AssignmentId);
                
                entity.Property(ppa => ppa.TargetEntryRole)
                    .HasMaxLength(50);
                    
                entity.Property(ppa => ppa.ResultEntryRole)
                    .HasMaxLength(50);
                
                entity.HasOne(ppa => ppa.Period)
                    .WithMany(pp => pp.PeriodAssignments)
                    .HasForeignKey(ppa => ppa.PeriodId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(ppa => ppa.Department)
                    .WithMany()
                    .HasForeignKey(ppa => ppa.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(ppa => ppa.User)
                    .WithMany()
                    .HasForeignKey(ppa => ppa.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.Property(ppa => ppa.AssignmentType)
                    .HasConversion<string>();
            });

            // Performance Target configuration
            builder.Entity<PerformanceTarget>(entity =>
            {
                entity.HasKey(pt => pt.TargetId);
                
                entity.Property(pt => pt.TargetName)
                    .HasMaxLength(200)
                    .IsRequired();
                    
                entity.Property(pt => pt.Unit)
                    .HasMaxLength(50)
                    .IsRequired();
                    
                entity.Property(pt => pt.TargetValue)
                    .HasPrecision(20, 4);
                    
                entity.Property(pt => pt.ActualValue)
                    .HasPrecision(20, 4);
                    
                entity.Property(pt => pt.Weight)
                    .HasPrecision(5, 2);
                    
                entity.Property(pt => pt.Direction)
                    .HasConversion<string>();
                    
                entity.Property(pt => pt.Status)
                    .HasConversion<string>();
                
                entity.HasOne(pt => pt.Period)
                    .WithMany(pp => pp.Targets)
                    .HasForeignKey(pt => pt.PeriodId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(pt => pt.Department)
                    .WithMany()
                    .HasForeignKey(pt => pt.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(pt => pt.User)
                    .WithMany()
                    .HasForeignKey(pt => pt.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(pt => pt.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(pt => pt.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(pt => pt.AssignedToUser)
                    .WithMany()
                    .HasForeignKey(pt => pt.AssignedToUserId)
                    .OnDelete(DeleteBehavior.Restrict);
                    
                entity.HasOne(pt => pt.AssignedToDepartment)
                    .WithMany()
                    .HasForeignKey(pt => pt.AssignedToDepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Performance Target Progress configuration
            builder.Entity<PerformanceTargetProgress>(entity =>
            {
                entity.HasKey(ptp => ptp.ProgressId);
                
                entity.Property(ptp => ptp.ProgressValue)
                    .HasPrecision(20, 4);
                    
                entity.Property(ptp => ptp.Status)
                    .HasConversion<string>();
                
                entity.HasOne(ptp => ptp.Target)
                    .WithMany(pt => pt.Progresses)
                    .HasForeignKey(ptp => ptp.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne(ptp => ptp.EnteredByUser)
                    .WithMany()
                    .HasForeignKey(ptp => ptp.EnteredBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Performance Scoring configuration
            builder.Entity<PerformanceScoring>(entity =>
            {
                entity.HasKey(ps => ps.ScoringId);
                
                entity.Property(ps => ps.MinValue)
                    .HasPrecision(20, 4);
                    
                entity.Property(ps => ps.MaxValue)
                    .HasPrecision(20, 4);
                    
                entity.Property(ps => ps.Score)
                    .HasPrecision(20, 4);
                    
                entity.Property(ps => ps.LetterGrade)
                    .HasMaxLength(10)
                    .IsRequired();
                
                entity.HasOne(ps => ps.Period)
                    .WithMany(pp => pp.Scorings)
                    .HasForeignKey(ps => ps.PeriodId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}