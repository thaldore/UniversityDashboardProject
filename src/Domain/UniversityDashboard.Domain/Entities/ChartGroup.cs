namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartGroup
    {
        public int GroupId { get; set; }
        public int ChartId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public string? Color { get; set; } // HEX color code for group
        
        // Navigation Properties
        public virtual Chart Chart { get; set; } = null!;
        public virtual ICollection<ChartGroupIndicator> ChartGroupIndicators { get; set; } = new List<ChartGroupIndicator>();
    }
}
