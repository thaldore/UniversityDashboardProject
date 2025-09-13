using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartFilter
    {
        public int FilterId { get; set; }
        public int ChartId { get; set; }
        public string FilterName { get; set; } = string.Empty;
        public FilterType FilterType { get; set; }
        public string FilterValue { get; set; } = string.Empty;
        public bool IsDefault { get; set; } = false;
        public int DisplayOrder { get; set; } = 0;
        
        // Navigation Properties
        public virtual Chart Chart { get; set; } = null!;
        public virtual ICollection<ChartFilterIndicator> ChartFilterIndicators { get; set; } = new List<ChartFilterIndicator>();
    }
}
