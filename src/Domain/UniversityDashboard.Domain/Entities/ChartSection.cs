namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartSection
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual ChartSection? Parent { get; set; }
        public virtual ICollection<ChartSection> Children { get; set; } = new List<ChartSection>();
        public virtual ICollection<Chart> Charts { get; set; } = new List<Chart>();
    }
}
