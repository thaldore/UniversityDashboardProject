using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class PerformancePeriod
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; } = string.Empty;
        public DateTime PeriodStartDate { get; set; }
        public DateTime PeriodEndDate { get; set; }
        public DateTime TargetEntryStartDate { get; set; }
        public DateTime TargetEntryEndDate { get; set; }
        public DateTime TargetReviseStartDate { get; set; }
        public DateTime TargetReviseEndDate { get; set; }
        public DateTime ResultEntryStartDate { get; set; }
        public DateTime ResultEntryEndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public bool SendNotification { get; set; } = true;
        public bool SendEmail { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        
        // Navigation Properties
        public virtual ApplicationUser CreatedByUser { get; set; } = null!;
        public virtual ICollection<PerformancePeriodAssignment> PeriodAssignments { get; set; } = new List<PerformancePeriodAssignment>();
        public virtual ICollection<PerformanceTarget> Targets { get; set; } = new List<PerformanceTarget>();
        public virtual ICollection<PerformanceScoring> Scorings { get; set; } = new List<PerformanceScoring>();
    }
}
