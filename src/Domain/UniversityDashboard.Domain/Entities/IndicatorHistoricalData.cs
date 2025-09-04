namespace UniversityDashBoardProject.Domain.Entities
{
    public class IndicatorHistoricalData
    {
        public int HistoricalId { get; set; }
        public int IndicatorId { get; set; }
        public string PeriodLabel { get; set; } = string.Empty; // "Geçmiş Dönem 1", "Geçmiş Dönem 2"
        public decimal Value { get; set; }
        public string? Description { get; set; }
        
        // Navigation Properties
        public virtual Indicator Indicator { get; set; } = null!;
    }
}
