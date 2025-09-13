using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class Chart
    {
        public int ChartId { get; set; }
        public string ChartName { get; set; } = string.Empty;
        public ChartType ChartType { get; set; } = ChartType.Column;
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public int SectionId { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool ShowHistoricalData { get; set; } = false;
        public HistoricalDataDisplayType? HistoricalDataDisplayType { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual ChartSection Section { get; set; } = null!;
        public virtual ApplicationUser CreatedByUser { get; set; } = null!;
        public virtual ICollection<ChartIndicator> ChartIndicators { get; set; } = new List<ChartIndicator>();
        public virtual ICollection<ChartFilter> ChartFilters { get; set; } = new List<ChartFilter>();
        public virtual ICollection<ChartGroup> ChartGroups { get; set; } = new List<ChartGroup>();
    }
}
