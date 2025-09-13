namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartIndicator
    {
        public int ChartId { get; set; }
        public int IndicatorId { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public string? Color { get; set; } // HEX color code
        public string? Label { get; set; } // Custom label for chart display
        public bool IsVisible { get; set; } = true;
        
        // Navigation Properties
        public virtual Chart Chart { get; set; } = null!;
        public virtual Indicator Indicator { get; set; } = null!;
    }
}
