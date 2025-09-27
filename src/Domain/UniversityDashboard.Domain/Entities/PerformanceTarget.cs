using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class PerformanceTarget
    {
        public int TargetId { get; set; }
        public string TargetName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int PeriodId { get; set; }
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public decimal TargetValue { get; set; }
        public decimal? ActualValue { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public TargetDirection Direction { get; set; } = TargetDirection.Positive;
        public TargetStatus Status { get; set; } = TargetStatus.Draft;
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public int? AssignedToUserId { get; set; }
        public int? AssignedToDepartmentId { get; set; }
        
        // Navigation Properties
        public virtual PerformancePeriod Period { get; set; } = null!;
        public virtual Department? Department { get; set; }
        public virtual ApplicationUser? User { get; set; }
        public virtual ApplicationUser CreatedByUser { get; set; } = null!;
        public virtual ApplicationUser? AssignedToUser { get; set; }
        public virtual Department? AssignedToDepartment { get; set; }
        public virtual ICollection<PerformanceTargetProgress> Progresses { get; set; } = new List<PerformanceTargetProgress>();
    }
}
