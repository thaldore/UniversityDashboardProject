using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class PerformanceTargetProgress
    {
        public int ProgressId { get; set; }
        public int TargetId { get; set; }
        public decimal ProgressValue { get; set; }
        public DateTime ProgressDate { get; set; }
        public string? Notes { get; set; }
        public ProgressStatus Status { get; set; } = ProgressStatus.Draft;
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int EnteredBy { get; set; }
        
        // Navigation Properties
        public virtual PerformanceTarget Target { get; set; } = null!;
        public virtual ApplicationUser EnteredByUser { get; set; } = null!;
    }
}
