namespace UniversityDashBoardProject.Domain.Entities
{
    public class IndicatorRootValue
    {
        public int RootValueId { get; set; }
        public int IndicatorId { get; set; }
        public string RootValue { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; } = 1;
        
        // Navigation Properties
        public virtual Indicator Indicator { get; set; } = null!;
    }
}
