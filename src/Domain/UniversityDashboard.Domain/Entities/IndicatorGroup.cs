using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class IndicatorGroup
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual Department Department { get; set; } = null!;
        public virtual ICollection<Indicator> Indicators { get; set; } = new List<Indicator>();
    }
}
