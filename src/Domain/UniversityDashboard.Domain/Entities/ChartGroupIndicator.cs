namespace UniversityDashBoardProject.Domain.Entities
{
    public class ChartGroupIndicator
    {
        public int GroupId { get; set; }
        public int IndicatorId { get; set; }
        public int DisplayOrder { get; set; } = 0;
        
        // Navigation Properties
        public virtual ChartGroup Group { get; set; } = null!;
        public virtual Indicator Indicator { get; set; } = null!;
    }
}
