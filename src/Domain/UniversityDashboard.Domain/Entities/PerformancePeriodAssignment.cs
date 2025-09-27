using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class PerformancePeriodAssignment
    {
        public int AssignmentId { get; set; }
        public int PeriodId { get; set; }
        public int? DepartmentId { get; set; }
        public int? UserId { get; set; }
        public AssignmentType AssignmentType { get; set; }
        public int? TargetEntryUserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual PerformancePeriod Period { get; set; } = null!;
        public virtual Department? Department { get; set; }
        public virtual ApplicationUser? User { get; set; }
        public virtual ApplicationUser? TargetEntryUser { get; set; }
    }
}
