using UniversityDashBoardProject.Domain.Enums;

namespace UniversityDashBoardProject.Domain.Entities
{
    public class IndicatorData
    {
        public int DataId { get; set; }
        public int IndicatorId { get; set; }
        public int Year { get; set; }
        public int Period { get; set; } = 1;
        public decimal? Value { get; set; }
        public DataStatus Status { get; set; } = DataStatus.Draft;
        public string? Notes { get; set; }
        public int EnteredBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public virtual Indicator Indicator { get; set; } = null!;
        public virtual ApplicationUser EnteredByUser { get; set; } = null!;
    }
}
