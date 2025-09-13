namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartFilterIndicator
    {
        public int FilterId { get; set; }
        public int IndicatorId { get; set; }
        
        // Navigation Properties
        public virtual ChartFilter Filter { get; set; } = null!;
        public virtual Indicator Indicator { get; set; } = null!;
    }
}
